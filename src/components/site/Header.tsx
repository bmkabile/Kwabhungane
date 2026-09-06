"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SITE_NAV } from "@/lib/constants";
import { useCart } from "@/components/CartProvider";
import { useState } from "react";

export function Header() {
  const pathname = usePathname();
  const { count, open } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="bg-ink text-cream-2 text-xs">
        <div className="max-w-wrap mx-auto px-7 py-1.5 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex gap-4 flex-wrap opacity-90">
            <span>034 312 0000</span>
            <span className="hidden sm:inline">Newcastle · Madadeni · Nelspruit</span>
          </div>
          <Link href="/admin/dashboard" className="opacity-80 hover:opacity-100 font-semibold">
            Admin Dashboard &rarr;
          </Link>
        </div>
      </div>

      <header className="bg-cream border-b border-cream-2 sticky top-0 z-40">
        <div className="max-w-wrap mx-auto px-7 py-3 flex items-center gap-7">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image src="/logo.jpg" alt="Kwa Bhungane" width={52} height={52} className="rounded-full object-cover" />
            <div className="leading-tight">
              <strong className="font-serif text-lg text-ink block">Kwa Bhungane</strong>
              <span className="text-[10px] tracking-widest uppercase text-ember-600 font-bold">
                Umtholampilo Wesintu
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex ml-auto gap-1">
            {SITE_NAV.map((item) => {
              const current = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2.5 rounded text-sm font-semibold hover:bg-cream-2 ${
                    current ? "text-ember-700" : "text-bark"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:ml-0 ml-auto">
            <button
              onClick={open}
              aria-label="Open cart"
              className="relative w-10 h-10 rounded-full border border-cream-2 bg-white flex items-center justify-center hover:border-ember-500"
            >
              🛒
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-ember-600 text-white text-[10px] font-bold min-w-[17px] h-[17px] rounded-full flex items-center justify-center px-1">
                  {count}
                </span>
              )}
            </button>
            <button
              className="md:hidden w-10 h-10 rounded-full border border-cream-2 bg-white flex items-center justify-center"
              aria-label="Menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              ☰
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="md:hidden border-t border-cream-2 px-4 py-2 flex flex-col">
            {SITE_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-sm font-semibold text-bark"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
