"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";

export function ShopFilters({
  categories,
  activeCategory,
  initialQuery,
}: {
  categories: string[];
  activeCategory: string;
  initialQuery: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [, startTransition] = useTransition();

  function pushParams(next: { q?: string; category?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    const merged = { q: query, category: activeCategory, ...next };
    if (merged.q) params.set("q", merged.q); else params.delete("q");
    if (merged.category && merged.category !== "All") params.set("category", merged.category); else params.delete("category");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  return (
    <>
      <div className="flex gap-3 items-center mb-6 flex-wrap">
        <input
          className="flex-1 min-w-[220px] border border-cream-2 bg-white rounded px-3.5 py-2.5 text-sm"
          placeholder="Search products…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && pushParams({ q: query })}
          onBlur={() => pushParams({ q: query })}
        />
      </div>
      <div className="flex gap-2 flex-wrap mb-6">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => pushParams({ category: c })}
            className={`border rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${
              activeCategory === c ? "bg-ink border-ink text-white" : "border-cream-2 bg-white text-bark"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </>
  );
}
