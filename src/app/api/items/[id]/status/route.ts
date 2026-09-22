import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { statusUpdateSchema } from "@/lib/validators";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const item = await prisma.foundItem.findUnique({
      where: { id: params.id },
      include: { guestInquiry: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Business Rule: An already disposed item cannot be returned or matched
    if (item.status === "DISPOSED") {
      return NextResponse.json(
        { error: "Cannot modify an item that has already been disposed or donated." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const result = statusUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      status,
      guestInquiryId,
      claimedByGuestName,
      returnMethod,
      courierTrackingNumber,
      disposalReason,
      notes,
    } = result.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { status };
    let auditDetails = `Status changed from ${item.status} to ${status} by ${user.fullName}.`;

    if (status === "MATCHED") {
      if (guestInquiryId) {
        updateData.guestInquiryId = guestInquiryId;
        const inquiry = await prisma.guestInquiry.findUnique({ where: { id: guestInquiryId } });
        if (inquiry) {
          auditDetails += ` Linked with Inquiry ${inquiry.referenceCode} (${inquiry.guestName}).`;
          // Update inquiry status to UNDER_REVIEW
          await prisma.guestInquiry.update({
            where: { id: guestInquiryId },
            data: { status: "UNDER_REVIEW" },
          });
        }
      }
    } else if (status === "RETURNED") {
      updateData.claimedByGuestName = claimedByGuestName;
      updateData.returnMethod = returnMethod;
      updateData.courierTrackingNumber = courierTrackingNumber || null;
      updateData.resolvedAt = new Date();

      auditDetails += ` Returned to ${claimedByGuestName} via ${returnMethod}.`;
      if (courierTrackingNumber) {
        auditDetails += ` Courier Tracking: ${courierTrackingNumber}.`;
      }

      // If linked with a guest inquiry, resolve it automatically
      if (item.guestInquiryId) {
        await prisma.guestInquiry.update({
          where: { id: item.guestInquiryId },
          data: { status: "RESOLVED" },
        });
      }
    } else if (status === "DISPOSED") {
      updateData.disposalReason = disposalReason;
      updateData.resolvedAt = new Date();

      auditDetails += ` Reason: ${disposalReason}.`;
      if (item.guestInquiryId) {
        await prisma.guestInquiry.update({
          where: { id: item.guestInquiryId },
          data: { status: "CLOSED" },
        });
      }
    } else if (status === "IN_STORAGE") {
      // Reopening or reverting to storage
      updateData.guestInquiryId = null;
      updateData.claimedByGuestName = null;
      updateData.returnMethod = null;
      updateData.courierTrackingNumber = null;
      updateData.disposalReason = null;
      updateData.resolvedAt = null;
    }

    if (notes) {
      auditDetails += ` Notes: ${notes}`;
    }

    const updatedItem = await prisma.foundItem.update({
      where: { id: params.id },
      data: updateData,
      include: {
        guestInquiry: true,
        loggedBy: {
          select: { id: true, fullName: true },
        },
      },
    });

    // Record state change in audit log
    await prisma.auditLog.create({
      data: {
        foundItemId: params.id,
        action: `STATUS_${status}`,
        details: auditDetails,
        performedById: user.userId,
        performedByName: user.fullName,
      },
    });

    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error) {
    console.error("POST /api/items/[id]/status error:", error);
    return NextResponse.json(
      { error: "Failed to update item status" },
      { status: 500 }
    );
  }
}
