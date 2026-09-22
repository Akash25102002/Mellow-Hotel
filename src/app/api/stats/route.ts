import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      inStorageCount,
      matchedCount,
      returnedCount,
      disposedCount,
      openInquiriesCount,
      agingItemsCount,
      categoryStats,
    ] = await Promise.all([
      prisma.foundItem.count({ where: { status: "IN_STORAGE" } }),
      prisma.foundItem.count({ where: { status: "MATCHED" } }),
      prisma.foundItem.count({ where: { status: "RETURNED" } }),
      prisma.foundItem.count({ where: { status: "DISPOSED" } }),
      prisma.guestInquiry.count({ where: { status: "OPEN" } }),
      prisma.foundItem.count({
        where: {
          status: "IN_STORAGE",
          foundDate: { lte: thirtyDaysAgo },
        },
      }),
      prisma.foundItem.groupBy({
        by: ["category"],
        _count: { id: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        inStorage: inStorageCount,
        matched: matchedCount,
        returned: returnedCount,
        disposed: disposedCount,
        openInquiries: openInquiriesCount,
        agingOver30Days: agingItemsCount,
        categories: categoryStats.map((c) => ({
          category: c.category,
          count: c._count.id,
        })),
      },
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard statistics" },
      { status: 500 }
    );
  }
}
