import { File, X } from "lucide-react"
import Image from "next/image"
import React, { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"

type FileUploadProps = {
  onFilesSelected: (files: Array<File>) => void
  disabled?: boolean
  accept?: Record<string, string[]> | string
  maxFiles?: number
  className?: string
  isPreviewHidden?: boolean
}

export function FileUpload({
  onFilesSelected,
  disabled = false,
  accept,
  maxFiles,
  className,
  isPreviewHidden = false,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const clearPreview = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    setFileName(null)
    onFilesSelected([])
  }

  const onDrop = useCallback(
    (acceptedFiles: Array<File>) => {
      const file = acceptedFiles[0]
      if (!file) return

      // Clear previous preview
      if (preview) {
        URL.revokeObjectURL(preview)
      }

      // If it's an image, create preview URL
      if (file.type.startsWith("image/")) {
        const previewUrl = URL.createObjectURL(file)
        setPreview(previewUrl)
      }

      setFileName(file.name)
      onFilesSelected(acceptedFiles)
    },
    [onFilesSelected, preview],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      typeof accept === "string"
        ? { [accept]: [] }
        : (accept ?? { "image/*": [".jpeg", ".jpg", ".png", ".webp"] }),
    maxFiles: maxFiles ?? 1,
    disabled,
  })

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={`relative rounded-lg border-2 border-dashed p-4 text-center ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300"} ${disabled ? "cursor-not-allowed opacity-50" : "hover:border-primary cursor-pointer"}`}
      >
        <input id="fileUploadInput" {...getInputProps()} multiple={false} />
        {isDragActive ? <p>اسحب الملف هنا...</p> : <p>اسحب وأفلت الملف هنا، أو انقر للاختيار</p>}
        <small className="text-primary/75 text-xs">
          {accept ? (
            <p className="flex flex-col items-center justify-center gap-1">
              <span>يمكنك تحميل ملفات من نوع</span>
              <strong dir="ltr">{Object.values(accept).join(", ")}</strong>
            </p>
          ) : (
            "يمكنك تحميل أي نوع من الملفات"
          )}
        </small>
      </div>

      {!isPreviewHidden && (preview ?? fileName) && (
        <div className="relative mt-4 flex items-center gap-4 rounded-lg border p-4">
          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              className="h-20 w-20 rounded-lg object-cover"
              width={80}
              height={80}
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100">
              <File className="h-8 w-8 text-gray-400" />
            </div>
          )}

          <div className="flex-1">
            <p className="text-sm font-medium">{fileName}</p>
          </div>

          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              clearPreview()
            }}
            className="absolute top-2 right-2 cursor-pointer rounded-full bg-red-400 p-1 hover:bg-red-600"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      )}
    </div>
  )
}
