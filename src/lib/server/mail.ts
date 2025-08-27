import ThanksTemp from "emails/thanks";
import VerificationTemp from "emails/verification";
import { Resend } from "resend";
import { type SendOTPProps, type SendWelcomeEmailProps } from "~/types";
import { generateId } from "../utils";
import { ReactNode } from "react";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async ({
  toMail,
  userName,
}: SendWelcomeEmailProps) => {
  const subject = "Thanks for using ChadNext!";
  const temp = ThanksTemp({ userName }) as ReactNode;

  await resend.emails.send({
    from: `ChadNext App <onboarding@resend.dev>`,
    to: toMail,
    subject: subject,
    headers: {
      "X-Entity-Ref-ID": generateId(),
    },
    react: temp,
    text: "",
  });
};

export const sendOTP = async ({ toMail, code, userName }: SendOTPProps) => {
  try {
    console.log("sendOTP called with:", { toMail, code, userName });
    console.log("RESEND_API_KEY in sendOTP:", !!process.env.RESEND_API_KEY);

    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const subject = "OTP for ChadNext";
    const temp = VerificationTemp({ userName, code }) as ReactNode;

    console.log("Sending email via Resend...");

    const result = await resend.emails.send({
      from: `ChadNext App <onboarding@resend.dev>`,
      to: toMail,
      subject: subject,
      headers: {
        "X-Entity-Ref-ID": generateId(),
      },
      react: temp,
      text: "",
    });

    console.log("Resend API response:", result);
    return result;
  } catch (error) {
    console.error("Error in sendOTP:", error);
    throw error;
  }
};
