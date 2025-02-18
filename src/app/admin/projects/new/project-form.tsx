"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, X } from "lucide-react"
import MarkdownIt from "markdown-it"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FileUpload } from "@/components/custom/file-upload"
import MarkdownHelp from "@/components/custom/projects/project-condition"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { convertToBase64 } from "@/lib/convert-file-to-base64"
import { formatDateValue, parseDate } from "@/lib/format-date"
import { optimizeImage } from "@/lib/optimize-image"
import { projectSchema } from "@/schemas/project"
import { api } from "@/trpc/react"
import type { ProjectInput } from "@/schemas/project"

type FileSelectionType = {
  projectImages: File[]
  projectStudyCase: File[]
}

export function ProjectForm() {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<Partial<FileSelectionType>>({})

  const toast = useToast()
  const router = useRouter()

  const form = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: "",
      projectLocation: "",
      projectDescription: "",
      projectTerms: "",
      projectTotalStocks: 0,
      projectStockPrice: 0,
      projectStockProfits: 0,
      projectStartDate: undefined,
      projectEndDate: undefined,
      projectInvestDate: undefined,
      projectProfitsCollectDate: undefined,
      projectImages: [],
      projectStudyCase: "",
    },
  })

  const md = new MarkdownIt()
  const { mutateAsync: uploadFiles } = api.S3.uploadFiles.useMutation()
  const { mutateAsync: createProject, isPending: isCreatingProject } =
    api.projects.create.useMutation()

  const processFile = async (
    file: File,
  ): Promise<{
    name: string
    type: string
    size: number
    lastModified: number
    base64: string
  }> => {
    const base64 = await convertToBase64(file)
    if (file.type.startsWith("image/")) {
      try {
        const optimizedBase64 = await optimizeImage({
          base64,
          quality: 70,
        })
        return {
          name: file.name.replace(/\.[^.]+$/, ".webp"),
          type: "image/webp",
          size: optimizedBase64.length,
          lastModified: file.lastModified,
          base64: optimizedBase64,
        }
      } catch (error) {
        console.error("Image optimization failed:", error)
        return {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          base64,
        }
      }
    }
    return {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
      base64,
    }
  }

  const handleFileSelection = (files: File[], type: keyof FileSelectionType) => {
    setSelectedFiles(prev => ({
      ...prev,
      [type]: files,
    }))

    // VERY IMPORTANT: Update form values when files are selected
    if (type === "projectImages" && files.length > 0) {
      form.setValue("projectImages", ["temp-image"])
    }
    if (type === "projectStudyCase" && files.length > 0) {
      form.setValue("projectStudyCase", "temp-study")
    }
  }

  const uploadSelectedFiles = async (projectId: string) => {
    const uploads: { type: keyof FileSelectionType; files: File[] }[] = []

    if (selectedFiles.projectImages?.length) {
      uploads.push({ type: "projectImages", files: selectedFiles.projectImages })
    }
    if (selectedFiles.projectStudyCase?.length) {
      uploads.push({ type: "projectStudyCase", files: selectedFiles.projectStudyCase })
    }

    if (uploads.length === 0) return { projectImages: [], projectStudyCase: "" }

    setIsUploading(true)
    try {
      const results: { projectImages: string[]; projectStudyCase: string } = {
        projectImages: [],
        projectStudyCase: "",
      }

      for (const { type, files } of uploads) {
        const fileData = await Promise.all(files.map(processFile))
        const urls = await uploadFiles({
          entityId: `project-${type}/${projectId}`,
          fileData,
        })

        if (type === "projectImages") {
          results.projectImages = urls
        } else {
          results.projectStudyCase = urls[0] ?? ""
        }
      }

      return results
    } catch (error) {
      console.error("File upload error:", error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data: ProjectInput) => {
    if (!selectedFiles.projectImages?.length || !selectedFiles.projectStudyCase?.length) {
      toast.error("يجب تحميل صور المشروع وملف دراسة الجدوى")
      return
    }

    try {
      const projectId = crypto.randomUUID()
      const uploadedUrls = await uploadSelectedFiles(projectId)

      if (!uploadedUrls.projectImages.length || !uploadedUrls.projectStudyCase) {
        throw new Error("فشل في تحميل الملفات")
      }

      // Create project with uploaded files
      const newProjectId = await createProject({
        ...data,
        projectTerms: md.render(data.projectTerms),
        projectImages: uploadedUrls.projectImages,
        projectStudyCase: uploadedUrls.projectStudyCase,
      })

      if (!newProjectId) {
        throw new Error("حدث خطأ أثناء إضافة المشروع")
      }

      setSelectedFiles({})
      toast.success("تم إضافة المشروع بنجاح")
      router.push(`/admin/projects`)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "حدث خطأ أثناء إضافة المشروع"
      toast.error(errorMsg)
    }
  }

  const isLoading = isCreatingProject || isUploading

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="projectImages"
            render={() => (
              <FormItem>
                <FormLabel>صور المشروع</FormLabel>
                <FormControl>
                  <FileUpload
                    onFilesSelected={files => handleFileSelection(files, "projectImages")}
                    accept={{ "image/*": [".jpeg", ".jpg", ".png", ".webp"] }}
                    disabled={isUploading}
                    multiple
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="projectStudyCase"
            render={() => (
              <FormItem>
                <FormLabel>دراسة الجدوى</FormLabel>
                <FormControl>
                  <FileUpload
                    onFilesSelected={files => handleFileSelection(files, "projectStudyCase")}
                    accept={{ "application/pdf": [".pdf"] }}
                    disabled={isUploading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم المشروع</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="projectLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>موقع المشروع</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="projectStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تاريخ بداية المشروع</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={formatDateValue(field.value)}
                    onChange={e => {
                      const date = parseDate(e.target.value)
                      field.onChange(date)
                    }}
                    className="flex justify-end cursor-pointer"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="projectEndDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تاريخ نهاية المشروع</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={formatDateValue(field.value)}
                    onChange={e => {
                      const date = parseDate(e.target.value)
                      field.onChange(date)
                    }}
                    className="flex justify-end cursor-pointer"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="projectInvestDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تاريخ نهاية الاستثمار</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={formatDateValue(field.value)}
                    onChange={e => {
                      const date = parseDate(e.target.value)
                      field.onChange(date)
                    }}
                    className="flex justify-end cursor-pointer"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="projectProfitsCollectDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تاريخ جمع الأرباح</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={formatDateValue(field.value)}
                    onChange={e => {
                      const date = parseDate(e.target.value)
                      field.onChange(date)
                    }}
                    className="flex justify-end cursor-pointer"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="projectTotalStocks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>إجمالي عدد الأسهم المتاحة</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                    min={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projectStockPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>سعر السهم</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                    min={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="projectStockProfits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>أرباح السهم</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                    min={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="projectDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>وصف المشروع</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Textarea
                    {...field}
                    rows={5}
                    placeholder="أدخل وصف المشروع"
                    className="resize-none"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="projectTerms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span>شروط المشروع (يدعم Markdown)</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="m-2 cursor-pointer">
                      عرض التعليمات
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="ltr text-wrap max-w-full overflow-y-auto overflow-x-hidden break-words">
                    <DialogHeader className="text-center!">
                      <DialogTitle>شروط المشروع</DialogTitle>
                      <DialogDescription>الرجاء قراءة تعليمات استخدام markdown</DialogDescription>
                    </DialogHeader>
                    <MarkdownHelp />
                    <DialogFooter className="justify-center!">
                      <DialogClose className="cursor-pointer" asChild>
                        <Button variant="destructive">
                          غلق
                          <X className="w-4 h-4" />
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Textarea
                    {...field}
                    rows={5}
                    placeholder="أدخل شروط المشروع (يدعم Markdown)"
                    className="resize-none"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="pressable" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 animate-spin" />}
          إضافة المشروع
        </Button>
      </form>
    </Form>
  )
}
