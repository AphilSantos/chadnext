import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Google } from "arctic";
import { prisma } from "~/lib/server/db";
import { sendWelcomeEmail } from "~/lib/server/mail";
import { createSession, generateSessionToken } from "~/lib/server/auth/session";
import { setSessionTokenCookie } from "~/lib/server/auth/cookies";

interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  verified_email: boolean;
}

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return new Response(null, {
      status: 400,
    });
  }

  const cookieStore = await cookies();
  const savedState = cookieStore.get("google_oauth_state");
  const savedCodeVerifier = cookieStore.get("google_oauth_code_verifier");

  if (!savedState || savedState.value !== state || !savedCodeVerifier) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    // Create Google OAuth instance
    const googleOAuth = new Google(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.GOOGLE_REDIRECT_URI!
    );

    const tokens = await googleOAuth.validateAuthorizationCode(
      code,
      savedCodeVerifier.value
    );
    const googleUserResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.accessToken()}`
    );
    const googleUser: GoogleUser = await googleUserResponse.json();

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            googleId: googleUser.id,
          },
          {
            email: googleUser.email,
          },
        ],
      },
    });

    if (existingUser) {
      // Update existing user with Google ID if not already set
      if (!existingUser.googleId) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { googleId: googleUser.id },
        });
      }

      const sessionTokenCookie = generateSessionToken();
      const session = await createSession(sessionTokenCookie, existingUser.id);
      await setSessionTokenCookie(sessionTokenCookie, session.expiresAt);

      revalidatePath("/dashboard", "layout");
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/dashboard",
        },
      });
    }

    const newUser = await prisma.user.create({
      data: {
        googleId: googleUser.id,
        name: googleUser.name,
        email: googleUser.email,
        picture: googleUser.picture,
        emailVerified: googleUser.verified_email,
      },
    });

    if (googleUser.email) {
      sendWelcomeEmail({ toMail: newUser.email!, userName: newUser.name! });
    }

    const sessionTokenCookie = generateSessionToken();
    const session = await createSession(sessionTokenCookie, newUser.id);
    await setSessionTokenCookie(sessionTokenCookie, session.expiresAt);

    revalidatePath("/dashboard", "layout");
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/dashboard",
      },
    });
  } catch (error) {
    console.error("Google OAuth error:", error);
    return new Response(null, {
      status: 500,
    });
  }
};
