"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/custom/file-upload";
import { api } from "@/trpc/react";
import type { User } from "@prisma/client";
import { accountFormSchema } from "@/schemas/account";

type AccountFormValues = {
  name: string;
  email: string;
  phone: string;
  nationality: string;
  dateOfBirth: Date;
  theme: "light" | "dark";
  image: string;
};

export function AccountForm({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<Array<File>>([]);
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);
  const { setTheme } = useTheme();
  const { update } = useSession();
  const toast = useToast();

  const optimizeImageMutation = api.optimizeImage.optimizeImage.useMutation();
  const uploadFilesMutation = api.S3.uploadFiles.useMutation();
  const updateUserMutation = api.user.update.useMutation({
    onSuccess: async (data) => {
      if (data) {
        form.reset({
          name: data.name,
          email: user.email ?? "",
          phone: data.phone ?? "",
          nationality: data.nationality ?? "",
          dateOfBirth: data.dateOfBirth,
          theme: data.theme ?? "light",
          image: data.image ?? "",
        });

        setTheme(data.theme ?? "light");

        if (data.image) {
          await update({
            ...user,
            name: data.name,
            image: data.image,
          });
        }

        toast.success("تم تحديث البيانات بنجاح");
        setIsEditingEnabled(false);
      }
    },
  });

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      nationality: user.nationality ?? "",
      dateOfBirth: user.dateOfBirth,
      theme: user.theme ?? "light",
      image: user.image ?? "",
    },
  });

  const handleFilesSelected = (selectedFiles: Array<File>) => {
    setFiles(selectedFiles);
  };

  const optimizeAndUploadImage = async (file: File | undefined) => {
    if (!file) return null;

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const optimizedBase64 = await optimizeImageMutation.mutateAsync({
      base64,
      quality: 70,
    });

    const fileData = [
      {
        name: file.name.replace(/\.[^.]+$/, ".webp"),
        type: "image/webp",
        size: optimizedBase64.length,
        lastModified: file.lastModified,
        base64: optimizedBase64,
      },
    ];

    const uploadedUrls = await uploadFilesMutation.mutateAsync({
      entityId: `user-avatar/${user.id}`,
      fileData,
    });

    return uploadedUrls[0];
  };

  async function onSubmit(values: AccountFormValues) {
    try {
      setIsLoading(true);
      let imageUrl = values.image;

      if (files.length > 0) {
        const uploadedUrl = await optimizeAndUploadImage(files[0]);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      await updateUserMutation.mutateAsync({
        id: user.id,
        ...values,
        image: imageUrl,
      });
    } catch (error) {
      console.error("Update error:", error);
      toast.error("حدث خطأ أثناء تحديث البيانات");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="mb-8 flex items-center gap-x-6">
          {form.watch("image") ? (
            <Image
              src={
                files[0]
                  ? URL.createObjectURL(files[0])
                  : (form.watch("image") ?? "")
              }
              alt={`Profile Image of ${user?.name}`}
              width={112}
              height={112}
              className="h-28 w-28 rounded-full object-cover shadow"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
              <span className="text-2xl font-bold text-gray-500">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <FileUpload
            onFilesSelected={handleFilesSelected}
            accept="image/*"
            maxFiles={1}
            disabled={!isEditingEnabled}
          />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم الكامل</FormLabel>
              <FormControl>
                <Input
                  placeholder="ادخل اسمك الكامل"
                  className="border border-gray-200 bg-gray-200 text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden dark:bg-gray-800 dark:text-gray-300"
                  disabled={!isEditingEnabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الالكتروني</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  className="border border-gray-200 bg-gray-200 text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden dark:bg-gray-800 dark:text-gray-300"
                  disabled={true} // Email cannot be changed
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رقم الهاتف</FormLabel>
              <FormControl>
                <PhoneInput
                  placeholder="ادخل رقم الهاتف"
                  className="border border-gray-200 bg-gray-200 text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden dark:bg-gray-800 dark:text-gray-300"
                  disabled={!isEditingEnabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الجنسية</FormLabel>
              <FormControl>
                <Input
                  placeholder="ادخل جنسيتك"
                  className="border border-gray-200 bg-gray-200 text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden dark:bg-gray-800 dark:text-gray-300"
                  disabled={!isEditingEnabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تاريخ الميلاد</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  className="border border-gray-200 bg-gray-200 text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden dark:bg-gray-800 dark:text-gray-300"
                  disabled={!isEditingEnabled}
                  {...field}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                  value={
                    field.value
                      ? new Date(field.value).toISOString().split("T")[0]
                      : ""
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">الوضع الداكن</FormLabel>
                <FormDescription>تفعيل الوضع الداكن للتطبيق</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value === "dark"}
                  onCheckedChange={(checked) => {
                    const theme = checked ? "dark" : "light";
                    field.onChange(theme);
                    setTheme(theme);
                  }}
                  disabled={!isEditingEnabled}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-x-4">
          {!isEditingEnabled ? (
            <Button
              type="button"
              onClick={() => setIsEditingEnabled(true)}
              variant="outline"
            >
              تعديل البيانات
            </Button>
          ) : (
            <>
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[100px]"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "حفظ"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditingEnabled(false);
                  form.reset();
                }}
              >
                إلغاء
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  );
}
