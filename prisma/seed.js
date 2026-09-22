const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning database...");
  await prisma.auditLog.deleteMany({});
  await prisma.foundItem.deleteMany({});
  await prisma.guestInquiry.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Creating staff users...");
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("HotelStaff@2026", salt);

  const admin = await prisma.user.create({
    data: {
      email: "admin@grandazure.com",
      passwordHash,
      fullName: "Marcus Vance",
      role: "ADMIN",
    },
  });

  const staff = await prisma.user.create({
    data: {
      email: "sarah.housekeeping@grandazure.com",
      passwordHash,
      fullName: "Sarah Jenkins",
      role: "STAFF",
    },
  });

  console.log("Creating guest inquiries...");
  const inquiryIpad = await prisma.guestInquiry.create({
    data: {
      referenceCode: "INQ-4821",
      guestName: "Elena Rostova",
      guestEmail: "elena.rostova@example.com",
      guestPhone: "+1 (555) 234-5678",
      roomNumber: "405",
      checkOutDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      category: "ELECTRONICS",
      description: "Space gray iPad Air in a dark magnetic folio case. Forgot it on the bedside table.",
      status: "UNDER_REVIEW",
    },
  });

  const inquirySony = await prisma.guestInquiry.create({
    data: {
      referenceCode: "INQ-7822",
      guestName: "David Chen",
      guestEmail: "dchen.design@example.com",
      guestPhone: "+1 (555) 987-6543",
      roomNumber: "304",
      checkOutDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      category: "ELECTRONICS",
      description: "Black over-ear Sony noise cancelling headphones in a black zipper case with USB-C cord.",
      status: "OPEN",
    },
  });

  const inquiryNecklace = await prisma.guestInquiry.create({
    data: {
      referenceCode: "INQ-9104",
      guestName: "Sophia Martinez",
      guestEmail: "smartinez@example.com",
      guestPhone: "+1 (555) 345-6789",
      roomNumber: "502",
      checkOutDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      category: "JEWELRY",
      description: "Delicate 14k gold chain necklace with small pearl pendant. Might be in bathroom shelf.",
      status: "OPEN",
    },
  });

  console.log("Creating found items...");
  // 1. Sony Headphones (Matches David Chen)
  const itemSony = await prisma.foundItem.create({
    data: {
      itemNumber: "FND-1001",
      title: "Sony WH-1000XM5 Wireless Headphones",
      category: "ELECTRONICS",
      roomNumber: "304",
      locationDetails: "On desk chair under a throw pillow",
      storageLocation: "Closet 1 - Shelf B - Bin 2",
      status: "IN_STORAGE",
      foundDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      loggedById: staff.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      foundItemId: itemSony.id,
      action: "CREATED",
      details: "Item logged into storage by housekeeping attendant.",
      performedById: staff.id,
      performedByName: staff.fullName,
    },
  });

  // 2. iPad Air (Matched with Elena)
  const itemIpad = await prisma.foundItem.create({
    data: {
      itemNumber: "FND-1002",
      title: "Apple iPad Air (Space Gray)",
      category: "ELECTRONICS",
      roomNumber: "405",
      locationDetails: "Nightstand drawer",
      storageLocation: "Security Safe Cabinet 1",
      status: "MATCHED",
      foundDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      loggedById: staff.id,
      guestInquiryId: inquiryIpad.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      foundItemId: itemIpad.id,
      action: "CREATED",
      details: "Item logged into secure storage.",
      performedById: staff.id,
      performedByName: staff.fullName,
    },
  });

  await prisma.auditLog.create({
    data: {
      foundItemId: itemIpad.id,
      action: "MATCHED",
      details: `Matched with Guest Inquiry INQ-4821 (Elena Rostova). Guest notified via email.`,
      performedById: admin.id,
      performedByName: admin.fullName,
    },
  });

  // 3. Citizen Watch (In storage)
  const itemWatch = await prisma.foundItem.create({
    data: {
      itemNumber: "FND-1003",
      title: "Citizen Eco-Drive Silver Men's Watch",
      category: "JEWELRY",
      roomNumber: "118",
      locationDetails: "Bathroom marble ledge near vanity",
      storageLocation: "Security Safe Cabinet 2",
      status: "IN_STORAGE",
      foundDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      loggedById: staff.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      foundItemId: itemWatch.id,
      action: "CREATED",
      details: "Logged by housekeeping attendant after guest checkout.",
      performedById: staff.id,
      performedByName: staff.fullName,
    },
  });

  // 4. North Face Rain Jacket
  const itemJacket = await prisma.foundItem.create({
    data: {
      itemNumber: "FND-1004",
      title: "Navy Blue North Face Waterproof Jacket (Size L)",
      category: "CLOTHING",
      roomNumber: "Poolside Cabana 3",
      locationDetails: "Draped over sun lounger chair",
      storageLocation: "Storage Room - Garment Rack C",
      status: "IN_STORAGE",
      foundDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      loggedById: admin.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      foundItemId: itemJacket.id,
      action: "CREATED",
      details: "Logged by pool attendant.",
      performedById: admin.id,
      performedByName: admin.fullName,
    },
  });

  // 5. Returned wallet
  const itemWallet = await prisma.foundItem.create({
    data: {
      itemNumber: "FND-1005",
      title: "Black Leather Bi-fold Wallet with California Driver's License",
      category: "DOCUMENTS",
      roomNumber: "210",
      locationDetails: "Under desk near waste basket",
      storageLocation: "Security Safe Cabinet 1",
      status: "RETURNED",
      foundDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      loggedById: staff.id,
      claimedByGuestName: "Robert T. King",
      returnMethod: "COURIER",
      courierTrackingNumber: "FEDEX-78492019482",
      resolvedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.auditLog.create({
    data: {
      foundItemId: itemWallet.id,
      action: "CREATED",
      details: "Found during deep clean.",
      performedById: staff.id,
      performedByName: staff.fullName,
    },
  });

  await prisma.auditLog.create({
    data: {
      foundItemId: itemWallet.id,
      action: "RETURNED",
      details: "Dispatched via FedEx priority to guest home address. Tracking: FEDEX-78492019482",
      performedById: admin.id,
      performedByName: admin.fullName,
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
