"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Hardcoded admin credentials (in production, these should be in environment variables)
const ADMIN_CREDENTIALS = {
  username: "Ad@^^!september",
  password: "^^@y0!semptember2025",
};

export interface AdminSession {
  isAuthenticated: boolean;
  username: string;
  loginTime: number;
}

export async function authenticateAdmin(
  username: string,
  password: string
): Promise<boolean> {
  return (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  );
}

export async function createAdminSession(): Promise<void> {
  const adminSession: AdminSession = {
    isAuthenticated: true,
    username: ADMIN_CREDENTIALS.username,
    loginTime: Date.now(),
  };

  // Set admin session cookie (24 hours expiry)
  (await cookies()).set("admin-session", JSON.stringify(adminSession), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60, // 24 hours
  });
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const adminSessionCookie = (await cookies()).get("admin-session");
    if (!adminSessionCookie?.value) return null;

    const session: AdminSession = JSON.parse(adminSessionCookie.value);

    // Check if session is expired (24 hours)
    if (Date.now() - session.loginTime > 24 * 60 * 60 * 1000) {
      await destroyAdminSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error("Error parsing admin session:", error);
    return null;
  }
}

export async function destroyAdminSession(): Promise<void> {
  (await cookies()).delete("admin-session");
}

export async function requireAdminAuth(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session?.isAuthenticated) {
    redirect("/en/adminisamazing-login");
  }
  return session;
}
