"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authActionClient } from "~/lib/client/safe-action";
import { deleteSessionTokenCookie } from "~/lib/server/auth/cookies";
import { invalidateSession, getCurrentSession } from "~/lib/server/auth/session";

export const logout = authActionClient.action(
  async ({ ctx: { sessionId } }) => {
    await invalidateSession(sessionId);
    deleteSessionTokenCookie();
    revalidatePath("/");
    return redirect("/login");
  }
);

// Simple logout action that doesn't require authActionClient
export async function simpleLogout() {
  try {
    const { session } = await getCurrentSession();
    if (session) {
      await invalidateSession(session.id);
    }
    deleteSessionTokenCookie();
    revalidatePath("/");
    redirect("/login");
  } catch (error) {
    console.error("Logout error:", error);
    // Even if there's an error, try to clear cookies and redirect
    deleteSessionTokenCookie();
    redirect("/login");
  }
}
