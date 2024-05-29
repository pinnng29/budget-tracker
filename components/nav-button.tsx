import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  href: string;
  label?: string;
  isActive?: boolean;
}

export default function NavButton({
  href,
  label,
  isActive
}: Props) {
  return (
    <Button
      asChild
      size={"sm"}
      variant={"outline"}
      className={cn(
        "w-full lg:w-auto justify-between font-normal hover:bg-primary/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-primary focus:bg-primary/30 transition",
        isActive ? "bg-primary/10 text-primary" : "bg-transparent"
      )}
    >
      <Link href={href}>
        {label}
      </Link>
    </Button>
  )
}
