import { describe, it, expect } from "vitest";
import {
  foundItemCreateSchema,
  statusUpdateSchema,
  guestInquiryCreateSchema,
  loginSchema,
} from "../src/lib/validators";

describe("Validation Schemas - Unit Tests", () => {
  describe("Login Schema", () => {
    it("should accept valid email and password", () => {
      const result = loginSchema.safeParse({
        email: "admin@grandazure.com",
        password: "HotelStaff@2026",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid email format", () => {
      const result = loginSchema.safeParse({
        email: "not-an-email",
        password: "HotelStaff@2026",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toBeDefined();
      }
    });

    it("should reject passwords shorter than 6 characters", () => {
      const result = loginSchema.safeParse({
        email: "admin@grandazure.com",
        password: "123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password).toBeDefined();
      }
    });
  });

  describe("Found Item Intake Schema", () => {
    it("should accept a complete, valid found item", () => {
      const result = foundItemCreateSchema.safeParse({
        title: "Apple AirPods Pro (White case)",
        category: "ELECTRONICS",
        roomNumber: "304",
        locationDetails: "Under the nightstand table",
        storageLocation: "Closet 1 - Shelf B - Bin 3",
        foundDate: "2026-09-22",
      });
      expect(result.success).toBe(true);
    });

    it("should reject if storageLocation is missing", () => {
      const result = foundItemCreateSchema.safeParse({
        title: "Apple AirPods Pro",
        category: "ELECTRONICS",
        roomNumber: "304",
        storageLocation: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.storageLocation).toBeDefined();
      }
    });

    it("should reject invalid categories", () => {
      const result = foundItemCreateSchema.safeParse({
        title: "Apple AirPods Pro",
        category: "SPORTS_GEAR", // Invalid category
        roomNumber: "304",
        storageLocation: "Shelf 1",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("State Transition & Resolution Schema", () => {
    it("should require claimedByGuestName and returnMethod when status is RETURNED", () => {
      const invalidReturn = statusUpdateSchema.safeParse({
        status: "RETURNED",
        // missing claimedByGuestName and returnMethod
      });
      expect(invalidReturn.success).toBe(false);

      const validReturn = statusUpdateSchema.safeParse({
        status: "RETURNED",
        claimedByGuestName: "David Chen",
        returnMethod: "IN_PERSON",
      });
      expect(validReturn.success).toBe(true);
    });

    it("should require disposalReason when status is DISPOSED", () => {
      const invalidDisposal = statusUpdateSchema.safeParse({
        status: "DISPOSED",
      });
      expect(invalidDisposal.success).toBe(false);

      const validDisposal = statusUpdateSchema.safeParse({
        status: "DISPOSED",
        disposalReason: "DONATED_TO_CHARITY",
      });
      expect(validDisposal.success).toBe(true);
    });
  });

  describe("Guest Inquiry Schema", () => {
    it("should accept valid guest submission", () => {
      const result = guestInquiryCreateSchema.safeParse({
        guestName: "Sophia Martinez",
        guestEmail: "smartinez@example.com",
        guestPhone: "+1 (555) 345-6789",
        roomNumber: "502",
        checkOutDate: "2026-09-20",
        category: "JEWELRY",
        description: "Gold chain necklace with a small pearl pendant left in bathroom.",
      });
      expect(result.success).toBe(true);
    });

    it("should reject too short description (<10 characters)", () => {
      const result = guestInquiryCreateSchema.safeParse({
        guestName: "Sophia Martinez",
        guestEmail: "smartinez@example.com",
        guestPhone: "+1 (555) 345-6789",
        roomNumber: "502",
        checkOutDate: "2026-09-20",
        category: "JEWELRY",
        description: "necklace", // too short
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.description).toBeDefined();
      }
    });
  });
});
