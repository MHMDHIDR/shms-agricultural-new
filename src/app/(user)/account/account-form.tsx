"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import clsx from "clsx"
import { Loader2 } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FileUpload } from "@/components/custom/file-upload"
import SelectCountry from "@/components/custom/select-country"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { fallbackUsername } from "@/lib/fallback-username"
import { optimizeImage } from "@/lib/optimize-image"
import { accountFormSchema } from "@/schemas/account"
import { api } from "@/trpc/react"
import type { AccountFormValues } from "@/schemas/account"
import type { User } from "@prisma/client"

export function AccountForm({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<Array<File>>([])
  const [isEditingEnabled, setIsEditingEnabled] = useState(false)
  const { setTheme } = useTheme()
  const toast = useToast()

  const uploadFilesMutation = api.S3.uploadFiles.useMutation()
  const updateUserMutation = api.user.update.useMutation({
    onSuccess: async data => {
      if (data) {
        const updatedUser = {
          name: data.name ?? user.name,
          email: user.email,
          phone: data.phone,
          nationality: data.nationality,
          dateOfBirth: data.dateOfBirth,
          address: data.address,
          theme: data.theme,
          image: data.image ?? form.getValues("image"),
        }
        form.reset(updatedUser)
        setTheme(data.theme ?? "light")

        toast.success("تم تحديث البيانات بنجاح")
        setIsEditingEnabled(false)
      }
    },
    onError: error => {
      toast.error(`تعذر تحديث البيانات في الوقت الحالي! ${error.message}`)
    },
    onMutate: () => {
      toast.loading("جاري تحديث البيانات ...")
    },
  })

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      nationality: user.nationality,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      theme: user.theme,
      image: user.image ?? "",
    },
  })

  const handleFilesSelected = (selectedFiles: Array<File>) => {
    setFiles(selectedFiles)
  }

  const optimizeAndUploadImage = async (file: File | undefined) => {
    if (!file) return null

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    const optimizedBase64 = await optimizeImage({
      base64,
      quality: 70,
    })

    const fileData = [
      {
        name: file.name.replace(/\.[^.]+$/, ".webp"),
        type: "image/webp",
        size: optimizedBase64.length,
        lastModified: file.lastModified,
        base64: optimizedBase64,
      },
    ]

    const uploadedUrls = await uploadFilesMutation.mutateAsync({
      entityId: `user-avatar/${user.id}`,
      fileData,
    })

    return uploadedUrls[0]
  }

  async function onSubmit(values: AccountFormValues) {
    try {
      setIsLoading(true)
      let imageUrl = values.image

      if (files.length > 0) {
        const uploadedUrl = await optimizeAndUploadImage(files[0])
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        }
      }

      await updateUserMutation.mutateAsync({
        id: user.id,
        ...values,
        image: imageUrl,
      })
    } catch (error) {
      console.error("Update error:", error)
      toast.error("حدث خطأ أثناء تحديث البيانات")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="mb-8 flex items-center gap-x-6">
          <FormLabel
            htmlFor="fileUploadInput"
            className={clsx("group cursor-pointer", {
              "pointer-events-none opacity-50": !isEditingEnabled,
            })}
          >
            {form.watch("image") ? (
              <Image
                src={files[0] ? URL.createObjectURL(files[0]) : (form.watch("image") ?? "")}
                alt={`Profile Image of ${user?.name}`}
                width={112}
                height={112}
                className="h-28 w-28 rounded-full object-cover shadow"
              />
            ) : (
              <Avatar className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 transition-colors group-hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700">
                <AvatarImage src={user.image!} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {fallbackUsername(user.name)}
                </AvatarFallback>
              </Avatar>
            )}
          </FormLabel>
          <FileUpload
            onFilesSelected={handleFilesSelected}
            accept={{ "image/*": [".jpeg", ".jpg", ".png", ".webp"] }}
            maxFiles={1}
            disabled={!isEditingEnabled}
            className="flex items-center gap-x-2 space-y-0"
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
                  className="border border-gray-200 bg-gray-200 text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300"
                  disabled={true}
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
              <FormControl className="ltr">
                <PhoneInput
                  placeholder="ادخل رقم الهاتف"
                  className="border border-gray-200 bg-gray-200 text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden dark:bg-gray-800 dark:text-gray-300 rounded-md"
                  disabled={!isEditingEnabled}
                  defaultCountry="QA"
                  {...field}
                  value={
                    field.value && !field.value.startsWith("+") ? "+" + field.value : field.value
                  }
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
                  className="max-h-48 w-full rounded border border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none dark:bg-gray-800 dark:text-gray-300"
                  disabled={!isEditingEnabled}
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
                  className="flex justify-end border border-gray-200 bg-gray-200 text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden dark:bg-gray-800 dark:text-gray-300"
                  disabled={!isEditingEnabled}
                  {...field}
                  onChange={e => field.onChange(new Date(e.target.value))}
                  value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>العنوان</FormLabel>
              <FormControl>
                <Input
                  placeholder="عنوان السكن"
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
          name="theme"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">الوضع الداكن</FormLabel>
                <FormDescription>تفعيل الوضع الداكن للموقع</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value === "dark"}
                  onCheckedChange={checked => {
                    const theme = checked ? "dark" : "light"
                    field.onChange(theme)
                  }}
                  disabled={!isEditingEnabled}
                  className="ltr"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-start gap-x-4">
          {!isEditingEnabled ? (
            <Button
              type="button"
              onClick={e => {
                e.preventDefault() // doing this to prevent form submission
                setIsEditingEnabled(true)
              }}
              variant="outline"
              className="cursor-pointer"
            >
              تعديل البيانات
            </Button>
          ) : (
            <>
              <Button type="submit" disabled={isLoading} className="min-w-[100px] cursor-pointer">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "حفظ"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditingEnabled(false)
                  form.reset()
                  setTheme(form.watch("theme") ?? "light")
                }}
              >
                إلغاء
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  )
}
