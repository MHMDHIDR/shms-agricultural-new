"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type DeleteSocialLinkProps = {
  link: {
    id: string;
    socialType: string;
  };
};

export default function DeleteSocialLink({ link }: DeleteSocialLinkProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const utils = api.useUtils();
  const router = useRouter();

  const { mutate: deleteSocialLink } =
    api.socialLinks.deleteSocialLinks.useMutation({
      onMutate: () => {
        setIsDeleting(true);
      },
      onSuccess: async () => {
        toast.success("تم حذف الرابط بنجاح");
        await utils.socialLinks.getSocialLinks.invalidate();
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message || "حدث خطأ ما");
      },
      onSettled: () => {
        setIsDeleting(false);
      },
    });

  const handleDelete = () => {
    if (window.confirm(`هل أنت متأكد من حذف رابط ${link.socialType}؟`)) {
      deleteSocialLink({ id: link.id });
    }
  };

  return (
    <>
      {/* <Button
      variant="destructive"
      className="cursor-pointer"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? "جاري الحذف..." : "حذف"}
    </Button> */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="cursor-pointer">
            حذف
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent dir="auto">
          <AlertDialogHeader>
            <AlertDialogTitle>
              هل أنت متأكد من حذف رابط {link.socialType}؟
            </AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "جاري الحذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
