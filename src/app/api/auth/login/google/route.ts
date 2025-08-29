import { generateState, generateCodeVerifier, Google } from "arctic";
import { cookies } from "next/headers";

export const GET = async () => {
  // Debug logging
  console.log("Google OAuth - Environment variables:");
  console.log("GOOGLE_CLIENT_ID exists:", !!process.env.GOOGLE_CLIENT_ID);
  console.log(
    "GOOGLE_CLIENT_SECRET exists:",
    !!process.env.GOOGLE_CLIENT_SECRET
  );
  console.log("GOOGLE_REDIRECT_URI exists:", !!process.env.GOOGLE_REDIRECT_URI);

  if (
    !process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.GOOGLE_REDIRECT_URI
  ) {
    console.error("Missing required Google OAuth environment variables");
    return new Response("Google OAuth not configured", { status: 500 });
  }

  // Create Google OAuth instance directly
  const googleOAuth = new Google(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );

  console.log("Google OAuth instance created:", !!googleOAuth);
  console.log(
    "Google OAuth methods:",
    Object.getOwnPropertyNames(Object.getPrototypeOf(googleOAuth))
  );

  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = googleOAuth.createAuthorizationURL(state, codeVerifier, [
    "openid",
    "profile",
    "email",
  ]);

  const cookieStore = await cookies();
  cookieStore.set("google_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  cookieStore.set("google_oauth_code_verifier", codeVerifier, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return Response.redirect(url.toString());
};
