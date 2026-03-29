import Link from "next/link";
import NavLink from "./NavLink";
import NavAuth from "./NavAuth";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b border-gray-200">
      <Link href="/" className="flex items-center gap-2">
        <img src="/logo.png" alt="Strategist" className="h-8 w-8" />
        <span className="font-semibold text-lg text-gray-900">Strategist</span>
      </Link>
      <div className="flex items-center gap-6">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/strategist">Strategist</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavAuth />
      </div>
    </nav>
  );
}
