"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${
        isActive
          ? "text-blue-600"
          : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {children}
    </Link>
  );
}
