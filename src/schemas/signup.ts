import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

// First define the base schema without the refinement
const baseSignupSchema = z.object({
  id: z.string().optional(),
  name: z
    .string({ required_error: "الاسم مطلوب" })
    .min(3, "الاسم يجب ان يكون اكثر من 3 حروف")
    .max(50, "الاسم يجب ان يكون اقل من 50 حرف"),

  email: z
    .string({ required_error: "البريد الالكتروني مطلوب" })
    .email("البريد الالكتروني غير صالح"),

  phone: z.string({ required_error: "رقم الهاتف مطلوب" }).refine(
    (value) => {
      const phoneNumberToValidate = value.startsWith("+") ? value : `+${value}`;
      return isValidPhoneNumber(phoneNumberToValidate);
    },
    { message: "رقم الهاتف غير صالح" },
  ),

  nationality: z
    .string({ required_error: "الجنسية مطلوبة" })
    .min(2, "الجنسية يجب ان تكون اكثر من حرفين"),

  dateOfBirth: z
    .date({ required_error: "تاريخ الميلاد مطلوب" })
    .max(new Date(), "تاريخ الميلاد يجب ان يكون في الماضي")
    .min(new Date("1900-01-01"), "تاريخ الميلاد غير صالح"),

  password: z
    .string({ required_error: "كلمة المرور مطلوبة" })
    .min(8, "كلمة المرور يجب ان تكون اكثر من 8 حروف")
    .max(32, "كلمة المرور يجب ان تكون اقل من 32 حرف"),

  confirmPassword: z.string({ required_error: "تأكيد كلمة المرور مطلوب" }),

  image: z.string(),
  doc: z.string(),
});

// Then create the signup schema with refinement
export const signupSchema = baseSignupSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "كلمة المرور غير متطابقة",
    path: ["confirmPassword"],
  },
);

// Now you can use pick on the base schema
export const accountFormSchema = baseSignupSchema.pick({
  id: true,
  name: true,
  email: true,
  phone: true,
  nationality: true,
  dateOfBirth: true,
  image: true,
});

export type SignupFormValues = z.infer<typeof signupSchema>;
