"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { signupSchema, type SignupFormValues } from "@/schemas/signup";
import SelectCountry from "@/components/custom/select-country";
import { PhoneInput } from "@/components/ui/phone-input";
import { FileUpload } from "@/components/custom/file-upload";
import { api } from "@/trpc/react";
import crypto from "crypto";

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [profileFiles, setProfileFiles] = useState<Array<File>>([]);
  const [docFiles, setDocFiles] = useState<Array<File>>([]);
  const toast = useToast();
  const router = useRouter();

  const optimizeImageMutation = api.optimizeImage.optimizeImage.useMutation();
  const uploadFilesMutation = api.S3.uploadFiles.useMutation();
  const createUserMutation = api.user.create.useMutation();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      nationality: "",
      dateOfBirth: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  const handleProfileFilesSelected = (selectedFiles: Array<File>) => {
    setProfileFiles(selectedFiles);
  };

  const handleDocFilesSelected = (selectedFiles: Array<File>) => {
    setDocFiles(selectedFiles);
  };

  const generateUserId = crypto.randomBytes(12).toString("hex");

  const optimizeAndUploadFiles = async (
    files: File[],
    userId: string,
    prefix: string,
  ) => {
    if (!files.length) return undefined;

    const file = files[0];
    if (!file) return;

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    let optimizedBase64 = base64;
    if (file.type.startsWith("image/")) {
      optimizedBase64 = await optimizeImageMutation.mutateAsync({
        base64,
        quality: 70,
      });
    }

    const fileData = [
      {
        name: file.name,
        type: file.type,
        size: optimizedBase64.length,
        lastModified: file.lastModified,
        base64: optimizedBase64,
      },
    ];

    const uploadedUrls = await uploadFilesMutation.mutateAsync({
      entityId: `${prefix}/${userId}`,
      fileData,
    });

    return uploadedUrls[0];
  };

  async function onSubmit(values: SignupFormValues) {
    try {
      setIsLoading(true);
      console.log("Sign up values:", values);

      // Check if the profile file is selected
      if (profileFiles.length > 0) {
        const userId = generateUserId;
        const uploadedProfileUrl = await optimizeAndUploadFiles(
          profileFiles,
          userId,
          "profile",
        );
        console.log("Uploaded profile image URL:", uploadedProfileUrl);
      }

      // Handle document file uploads if needed
      if (docFiles.length > 0) {
        const userId = generateUserId;
        const uploadedDocUrl = await optimizeAndUploadFiles(
          docFiles,
          userId,
          "documents",
        );
        console.log("Uploaded document URL:", uploadedDocUrl);
      }

      // Call the createUser mutation with the form data
      const user = await createUserMutation.mutateAsync(values);

      toast.success("تم تسجيل حساب جديد بنجاح");
      // router.push("/welcome"); // Navigate to the welcome page or the desired page

      setIsLoading(false);
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("حدث خطأ اثناء تسجيل الحساب");
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم</FormLabel>
              <FormControl>
                <Input placeholder="أدخل اسمك" {...field} />
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
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="example@gmail.com"
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
                <SelectCountry
                  nationality={field.value}
                  setNationality={field.onChange}
                  placeholder="إختر الجنسية ..."
                  className="border border-gray-200 bg-gray-200 text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden dark:bg-gray-800 dark:text-gray-300"
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
                  value={
                    field.value
                      ? new Date(field.value).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>كلمة المرور</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تأكيد كلمة المرور</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormLabel>الصورة الشخصية</FormLabel>
              <FormControl>
                <FileUpload
                  onFilesSelected={handleProfileFilesSelected}
                  accept="image/*"
                  maxFiles={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="doc"
          render={() => (
            <FormItem>
              <FormLabel>مستند الهوية</FormLabel>
              <FormControl>
                <FileUpload
                  onFilesSelected={handleDocFilesSelected}
                  accept={{
                    "application/pdf": [".pdf"],
                    "image/*": [".jpeg", ".jpg", ".png", ".webp"],
                  }}
                  maxFiles={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant={"pressable"}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 animate-spin" />}تسجيل
        </Button>
      </form>
    </Form>
  );
}
