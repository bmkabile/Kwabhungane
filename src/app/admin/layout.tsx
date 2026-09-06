import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/AdminNav";
import { logout } from "@/app/admin/login/actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The /admin/login page itself renders outside this shell.
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[#F4EFE4]">
      <aside className="w-[230px] shrink-0 bg-ink text-cream-2 flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-2.5 px-4.5 py-5 border-b border-white/10">
          <Image src="/logo.jpg" alt="Kwa Bhungane" width={36} height={36} className="rounded-full" />
          <div className="leading-tight">
            <strong className="font-serif text-[15px] text-white block">Kwa Bhungane</strong>
            <span className="text-[10px] text-gold-soft tracking-wide">ADMIN DASHBOARD</span>
          </div>
        </div>
        <AdminNav />
        <div className="px-4.5 py-3.5 border-t border-white/10 text-xs text-[#8B7A62]">
          Signed in as <strong className="text-[#D8CFC0]">{user.email}</strong>
          <br />
          <Link href="/" className="text-gold-soft font-bold">&larr; Back to public site</Link>
          <br />
          <form action={logout}>
            <button className="text-gold-soft font-bold mt-1">Sign out</button>
          </form>
        </div>
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
