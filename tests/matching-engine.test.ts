import { describe, it, expect } from "vitest";

// Pure function test for matching scoring logic
function scoreCandidate({
  itemRoom,
  itemCategory,
  itemFoundDate,
  itemTitle,
  inquiryRoom,
  inquiryCategory,
  inquiryCheckOutDate,
  inquiryDescription,
}: {
  itemRoom: string;
  itemCategory: string;
  itemFoundDate: string;
  itemTitle: string;
  inquiryRoom: string;
  inquiryCategory: string;
  inquiryCheckOutDate: string;
  inquiryDescription: string;
}) {
  let score = 0;
  const matchReasons: string[] = [];

  // 1. Room Number Match
  const cleanInquiryRoom = inquiryRoom.toLowerCase().trim();
  const cleanItemRoom = itemRoom.toLowerCase().trim();

  if (cleanInquiryRoom === cleanItemRoom) {
    score += 50;
    matchReasons.push(`Exact room match: Room ${itemRoom}`);
  } else if (cleanItemRoom.includes(cleanInquiryRoom) || cleanInquiryRoom.includes(cleanItemRoom)) {
    score += 35;
    matchReasons.push(`Partial room match: ${itemRoom}`);
  }

  // 2. Category Match
  if (itemCategory === inquiryCategory) {
    score += 30;
    matchReasons.push(`Matching category: ${itemCategory}`);
  }

  // 3. Date Proximity
  const checkoutTime = new Date(inquiryCheckOutDate).getTime();
  const foundTime = new Date(itemFoundDate).getTime();
  const diffDays = Math.abs(checkoutTime - foundTime) / (1000 * 60 * 60 * 24);

  if (diffDays <= 3) {
    score += 20;
    matchReasons.push(`Found within ${Math.ceil(diffDays)} day(s) of guest checkout`);
  } else if (diffDays <= 7) {
    score += 10;
    matchReasons.push(`Found within ${Math.ceil(diffDays)} days of guest checkout`);
  }

  // 4. Keyword similarity
  const inquiryWords = inquiryDescription
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3);

  const itemText = itemTitle.toLowerCase();
  let hits = 0;
  for (const word of inquiryWords) {
    if (itemText.includes(word)) hits++;
  }
  if (hits > 0) {
    score += Math.min(20, hits * 5);
    matchReasons.push(`Keyword match detected`);
  }

  return {
    score: Math.min(100, score),
    confidence: score >= 70 ? "HIGH" : score >= 45 ? "MEDIUM" : "LOW",
    matchReasons,
  };
}

describe("Smart Matching Engine - Scoring Logic", () => {
  it("should calculate HIGH confidence (>=80%) when room, category, and date align", () => {
    const result = scoreCandidate({
      itemRoom: "304",
      itemCategory: "ELECTRONICS",
      itemFoundDate: "2026-09-20",
      itemTitle: "Sony WH-1000XM5 Black Headphones",
      inquiryRoom: "304",
      inquiryCategory: "ELECTRONICS",
      inquiryCheckOutDate: "2026-09-19",
      inquiryDescription: "Lost my black Sony headphones in a zip case",
    });

    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.confidence).toBe("HIGH");
    expect(result.matchReasons).toContain("Exact room match: Room 304");
    expect(result.matchReasons).toContain("Matching category: ELECTRONICS");
  });

  it("should award partial room match points for 'Room 304' vs '304'", () => {
    const result = scoreCandidate({
      itemRoom: "Room 304",
      itemCategory: "CLOTHING",
      itemFoundDate: "2026-09-15",
      itemTitle: "Blue Rain Jacket",
      inquiryRoom: "304",
      inquiryCategory: "CLOTHING",
      inquiryCheckOutDate: "2026-09-15",
      inquiryDescription: "Blue jacket left in wardrobe",
    });

    expect(result.score).toBeGreaterThanOrEqual(65);
    expect(result.matchReasons.some((r) => r.includes("room match"))).toBe(true);
  });

  it("should score LOW (<40%) for mismatched rooms, categories, and dates", () => {
    const result = scoreCandidate({
      itemRoom: "118",
      itemCategory: "JEWELRY",
      itemFoundDate: "2026-08-01",
      itemTitle: "Silver watch",
      inquiryRoom: "405",
      inquiryCategory: "ELECTRONICS",
      inquiryCheckOutDate: "2026-09-20",
      inquiryDescription: "Space gray tablet",
    });

    expect(result.score).toBeLessThan(40);
    expect(result.confidence).toBe("LOW");
  });
});
