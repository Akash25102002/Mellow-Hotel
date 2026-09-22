import { z } from "zod";

export const ITEM_CATEGORIES = [
  "ELECTRONICS",
  "CLOTHING",
  "JEWELRY",
  "DOCUMENTS",
  "KEYS",
  "BAGS_LUGGAGE",
  "OTHER",
] as const;

export const ITEM_STATUSES = [
  "IN_STORAGE",
  "MATCHED",
  "RETURNED",
  "DISPOSED",
] as const;

export const INQUIRY_STATUSES = [
  "OPEN",
  "UNDER_REVIEW",
  "RESOLVED",
  "CLOSED",
] as const;

export const RETURN_METHODS = ["IN_PERSON", "COURIER"] as const;

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const foundItemCreateSchema = z.object({
  title: z.string().trim().min(3, "Item title must be at least 3 characters.").max(120),
  category: z.enum(ITEM_CATEGORIES, {
    errorMap: () => ({ message: "Please select a valid item category." }),
  }),
  roomNumber: z.string().trim().min(1, "Location or room number is required.").max(50),
  locationDetails: z.string().trim().max(250).optional(),
  storageLocation: z.string().trim().min(2, "Storage shelf or bin location is required.").max(100),
  imageUrl: z.string().url("Please provide a valid image URL.").optional().or(z.literal("")),
  foundDate: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
});

export const foundItemUpdateSchema = z.object({
  title: z.string().trim().min(3).max(120).optional(),
  category: z.enum(ITEM_CATEGORIES).optional(),
  roomNumber: z.string().trim().min(1).max(50).optional(),
  locationDetails: z.string().trim().max(250).optional(),
  storageLocation: z.string().trim().min(2).max(100).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const statusUpdateSchema = z.object({
  status: z.enum(ITEM_STATUSES),
  // When status is MATCHED
  guestInquiryId: z.string().optional(),
  // When status is RETURNED
  claimedByGuestName: z.string().trim().min(2, "Guest name is required for return.").optional(),
  returnMethod: z.enum(RETURN_METHODS).optional(),
  courierTrackingNumber: z.string().trim().optional(),
  // When status is DISPOSED
  disposalReason: z.string().trim().min(3, "Disposal reason is required.").optional(),
  notes: z.string().trim().optional(),
}).refine((data) => {
  if (data.status === "RETURNED") {
    return !!data.claimedByGuestName && !!data.returnMethod;
  }
  return true;
}, {
  message: "Claimed guest name and return method are required when marking an item as returned.",
  path: ["claimedByGuestName"],
}).refine((data) => {
  if (data.status === "DISPOSED") {
    return !!data.disposalReason;
  }
  return true;
}, {
  message: "Disposal reason is required when archiving or disposing an item.",
  path: ["disposalReason"],
});

export const guestInquiryCreateSchema = z.object({
  guestName: z.string().trim().min(2, "Your full name is required.").max(100),
  guestEmail: z.string().trim().email("A valid email address is required for status updates."),
  guestPhone: z.string().trim().min(7, "A valid contact phone number is required.").max(30),
  roomNumber: z.string().trim().min(1, "Room number stayed in is required.").max(30),
  checkOutDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "A valid checkout date is required.",
  }),
  category: z.enum(ITEM_CATEGORIES, {
    errorMap: () => ({ message: "Please select an item category." }),
  }),
  description: z.string().trim().min(10, "Please describe the lost item in detail (color, brand, distinguishing marks).").max(1000),
});
