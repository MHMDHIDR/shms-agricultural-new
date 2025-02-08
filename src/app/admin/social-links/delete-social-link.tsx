// src/app/admin/social-links/delete-social-link.tsx
"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteSocialLinkProps {
  link: {
    id: string;
    socialType: string;
  };
}

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
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? "جاري الحذف..." : "حذف"}
    </Button>
  );
}
