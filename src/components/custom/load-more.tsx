import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoadMore({ href }: { href: string }) {
  return (
    <Link href={href}>
      <Button variant="pressable">المزيد من الأسئلة</Button>
    </Link>
  );
}
