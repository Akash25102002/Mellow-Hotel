import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const linkSchema = z.object({
  foundItemId: z.string().min(1, "Found item ID is required"),
  notes: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const inquiry = await prisma.guestInquiry.findUnique({
      where: { id: params.id },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const body = await request.json();
    const result = linkSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { foundItemId, notes } = result.data;

    const item = await prisma.foundItem.findUnique({
      where: { id: foundItemId },
    });

    if (!item) {
      return NextResponse.json({ error: "Found item not found" }, { status: 404 });
    }

    if (item.status === "DISPOSED" || item.status === "RETURNED") {
      return NextResponse.json(
        { error: `Cannot link an item with status ${item.status}` },
        { status: 400 }
      );
    }

    // Link found item to inquiry and update statuses
    const updatedItem = await prisma.foundItem.update({
      where: { id: foundItemId },
      data: {
        guestInquiryId: inquiry.id,
        status: "MATCHED",
      },
    });

    await prisma.guestInquiry.update({
      where: { id: inquiry.id },
      data: { status: "UNDER_REVIEW" },
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        foundItemId: item.id,
        action: "MATCHED",
        details: `Linked with Guest Inquiry ${inquiry.referenceCode} (${inquiry.guestName}, Room ${inquiry.roomNumber}) by ${user.fullName}.${notes ? ` Note: ${notes}` : ""}`,
        performedById: user.userId,
        performedByName: user.fullName,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Item ${item.itemNumber} successfully linked to inquiry ${inquiry.referenceCode}.`,
      item: updatedItem,
    });
  } catch (error) {
    console.error("POST /api/inquiries/[id]/link-item error:", error);
    return NextResponse.json(
      { error: "Failed to link item with inquiry" },
      { status: 500 }
    );
  }
}
