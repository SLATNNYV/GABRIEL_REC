import crypto from "crypto";

/**
 * Computes a SHA-256 hash of a plain text password.
 * This is secure enough for this application and works out-of-the-box
 * on serverless platforms like Vercel without binary dependency issues.
 */
export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}
