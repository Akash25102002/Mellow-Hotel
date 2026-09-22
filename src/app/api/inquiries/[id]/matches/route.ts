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
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // Get candidate items currently in storage
    const itemsInStorage = await prisma.foundItem.findMany({
      where: { status: "IN_STORAGE" },
      include: {
        loggedBy: {
          select: { fullName: true },
        },
      },
    });

    const inquiryWords = new Set(
      inquiry.description
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 3)
    );

    const scoredMatches = itemsInStorage.map((item) => {
      let score = 0;
      const matchReasons: string[] = [];

      // 1. Room Number Match (Weight: 50)
      const cleanInquiryRoom = inquiry.roomNumber.toLowerCase().trim();
      const cleanItemRoom = item.roomNumber.toLowerCase().trim();

      if (cleanInquiryRoom === cleanItemRoom) {
        score += 50;
        matchReasons.push(`Exact room match: Room ${item.roomNumber}`);
      } else if (cleanItemRoom.includes(cleanInquiryRoom) || cleanInquiryRoom.includes(cleanItemRoom)) {
        score += 35;
        matchReasons.push(`Partial room match: ${item.roomNumber}`);
      }

      // 2. Category Match (Weight: 30)
      if (item.category === inquiry.category) {
        score += 30;
        matchReasons.push(`Matching category: ${item.category}`);
      }

      // 3. Date Proximity (Weight: 20)
      const checkoutTime = new Date(inquiry.checkOutDate).getTime();
      const foundTime = new Date(item.foundDate).getTime();
      const diffDays = Math.abs(checkoutTime - foundTime) / (1000 * 60 * 60 * 24);

      if (diffDays <= 3) {
        score += 20;
        matchReasons.push(`Found within ${Math.ceil(diffDays)} day(s) of guest checkout`);
      } else if (diffDays <= 7) {
        score += 10;
        matchReasons.push(`Found within ${Math.ceil(diffDays)} days of guest checkout`);
      }

      // 4. Keyword similarity (Weight: up to 20)
      const itemText = `${item.title} ${item.locationDetails || ""}`.toLowerCase();
      let keywordHits = 0;
      Array.from(inquiryWords).forEach((word) => {
        if (itemText.includes(word)) {
          keywordHits++;
        }
      });

      if (keywordHits > 0) {
        const keywordScore = Math.min(20, keywordHits * 5);
        score += keywordScore;
        matchReasons.push(`Keyword overlap detected (${keywordHits} matching terms)`);
      }

      return {
        item,
        score: Math.min(100, score),
        confidence: score >= 70 ? "HIGH" : score >= 45 ? "MEDIUM" : "LOW",
        matchReasons,
      };
    });

    // Filter to relevant matches (score >= 30) and sort highest score first
    const results = scoredMatches
      .filter((m) => m.score >= 30)
      .sort((a, b) => b.score - a.score);

    return NextResponse.json({
      success: true,
      inquiry,
      totalCandidates: itemsInStorage.length,
      matchCount: results.length,
      matches: results,
    });
  } catch (error) {
    console.error("GET /api/inquiries/[id]/matches error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate inventory matches" },
      { status: 500 }
    );
  }
}
