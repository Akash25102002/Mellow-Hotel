import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { foundItemUpdateSchema } from "@/lib/validators";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const item = await prisma.foundItem.findUnique({
      where: { id: params.id },
      include: {
        loggedBy: {
          select: { id: true, fullName: true, email: true },
        },
        guestInquiry: true,
        auditLogs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("GET /api/items/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve item details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const existingItem = await prisma.foundItem.findUnique({
      where: { id: params.id },
    });

    if (!existingItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const body = await request.json();
    const result = foundItemUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updatedItem = await prisma.foundItem.update({
      where: { id: params.id },
      data: result.data,
    });

    // Record change in audit log
    await prisma.auditLog.create({
      data: {
        foundItemId: params.id,
        action: "UPDATED",
        details: `Item details updated by ${user.fullName}. Modified fields: ${Object.keys(
          result.data
        ).join(", ")}.`,
        performedById: user.userId,
        performedByName: user.fullName,
      },
    });

    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error) {
    console.error("PATCH /api/items/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update item record" },
      { status: 500 }
    );
  }
}
