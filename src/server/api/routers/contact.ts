import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { sendContactEmail } from "@/lib/email";

export const contactRouter = createTRPCRouter({
  sendMessage: publicProcedure
    .input(
      z.object({
        phoneOrEmail: z
          .string()
          .min(1, "يجب إدخال البريد الإلكتروني أو رقم الهاتف"),
        subject: z.string().min(1, "يجب اختيار نوع الخدمة"),
        message: z.string().min(1, "يجب إدخال الرسالة"),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const result = await sendContactEmail({
          name: input.phoneOrEmail,
          contact: input.phoneOrEmail,
          subject: input.subject,
          message: input.message,
        });

        if (result.success) {
          return {
            message: `تم إرسال رسالتك بنجاح، سيتم الرد في أقرب وقت ممكن!`,
            mailSent: 1,
          };
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `عفواً! حدث خطأ أثناء إرسال رسالتك لنا!`,
          });
        }
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `عفواً، حدث خطأ غير متوقع`,
        });
      }
    }),
});
