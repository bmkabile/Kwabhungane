"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV } from "@/lib/constants";

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="px-2.5 py-3.5 flex flex-col gap-0.5 flex-1 overflow-y-auto">
      {ADMIN_NAV.map((section) => (
        <div key={section.section}>
          <div className="text-[10.5px] uppercase tracking-wide text-[#8B7A62] px-3 pt-3.5 pb-1.5">{section.section}</div>
          {section.items.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded text-[13.8px] font-semibold ${
                  active ? "bg-ember-600 text-white" : "text-cream-2 hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
