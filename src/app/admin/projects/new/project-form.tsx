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
import { projectSchema } from "@/schemas/project"
import { api } from "@/trpc/react"
import type { ProjectInput } from "@/schemas/project"

export function ProjectForm() {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<{
    projectImages?: File[]
    projectStudyCase?: File[]
  }>({})

  const toast = useToast()
  const router = useRouter()

  const form = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: "",
      projectLocation: "",
      projectDescription: "",
      projectTerms: "",
      projectAvailableStocks: 0,
      projectTotalStocks: 0,
      projectStockPrice: 0,
      projectStockProfits: 0,
    },
  })

  // Initialize MarkdownIt
  const md = new MarkdownIt()

  const { mutateAsync: uploadFiles } = api.S3.uploadFiles.useMutation()
  const { mutateAsync: createProject, isPending } = api.projects.create.useMutation()
  const { mutateAsync: updateProject, isPending: isUpdating } =
    api.projects.updateById.useMutation()

  const handleFileSelection = (files: File[], type: "projectImages" | "projectStudyCase") => {
    setSelectedFiles(prev => ({
      ...prev,
      [type]: files,
    }))
  }

  const uploadSelectedFiles = async (projectId: string) => {
    const filesToUpload: { type: "projectImages" | "projectStudyCase"; files: File[] }[] = []

    if (selectedFiles.projectImages?.length) {
      filesToUpload.push({ type: "projectImages", files: selectedFiles.projectImages })
    }
    if (selectedFiles.projectStudyCase?.length) {
      filesToUpload.push({ type: "projectStudyCase", files: selectedFiles.projectStudyCase })
    }

    if (filesToUpload.length === 0) return {}

    setIsUploading(true)
    try {
      const uploadResults: Record<string, string[]> = {}

      for (const { type, files } of filesToUpload) {
        const urls = await uploadFiles({
          entityId: `project-${type}/${projectId}`,
          fileData: files.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
            base64: "",
          })),
        })

        if (urls && urls.length > 0) {
          uploadResults[type] = urls
        }
      }

      return uploadResults
    } catch (error) {
      console.error("File upload error:", error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  // Function to convert markdown to HTML
  const convertToHtml = (markdown: string) => {
    return md.render(markdown)
  }

  // Modify the onSubmit function to convert markdown to HTML before submission
  const onSubmit = async (data: ProjectInput) => {
    try {
      // Convert project terms to HTML
      const dataWithHtml = {
        ...data,
        projectTerms: convertToHtml(data.projectTerms),
        projectDescription: convertToHtml(data.projectDescription),
      }

      const newProjectId = await createProject(dataWithHtml)
      if (!newProjectId) {
        throw new Error("حدث خطأ أثناء إضافة المشروع")
      }

      const uploadedUrls = await uploadSelectedFiles(newProjectId)
      if (uploadedUrls) {
        await updateProject({
          id: newProjectId,
          data: uploadedUrls,
        })
      }

      toast.success("تم إضافة المشروع بنجاح")
      router.refresh()
      router.push("/admin/projects")
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "حدث خطأ أثناء إضافة المشروع"
      toast.error(errorMsg)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mx-3">
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
                    {...field}
                    value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                    onChange={e => field.onChange(new Date(e.target.value))}
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
                    {...field}
                    value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                    onChange={e => field.onChange(new Date(e.target.value))}
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
                    {...field}
                    value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                    onChange={e => field.onChange(new Date(e.target.value))}
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
                    {...field}
                    value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                    onChange={e => field.onChange(new Date(e.target.value))}
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
            name="projectAvailableStocks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>عدد الأسهم المتاحة</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
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
            name="projectStockProfits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>أرباح السهم</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
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

        <Button
          type="submit"
          variant="pressable"
          className="w-full"
          disabled={isPending || isUploading}
        >
          {(isPending || isUploading) && <Loader2 className="mr-2 animate-spin" />}
          إضافة المشروع
        </Button>
      </form>
    </Form>
  )
}
