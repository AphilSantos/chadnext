import { Google } from "arctic";

// Debug logging
console.log("Google OAuth Config - Loading...");
console.log("Google class available:", !!Google);
console.log(
  "GOOGLE_CLIENT_ID:",
  process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + "..."
);
console.log(
  "GOOGLE_CLIENT_SECRET:",
  process.env.GOOGLE_CLIENT_SECRET ? "***exists***" : "MISSING"
);
console.log("GOOGLE_REDIRECT_URI:", process.env.GOOGLE_REDIRECT_URI);

if (
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET ||
  !process.env.GOOGLE_REDIRECT_URI
) {
  console.error("❌ Missing Google OAuth environment variables!");
  throw new Error("Google OAuth environment variables not configured");
}

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

console.log("✅ Google OAuth configuration loaded successfully");
