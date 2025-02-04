"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const services = [
  "خدمات استشارية زراعية",
  "تمويل المشاريع الزراعية",
  "تسويق المنتجات الزراعية",
  "تأجير المعدات الزراعية",
  "شكاوى وملاحظات",
  "أخرى",
];

const Contact = () => {
  // Form States
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [phoneOrEmailError, setPhoneOrEmailError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [messageError, setMessageError] = useState("");

  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isDoneSubmitting, setIsDoneSubmitting] = useState<boolean>(false);

  const { replace } = useRouter();
  const toast = useToast();

  const sendMessageMutation = api.contact.sendMessage.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setIsDoneSubmitting(true);
      setTimeout(() => replace(`/`), 2000);
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Error", error);
    },
    onSettled: () => {
      setIsSubmittingForm(false);
    },
  });

  function resetFormErrors() {
    setPhoneOrEmailError("");
    setSubjectError("");
    setMessageError("");
  }

  const blurPhoneOrEmail = (phoneOrEmail: string) => {
    if (phoneOrEmail === "") {
      setPhoneOrEmailError("الرجاء التأكد من صحة البيانات المدخلة");
    } else {
      setPhoneOrEmailError("");
    }
  };

  const handleSelectChange = (value: string) => {
    setSubject(value);
    setSubjectError("");
  };

  const handelContact = async (e: {
    target: any;
    key?: string;
    preventDefault: () => void;
  }) => {
    // don't refresh the page
    e.preventDefault();

    // check if the form is valid
    if (phoneOrEmail === "") {
      resetFormErrors();
      setPhoneOrEmailError(
        "الرجاء التأكد من إدخال رقم الهاتف أو البريد الالكتروني",
      );
    } else if (subject === "") {
      resetFormErrors();
      setSubjectError("الرجاء اختيار نوع الخدمة");
    } else if (message === "") {
      resetFormErrors();
      setMessageError("الرجاء التأكد من إدخال الرسالة");
    } else {
      try {
        resetFormErrors();
        setIsSubmittingForm(true);

        // Use tRPC mutation
        sendMessageMutation.mutate({
          phoneOrEmail,
          subject,
          message,
        });
      } catch (error: any) {
        const message = error?.message ?? "حدث خطأ ما";
        toast.error(message);
        console.error("Error", error);
      }
    }
  };

  return (
    <section className="mb-16 mt-4 flex h-screen min-h-screen items-center justify-center p-4 md:mt-16">
      <form
        className="w-full md:max-w-2xl"
        dir="rtl"
        onSubmit={(e) => handelContact(e)}
      >
        {phoneOrEmailError && (
          <div className="mb-2 text-red-500">{phoneOrEmailError}</div>
        )}
        <div className="mb-6 md:flex md:items-center">
          <div className="md:w-1/3">
            <label
              style={{ textAlign: "right" }}
              className="mb-1 block pl-4 font-bold text-gray-500 md:mb-0 md:text-right"
            >
              البريد الالكتروني أو رقم الهاتف
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              className="w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none dark:bg-gray-800 dark:text-gray-300"
              onBlur={(e) => blurPhoneOrEmail(e.target.value)}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              id="inline-contact"
              type="text"
              placeholder="رقم الهاتف أو البريد الالكتروني"
            />
          </div>
        </div>

        {subjectError && (
          <div className="mb-2 text-red-500">{subjectError}</div>
        )}
        <div className="mb-6 md:flex md:items-center">
          <div className="md:w-1/3">
            <label
              style={{ textAlign: "right" }}
              htmlFor="subject"
              className="mb-1 block font-bold text-gray-500 md:mb-0 md:text-right"
            >
              نوع الخدمة
            </label>
          </div>
          <div className="md:w-2/3">
            <Select onValueChange={handleSelectChange} value={subject}>
              <SelectTrigger className="rtl">
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
          </div>
        </div>

        {messageError && (
          <div className="mb-2 text-red-500">{messageError}</div>
        )}
        <div className="mb-6 md:flex md:items-center">
          <div className="md:w-1/3">
            <label
              style={{ textAlign: "right" }}
              htmlFor="message"
              className="mb-1 block pl-4 font-bold text-gray-500 md:mb-0 md:text-right"
            >
              الرسالة
            </label>
          </div>
          <div className="md:w-2/3">
            <textarea
              id="message"
              className="max-h-96 min-h-64 w-full resize-y rounded border border-gray-200 bg-gray-200 px-4 py-2 leading-relaxed text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none dark:bg-gray-800 dark:text-gray-300"
              onChange={(e) => setMessage(e.target.value)}
              rows={10}
              cols={50}
              placeholder="اكتب رسالتك هنا"
            />
          </div>
        </div>

        <div className="my-4 flex w-full justify-between"></div>

        {/* Submit Button */}
        <div className="md:flex md:items-center">
          <Button
            disabled={isSubmittingForm}
            type="submit"
            className={`focus:shadow-outline w-full bg-purple-500 text-white shadow hover:bg-purple-400 focus:outline-none font-bold${
              isDoneSubmitting ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {isSubmittingForm ? (
              <>
                <Loader2 className="ml-3 h-4 w-4 animate-spin" />
                جاري الارسال ...
              </>
            ) : isDoneSubmitting ? (
              "وصلتنا رسالتك 😄"
            ) : (
              "ارسال"
            )}
          </Button>
        </div>
      </form>
    </section>
  );
};
export default Contact;
