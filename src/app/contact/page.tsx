"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  type ContactFormData,
  contactSchema,
  services,
} from "@/schemas/contact";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });
  const toast = useToast();
  const service = useSearchParams().get("service");

  const sendMessageMutation = api.contact.sendMessage.useMutation({
    onSuccess: () => {
      toast.success("تم إرسال الرسالة بنجاح");
      reset();
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ ما");
    },
  });

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    try {
      await sendMessageMutation.mutateAsync(data);
      setTimeout(() => redirect("/"), 2500);
    } catch (error) {
      console.error("Submission error", error);
    }
  };

  return (
    <section className="flex h-screen min-h-screen items-center justify-center p-2.5">
      <form
        className="w-full md:max-w-4xl"
        dir="rtl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-6 md:flex md:items-center">
          <div className="md:w-1/3">
            <Label
              style={{ textAlign: "right" }}
              className="mb-1 block pl-4 font-bold text-gray-500 md:mb-0 md:text-right"
              htmlFor="contact"
            >
              البريد الالكتروني أو رقم الهاتف
            </Label>
          </div>
          <div className="md:w-2/3">
            <Input
              className="w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden dark:bg-gray-800 dark:text-gray-300"
              {...register("phoneOrEmail")}
              id="contact"
              type="text"
              placeholder="رقم الهاتف أو البريد الالكتروني"
            />
            {errors.phoneOrEmail && (
              <p className="mt-1 text-xs text-red-500">
                {errors.phoneOrEmail.message}
              </p>
            )}
          </div>
        </div>

        <div className="mb-6 md:flex md:items-center">
          <div className="md:w-1/3">
            <Label
              style={{ textAlign: "right" }}
              className="mb-1 block pl-4 font-bold text-gray-500 md:mb-0 md:text-right"
              htmlFor="subject"
            >
              نوع الخدمة
            </Label>
          </div>
          <div className="md:w-2/3">
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={service ?? field.value}
                >
                  <SelectTrigger
                    className="rtl w-full border border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden dark:bg-gray-800 dark:text-gray-300"
                    id="subject"
                  >
                    <SelectValue placeholder="اختر نوع الخدمة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="rtl">
                      <SelectLabel>اختر نوع الخدمة</SelectLabel>
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.subject && (
              <p className="mt-1 text-xs text-red-500">
                {errors.subject.message}
              </p>
            )}
          </div>
        </div>

        <div className="mb-6 md:flex md:items-center">
          <div className="md:w-1/3">
            <Label
              style={{ textAlign: "right" }}
              className="mb-1 block pl-4 font-bold text-gray-500 md:mb-0 md:text-right"
              htmlFor="message"
            >
              الرسالة
            </Label>
          </div>
          <div className="md:w-2/3">
            <Textarea
              {...register("message")}
              className="max-h-96 min-h-64 w-full resize-y appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-2 leading-loose text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden dark:bg-gray-800 dark:text-gray-300"
              placeholder="اكتب رسالتك هنا"
              rows={10}
              cols={50}
              id="message"
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-500">
                {errors.message.message}
              </p>
            )}
          </div>
        </div>

        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>
          <div className="md:w-2/3">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                "إرسال الرسالة"
              )}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
