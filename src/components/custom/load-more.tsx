import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoadMore({ href }: { href: string }) {
  return (
    <Button variant={"pressable"} className="mt-10">
      <Link href={href}>المزيد من الأسئلة</Link>
    </Button>
  );
}
