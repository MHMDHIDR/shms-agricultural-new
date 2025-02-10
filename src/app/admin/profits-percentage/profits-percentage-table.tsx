"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { CopyText } from "@/components/custom/copy";
import type { Projects } from "@prisma/client";

export default function ProfitsPercentageTable({
  projects,
}: {
  projects: Projects[];
}) {
  const toast = useToast();
  const router = useRouter();
  const utils = api.useUtils();

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  const { mutate: deleteProfitsPercentage, isPending: isDeleting } =
    api.projects.deleteProfitsPercentage.useMutation({
      onSuccess: async () => {
        toast.success("تم حذف نسبة الربح بنجاح");
        setSelectedProjectId(null);
        await utils.projects.getAll.invalidate();
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message || "حدث خطأ ما");
        setSelectedProjectId(null);
      },
    });

  const handleDelete = (projectId: string) => {
    setSelectedProjectId(projectId);
    deleteProfitsPercentage({ projectId });
  };

  const projectsWithPercentage = projects.filter(
    (project) => project.projectSpecialPercentageCode,
  );

  return (
    <Table className="rtl mt-8 table min-h-full min-w-full divide-y divide-gray-200 text-center">
      <TableHeader>
        <TableRow>
          <TableHead className="text-center font-bold">اسم المشروع</TableHead>
          <TableHead className="text-center font-bold">
            رمز زيادة نسبة الربح
          </TableHead>
          <TableHead className="text-center font-bold">
            النسبة المئوية
          </TableHead>
          <TableHead className="text-center font-bold">الربح الحالي</TableHead>
          <TableHead className="text-center font-bold">الربح الجديد</TableHead>
          <TableHead className="text-center font-bold">الإجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projectsWithPercentage.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-gray-500">
              لا توجد رموز زيادة نسبة الربح
            </TableCell>
          </TableRow>
        ) : (
          projectsWithPercentage.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.projectName}</TableCell>
              <TableCell>
                <CopyText
                  text={project.projectSpecialPercentageCode ?? ""}
                  className="ml-2 inline h-4 w-4"
                />
                {project.projectSpecialPercentageCode}
              </TableCell>
              <TableCell>{project.projectSpecialPercentage}%</TableCell>
              <TableCell>{project.projectStockProfits}</TableCell>
              <TableCell>
                {project.projectStockProfits +
                  (project.projectStockProfits *
                    (project.projectSpecialPercentage ?? 0)) /
                    100}
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isDeleting && selectedProjectId === project.id}
                      onClick={() => setSelectedProjectId(project.id)}
                      className="cursor-pointer"
                    >
                      {isDeleting && selectedProjectId === project.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          جاري الحذف...
                        </>
                      ) : (
                        "حذف"
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader className="rtl:text-right">
                      <AlertDialogTitle>
                        هل أنت متأكد من حذف رمز زيادة نسبة الربح؟
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        لا يمكن التراجع عن هذا الإجراء بعد تنفيذه.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 rtl:justify-start!">
                      <AlertDialogCancel
                        onClick={() => setSelectedProjectId(null)}
                      >
                        إلغاء
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => {
                          if (selectedProjectId) {
                            handleDelete(selectedProjectId);
                          }
                        }}
                      >
                        {isDeleting && selectedProjectId === project.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            جاري الحذف...
                          </>
                        ) : (
                          "حذف"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
