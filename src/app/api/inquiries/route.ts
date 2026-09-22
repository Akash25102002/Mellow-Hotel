import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { guestInquiryCreateSchema } from "@/lib/validators";

// Helper to generate a friendly inquiry reference code e.g. "INQ-4921"
function generateReferenceCode(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `INQ-${randomDigits}`;
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const inquiries = await prisma.guestInquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        matchedItems: {
          select: {
            id: true,
            itemNumber: true,
            title: true,
            status: true,
            storageLocation: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, count: inquiries.length, inquiries });
  } catch (error) {
    console.error("GET /api/inquiries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch guest inquiries" },
      { status: 500 }
    );
  }
}

// Public submission: Guests report lost items
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = guestInquiryCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { guestName, guestEmail, guestPhone, roomNumber, checkOutDate, category, description } =
      result.data;

    let referenceCode = generateReferenceCode();
    // Ensure uniqueness
    let exists = await prisma.guestInquiry.findUnique({ where: { referenceCode } });
    while (exists) {
      referenceCode = generateReferenceCode();
      exists = await prisma.guestInquiry.findUnique({ where: { referenceCode } });
    }

    const newInquiry = await prisma.guestInquiry.create({
      data: {
        referenceCode,
        guestName,
        guestEmail: guestEmail.toLowerCase(),
        guestPhone,
        roomNumber,
        checkOutDate: new Date(checkOutDate),
        category,
        description,
        status: "OPEN",
      },
    });

    return NextResponse.json(
      {
        success: true,
        referenceCode: newInquiry.referenceCode,
        inquiryId: newInquiry.id,
        message: "Your inquiry has been submitted. Hotel staff will review matching inventory.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/inquiries error:", error);
    return NextResponse.json(
      { error: "Failed to submit lost item inquiry" },
      { status: 500 }
    );
  }
}
