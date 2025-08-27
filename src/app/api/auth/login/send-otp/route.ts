import { generateEmailVerificationCode } from "~/lib/server/auth";
import { prisma } from "~/lib/server/db";
import { sendOTP } from "~/lib/server/mail";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    // Validate email
    if (!body.email || typeof body.email !== "string") {
      console.error("Invalid email provided:", body.email);
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("Attempting to send OTP to:", body.email);
    console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
    console.log(
      "RESEND_API_KEY length:",
      process.env.RESEND_API_KEY?.length || 0
    );

    const user = await prisma.user.upsert({
      where: {
        email: body.email,
      },
      update: {},
      create: {
        email: body.email,
        emailVerified: false,
      },
    });

    console.log("User created/updated:", user.id);

    const otp = await generateEmailVerificationCode(user.id, body.email);
    console.log("OTP generated:", otp);

    await sendOTP({
      toMail: body.email,
      code: otp,
      userName: user.name?.split(" ")[0] || "",
    });

    console.log("OTP email sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-otp route:", error);

    // Return more detailed error information
    return new Response(
      JSON.stringify({
        error: "Failed to send OTP",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
