"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { Button } from "../ui/button";

export default function NavLink({ children, href }) {
  const path = usePathname();

  const base = "text-sm px-3 py-1";
  const active = "font-bold";
  const inactive = "opacity-90 hover:opacity-100";

  const isActive =
    href === "/" ? path === "/" : path === href || path.startsWith(href + "/");

  return (
    <Button
      asChild
      variant="link"
      className={`${base} ${isActive ? active : inactive}`}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
