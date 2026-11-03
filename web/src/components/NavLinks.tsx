"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  const path = usePathname();
  const active = path === href || path.startsWith(`${href}/`);
  return (
    <Link href={href} className={`navlink whitespace-nowrap ${className}`} aria-current={active ? "page" : undefined}>
      {children}
    </Link>
  );
}
