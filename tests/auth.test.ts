import { describe, it, expect } from "vitest";
import { signSessionToken, verifySessionToken } from "../src/lib/auth";

describe("JWT Authentication & Token Security", () => {
  const mockUser = {
    userId: "usr_mock_12345",
    email: "sarah.housekeeping@grandazure.com",
    fullName: "Sarah Jenkins",
    role: "STAFF",
  };

  it("should generate and verify a valid JWT session token", async () => {
    const token = await signSessionToken(mockUser);
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3); // Standard 3-part JWT header.payload.signature

    const verified = await verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(mockUser.userId);
    expect(verified?.email).toBe(mockUser.email);
    expect(verified?.role).toBe(mockUser.role);
  });

  it("should reject tampered or corrupted tokens", async () => {
    const token = await signSessionToken(mockUser);
    const tamperedToken = token.slice(0, -6) + "xyz123";

    const verified = await verifySessionToken(tamperedToken);
    expect(verified).toBeNull();
  });

  it("should return null for malformed token strings", async () => {
    const verified = await verifySessionToken("not-a-token");
    expect(verified).toBeNull();
  });
});
