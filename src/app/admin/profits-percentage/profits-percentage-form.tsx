"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import type { Projects } from "@prisma/client";
import { Input } from "@/components/ui/input";

export default function ProfitsPercentageForm({
  projects,
}: {
  projects: Projects[];
}) {
  const toast = useToast();
  const router = useRouter();
  const utils = api.useUtils();

  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [percentage, setPercentage] = useState<number>(0);
  const [percentageCode, setPercentageCode] = useState<string>("");

  const { mutate: updateProfitsPercentage, isPending: isUpdating } =
    api.projects.updateProfitsPercentage.useMutation({
      onSuccess: async () => {
        toast.success("تم تحديث نسبة الربح بنجاح");
        setSelectedProject(null);
        setPercentage(0);
        setPercentageCode("");
        await utils.projects.getAll.invalidate();
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message || "حدث خطأ ما");
      },
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProject || !percentage || !percentageCode) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    updateProfitsPercentage({
      projectId: selectedProject,
      percentage,
      percentageCode,
    });
  };

  const generatePercentageCode = () => {
    return Math.random().toString(36).substring(2, 9).toUpperCase();
  };

  const selectedProjectData = selectedProject
    ? projects.find((p) => p.id === selectedProject)
    : null;

  return (
    <form dir="rtl" onSubmit={handleSubmit} className="mb-10">
      <div className="flex items-center justify-center">
        <div className="mx-3 w-full md:w-2/3">
          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label className="mb-1 block font-bold text-gray-500 md:mb-0 md:text-right">
                اختر المشروع
              </label>
            </div>
            <div className="md:w-2/3">
              <Select
                value={selectedProject ?? ""}
                onValueChange={(value) => {
                  setSelectedProject(value);
                  setPercentageCode(generatePercentageCode());
                }}
              >
                <SelectTrigger className="w-full cursor-pointer" dir="auto">
                  <SelectValue placeholder="اختر المشروع" />
                </SelectTrigger>
                <SelectContent dir="auto">
                  {projects.map((project) => (
                    <SelectItem
                      key={project.id}
                      value={project.id}
                      className="cursor-pointer"
                    >
                      {project.projectName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label className="mb-1 block font-bold text-gray-500 md:mb-0 md:text-right">
                رمز زيادة النسبة
              </label>
            </div>
            <div className="md:w-2/3">
              <span className="inline-block min-h-8 w-full rounded border border-gray-900 bg-white px-4 py-2 leading-tight font-bold text-gray-700 select-none dark:bg-gray-800 dark:text-gray-300">
                {percentageCode}
              </span>
            </div>
          </div>

          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label className="mb-1 block font-bold text-gray-500 md:mb-0 md:text-right">
                النسبة المئوية
              </label>
            </div>
            <div className="md:w-2/3">
              <Input
                type="number"
                className="w-full rounded border border-gray-200 bg-gray-200 px-4 py-2 !text-lg leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none dark:bg-gray-800 dark:text-gray-300"
                placeholder="15"
                min="0"
                max="100"
                value={percentage || ""}
                onChange={(e) => setPercentage(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label className="mb-1 block font-bold text-gray-500 md:mb-0 md:text-right">
                الربح الحالي
              </label>
            </div>
            <div className="md:w-2/3">
              <span className="inline-block w-full rounded border border-gray-900 bg-white px-4 py-2 leading-tight font-bold text-gray-700 select-none dark:bg-gray-800 dark:text-gray-300">
                {selectedProjectData?.projectStockProfits ?? 0}
              </span>
            </div>
          </div>

          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label className="mb-1 block font-bold text-gray-500 md:mb-0 md:text-right">
                الربح الجديد
              </label>
            </div>
            <div className="md:w-2/3">
              <span className="inline-block w-full rounded border border-gray-900 bg-white px-4 py-2 leading-tight font-bold text-gray-700 select-none dark:bg-gray-800 dark:text-gray-300">
                {selectedProjectData
                  ? selectedProjectData.projectStockProfits +
                    (selectedProjectData.projectStockProfits * percentage) / 100
                  : 0}
              </span>
            </div>
          </div>

          <div className="mb-6 md:flex md:items-center">
            <Button
              type="submit"
              disabled={isUpdating || !selectedProject || !percentage}
              className="cursor-pointer"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ"
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
