# FoundDesk: Comprehensive Interview Preparation Guide 🎯
> Specifically tailored for the **Cnykra Technologies Full Stack Developer Assessment**

Use this guide to review and defend every architectural and engineering decision made during the development of FoundDesk.

---

### Q1: Why did you choose this specific problem (Lost & Found Management) instead of a generic hotel booking or PMS system?
**Your Answer:**
> *"The assessment brief specifically emphasized avoiding generic hotel-management clones and focusing on one realistic, end-to-end operational workflow. Through researching independent boutique hotels (20–120 rooms), I found that property loss management is one of the most frustrating daily friction points. Housekeeping finds items and relies on paper logbooks or WhatsApp chats, while front-desk staff have no real-time visibility when panicked guests call. 
> 
> Lost & Found management was the perfect problem because:
> 1. It represents a complete, high-stakes operational workflow with clear state transitions (`IN_STORAGE` → `MATCHED` → `RETURNED` / `DISPOSED`).
> 2. It requires both an internal authenticated staff operations ledger and a public guest-facing touchpoint, proving dual-portal full-stack architecture.
> 3. It directly impacts hotel reputation: mishandled or lost belongings often turn 5-star guest stays into 1-star public reviews."*

---

### Q2: Why did you choose Next.js (App Router), TypeScript, and Prisma?
**Your Answer:**
> *"I chose **Next.js 14 App Router** with **TypeScript** because it allowed me to build a unified full-stack application with end-to-end type safety between the database models, API route handlers, and React client components. 
> 
> Key reasons:
> * **Co-located API Routes:** Next.js Route Handlers (`/api/*`) handle all REST endpoints without needing a separate backend server or CORS configuration.
> * **TypeScript:** Guarantees that data structures like `FoundItem` and `GuestInquiry` maintain strict type contracts across the wire.
> * **Prisma ORM:** Gives us declarative schema modeling, type-safe queries, and zero-effort database migrations. Using SQLite locally allowed for instant zero-dependency setup, while Prisma makes switching to PostgreSQL in production as simple as changing the `DATABASE_URL` environment variable."*

---

### Q3: How does your authentication work, and why did you choose custom JWT over NextAuth?
**Your Answer:**
> *"I implemented a custom session authentication system using `jose` for HMAC-SHA256 JWT signing and verification, combined with `bcryptjs` for password hashing with 10 salt rounds.
> 
> Upon valid credentials in `POST /api/auth/login`:
> 1. A cryptographically signed token containing `{ userId, email, fullName, role }` is generated with a 7-day expiration.
> 2. The token is stored in an **HTTP-only, Secure, SameSite=Lax cookie**. This protects against Cross-Site Scripting (XSS) because JavaScript running in the browser cannot read HTTP-only cookies.
> 3. An Edge middleware (`src/middleware.ts`) guards `/dashboard/*` routes by verifying the cookie before page rendering.
> 
> I intentionally chose this over NextAuth or third-party OAuth because it is completely transparent, lightweight, has zero external service dependencies, and demonstrates a direct understanding of session security and cookie semantics."*

---

### Q4: Walk me through your database schema. How are relationships structured?
**Your Answer:**
> *"The schema consists of 4 core models:
> 1. `User`: Represents hotel employees with roles (`ADMIN` or `STAFF`).
> 2. `FoundItem`: Represents discovered property with sequential item numbers (e.g. `FND-1001`), room numbers, storage bin locations, status, and resolution details.
> 3. `GuestInquiry`: Stores lost item reports submitted by guests via the public portal, indexed by a unique `referenceCode` (e.g. `INQ-4821`).
> 4. `AuditLog`: An immutable record of every lifecycle event (creation, status update, match link, guest handover, or disposal).
> 
> **Relationships:**
> * `User` has a 1-to-many relationship with `FoundItem` (tracking who originally logged the item).
> * `FoundItem` has an optional 1-to-many relationship with `GuestInquiry` (when an inquiry is matched and linked to a physical item).
> * `FoundItem` has a 1-to-many cascading relationship with `AuditLog`, ensuring an unbroken chain of custody is preserved."*

---

### Q5: How does the Smart Matching algorithm work?
**Your Answer:**
> *"Rather than relying on brittle third-party computer vision, FoundDesk uses a deterministic heuristic scoring engine tailored to hotel operational patterns.
> 
> When staff run a match on an inquiry:
> 1. The engine inspects all items currently with status `IN_STORAGE`.
> 2. **Room Scoring (Weight: 50):** Checks if the inquiry's reported room exactly or partially matches the item's discovered location.
> 3. **Category Scoring (Weight: 30):** Checks if the item belongs to the same category (`ELECTRONICS`, `JEWELRY`, `CLOTHING`, etc.).
> 4. **Date Proximity (Weight: 20):** Calculates `Math.abs(checkoutDate - foundDate)`. Items found within 3 days receive 20 points; within 7 days receive 10 points.
> 5. **Keyword Scoring (Weight: up to 20):** Evaluates keyword overlap between the item title and the guest description.
> 
> Items scoring 70%+ are marked `HIGH` confidence, 45%+ `MEDIUM`, and 30%+ `LOW`. The staff member sees the exact match reasons and can confirm the match with 1 click."*

---

### Q6: How do you handle input validation and error states?
**Your Answer:**
> *"We use **Zod** for schema-first validation on every entry point:
> * API handlers parse payloads with `.safeParse()`. If invalid, they return a 400 Bad Request with formatted field-level errors (`error.flatten().fieldErrors`).
> * Client forms display these field-level errors inline under each input.
> * Form submissions show loading spinners, disable submit buttons during in-flight requests, and handle network failures with informative alerts.
> * For empty database states or empty search queries, the UI renders helpful empty state illustrations and instructions rather than blank screens."*

---

### Q7: What features did you intentionally exclude to keep the scope within 15–20 hours?
**Your Answer:**
> *"Scope discipline was critical to delivering a polished, production-ready product. I intentionally excluded:
> 1. **Stripe Payment Gateway for Courier Shipping:** Rather than adding complex payment flow dependencies, the system allows staff to record the courier name and tracking code upon dispatch.
> 2. **Full PMS Two-Way Sync:** Integrating with legacy PMS APIs (Opera, Mews) requires enterprise API credentials; FoundDesk was designed to function standalone at the property level.
> 3. **AI Image Recognition:** In practice, hotel attendants find items inside cases or turned off; room and date metadata is far more reliable for lost-and-found matching."*

---

### Q8: What would you build or improve next if given more time?
**Your Answer:**
> *"My immediate next steps would be:
> 1. **Automated Transactional Emails:** Hooking up Resend or SendGrid to notify guests when their inquiry is matched or when a tracking number is registered.
> 2. **Printable QR/Barcode Labels:** A 1-click printable label feature for thermal receipt printers so staff can stick a barcode onto the storage bag.
> 3. **Role-Based Permissions for Disposals:** Enforcing that only users with role `ADMIN` can authorize charitable donation or disposal of items older than 30 days."*
