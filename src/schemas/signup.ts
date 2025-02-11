import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون أكثر من حرفين"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phone: z.string().refine((value) => isValidPhoneNumber(value), {
    message: "رقم الهاتف غير صالح",
  }),
  nationality: z.string().min(2, "الجنسية يجب أن تكون أكثر من حرفين"),
  dateOfBirth: z.date({
    required_error: "تاريخ الميلاد مطلوب",
    invalid_type_error: "تاريخ الميلاد غير صالح",
  }),
  address: z
    .string({ required_error: "يجب إدخال العنوان لنستطيع التواصل معك" })
    .min(2, "العنوان يجب أن يكون أكثر من حرفين"),
  password: z
    .string()
    .min(8, "كلمة المرور يجب أن تكون أكثر من 8 أحرف")
    .regex(/[A-Z]/, "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل")
    .regex(/[a-z]/, "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل")
    .regex(/[0-9]/, "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل"),
  confirmPassword: z.string(),
  image: z.string(),
  doc: z.string(),
});

export type SignupInput = z.infer<typeof signupSchema>;
