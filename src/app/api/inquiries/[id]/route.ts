import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const inquiry = await prisma.guestInquiry.findUnique({
      where: { id: params.id },
      include: {
        matchedItems: {
          include: {
            loggedBy: {
              select: { fullName: true },
            },
          },
        },
      },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    console.error("GET /api/inquiries/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiry details" },
      { status: 500 }
    );
  }
}
