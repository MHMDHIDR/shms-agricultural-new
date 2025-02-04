import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

// List of services to validate against
export const services = [
  "خدمات استشارية زراعية",
  "تمويل المشاريع الزراعية",
  "تسويق المنتجات الزراعية",
  "تأجير المعدات الزراعية",
  "شكاوى وملاحظات",
  "خدامات أخرى",
];

// Validation schema for contact form
export const contactSchema = z.object({
  phoneOrEmail: z
    .string()
    .trim()
    .min(1, {
      message: "الرجاء التأكد من إدخال رقم الهاتف أو البريد الالكتروني",
    })
    .refine(
      (value) => {
        const emailValidation = z.string().email();

        try {
          if (isValidPhoneNumber(value)) return true;

          emailValidation.parse(value);
          return true;
        } catch {
          return false;
        }
      },
      {
        message:
          "يرجى إدخال رقم هاتف صحيح (مع كود الدولة) أو بريد إلكتروني صالح",
      },
    ),

  subject: z
    .string()
    .trim()
    .min(1, { message: "الرجاء اختيار نوع الخدمة" })
    .refine((value) => services.includes(value), {
      message: "يرجى اختيار خدمة صالحة",
    }),

  message: z
    .string()
    .trim()
    .min(10, {
      message: "يجب أن تكون الرسالة 10 أحرف على الأقل",
    })
    .max(500, {
      message: "يجب أن تكون الرسالة 500 حرف كحد أقصى",
    }),
});

// Type for the contact form data
export type ContactFormData = z.infer<typeof contactSchema>;
