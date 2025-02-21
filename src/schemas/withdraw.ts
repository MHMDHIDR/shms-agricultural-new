import { z } from "zod"

export const withdrawAmountSchema = z.object({
  amount: z
    .number()
    .min(1, "الرجاء إدخال مبلغ أكبر من صفر")
    .max(1000000, "المبلغ المطلوب كبير جداً"),
})

export type WithdrawFormData = z.infer<typeof withdrawAmountSchema>
