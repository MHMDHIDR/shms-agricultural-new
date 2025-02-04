"use server";

import { Resend } from "resend";
import { ADMIN_EMAIL } from "@/lib/constants";
import { env } from "@/env";

export async function sendContactEmail({
  name,
  contact,
  subject,
  message,
}: {
  name: string;
  contact: string;
  subject: string;
  message: string;
}) {
  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: `${name} <${ADMIN_EMAIL}>`,
      to: "Mr.hamood277@gmail.com",
      subject: `${subject} من <${contact}>`,
      html: `
      <p><strong>الموضوع:</strong> ${subject}</p>
      <small><strong>جهة الاتصال:</strong> ${contact}</small>
      <p><strong>الرسالة:</strong><br />${message}</p>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
