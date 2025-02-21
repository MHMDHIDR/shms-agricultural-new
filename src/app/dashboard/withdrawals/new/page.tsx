"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { withdrawAmountSchema } from "@/schemas/withdraw"
import { api } from "@/trpc/react"
import WithdrawNavigation from "../withdraw-navigation"
import type { WithdrawFormData } from "@/schemas/withdraw"

export default function NewWithdrawPage() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const toast = useToast()
  const router = useRouter()

  const form = useForm<WithdrawFormData>({
    resolver: zodResolver(withdrawAmountSchema),
    defaultValues: { amount: 0 },
  })

  const { mutate: createWithdrawRequest, isPending: isSendingRequest } =
    api.operations.createWithdrawRequest.useMutation({
      onSuccess: () => {
        toast.success("تم إرسال طلب السحب بنجاح")
        form.reset()
        setShowConfirmation(false)
        router.refresh()
      },
      onError: error => {
        toast.error(error.message ?? "حدث خطأ غير متوقع!")
        setShowConfirmation(false)
      },
    })

  function onSubmit() {
    setShowConfirmation(true)
  }

  async function handleConfirm() {
    const values = form.getValues()
    createWithdrawRequest(values)
  }

  return (
    <section className="flex select-none flex-col h-screen items-center md:items-baseline px-2 md:px-9 pt-14">
      <div className="w-full">
        <WithdrawNavigation />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المبلغ المطلوب سحبه</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="أدخل المبلغ المطلوب سحبه"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                      onWheel={e => e.currentTarget.blur()}
                      min={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant={"pressable"} disabled={isSendingRequest}>
              {isSendingRequest ? "جاري إرسال الطلب..." : "إرسال طلب السحب"}
            </Button>
          </form>
        </Form>

        <ConfirmationDialog
          open={showConfirmation}
          onOpenChange={setShowConfirmation}
          title={`هل أنت متأكد من سحب مبلغ ${form.getValues().amount} ريال؟`}
          description="لا يمكن التراجع عن هذا الإجراء."
          buttonText={isSendingRequest ? "جاري التأكيد..." : "تأكيد"}
          buttonClass="bg-primary hover:bg-primary/90"
          onConfirm={handleConfirm}
        />
      </div>
    </section>
  )
}
