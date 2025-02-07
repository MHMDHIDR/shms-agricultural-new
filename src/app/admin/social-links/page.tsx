import { api } from "@/trpc/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";
import Link from "next/link";
import SocialLinksForm from "./social-links-form";
import DeleteSocialLink from "./delete-social-link";

export default async function SocialLinksPage() {
  const socialLinks = await api.settings.getSocialLinks();

  return (
    <>
      <h1 className="mt-20 mb-10 text-center text-2xl font-bold">
        روابط التواصل الاجتماعي
      </h1>

      <section className="container mx-auto">
        <SocialLinksForm />

        <Table className="rtl mt-8 table min-h-full min-w-full divide-y divide-gray-200 text-center">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center font-bold select-none">
                نوع المنصة
              </TableHead>
              <TableHead className="text-center font-bold select-none">
                الرابط
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!socialLinks || socialLinks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-gray-500">
                  لا توجد روابط تواصل اجتماعي
                </TableCell>
              </TableRow>
            ) : (
              socialLinks.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="flex items-center justify-center gap-x-2 font-semibold capitalize">
                    {link.socialType === "facebook" ? (
                      <FacebookIcon className="h-5 w-5 md:h-6 md:w-6" />
                    ) : link.socialType === "instagram" ? (
                      <InstagramIcon className="h-5 w-5 md:h-6 md:w-6" />
                    ) : link.socialType === "youtube" ? (
                      <YoutubeIcon className="h-5 w-5 md:h-6 md:w-6" />
                    ) : (
                      <TwitterIcon className="h-5 w-5 md:h-6 md:w-6" />
                    )}
                    {link.socialType}
                  </TableCell>
                  <TableCell>
                    {link.socialLink ? (
                      <Link
                        href={link.socialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-blue-600 hover:underline"
                      >
                        {link.socialLink}
                      </Link>
                    ) : (
                      <span className="text-gray-500">لا يوجد رابط</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DeleteSocialLink link={link} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>
    </>
  );
}
