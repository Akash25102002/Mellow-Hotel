import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { foundItemCreateSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

// Helper to generate the next item number: e.g. "FND-1006"
async function getNextItemNumber(): Promise<string> {
  const lastItem = await prisma.foundItem.findFirst({
    orderBy: { createdAt: "desc" },
    select: { itemNumber: true },
  });

  if (!lastItem || !lastItem.itemNumber.startsWith("FND-")) {
    return "FND-1001";
  }

  const numberPart = parseInt(lastItem.itemNumber.replace("FND-", ""), 10);
  if (isNaN(numberPart)) {
    return `FND-${Date.now().toString().slice(-4)}`;
  }

  return `FND-${numberPart + 1}`;
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.trim();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (category && category !== "ALL") {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { itemNumber: { contains: search } },
        { roomNumber: { contains: search } },
        { storageLocation: { contains: search } },
        { locationDetails: { contains: search } },
      ];
    }

    const items = await prisma.foundItem.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        loggedBy: {
          select: { id: true, fullName: true, email: true },
        },
        guestInquiry: {
          select: { id: true, referenceCode: true, guestName: true, guestEmail: true },
        },
      },
    });

    return NextResponse.json({ success: true, count: items.length, items });
  } catch (error) {
    console.error("GET /api/items error:", error);
    return NextResponse.json(
      { error: "Failed to fetch found items" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const result = foundItemCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const itemNumber = await getNextItemNumber();
    const { title, category, roomNumber, locationDetails, storageLocation, imageUrl, foundDate } =
      result.data;

    const parsedFoundDate = foundDate ? new Date(foundDate) : new Date();

    const newItem = await prisma.foundItem.create({
      data: {
        itemNumber,
        title,
        category,
        roomNumber,
        locationDetails: locationDetails || null,
        storageLocation,
        imageUrl: imageUrl || null,
        foundDate: parsedFoundDate,
        loggedById: user.userId,
        status: "IN_STORAGE",
      },
      include: {
        loggedBy: {
          select: { id: true, fullName: true },
        },
      },
    });

    // Create Audit Log entry
    await prisma.auditLog.create({
      data: {
        foundItemId: newItem.id,
        action: "CREATED",
        details: `Item ${itemNumber} logged into storage (${storageLocation}) by ${user.fullName}.`,
        performedById: user.userId,
        performedByName: user.fullName,
      },
    });

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error) {
    console.error("POST /api/items error:", error);
    return NextResponse.json(
      { error: "Failed to create found item record" },
      { status: 500 }
    );
  }
}
