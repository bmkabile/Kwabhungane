import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-ink text-cream-2 pt-12 pb-6">
      <div className="max-w-wrap mx-auto px-7">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-9 mb-9">
          <div>
            <div className="flex items-center gap-3 mb-3.5">
              <Image src="/logo.jpg" alt="Kwa Bhungane" width={44} height={44} className="rounded-full" />
              <strong className="font-serif text-lg text-white">Kwa Bhungane</strong>
            </div>
            <p className="text-sm text-cream-2 mb-3">
              Indigenous healthcare, prepared with care — online and across our three branches.
            </p>
          </div>
          <div>
            <h5 className="text-white text-xs tracking-wide uppercase mb-3.5">Shop</h5>
            <Link href="/shop" className="block text-sm mb-2 hover:text-gold-soft">All Products</Link>
            <Link href="/cart" className="block text-sm mb-2 hover:text-gold-soft">Cart</Link>
            <span className="block text-sm mb-2 opacity-70">Book a Consultation — Coming Soon</span>
          </div>
          <div>
            <h5 className="text-white text-xs tracking-wide uppercase mb-3.5">Company</h5>
            <Link href="/about" className="block text-sm mb-2 hover:text-gold-soft">About Us</Link>
            <Link href="/branches" className="block text-sm mb-2 hover:text-gold-soft">Branches</Link>
            <Link href="/contact" className="block text-sm mb-2 hover:text-gold-soft">Contact</Link>
          </div>
          <div>
            <h5 className="text-white text-xs tracking-wide uppercase mb-3.5">Contact</h5>
            <p className="text-sm mb-2">034 312 0000</p>
            <p className="text-sm mb-2">info@kwabhungane.co.za</p>
            <p className="text-sm mb-2">Newcastle · Madadeni · Nelspruit</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-5 text-xs flex justify-between flex-wrap gap-2 text-[#B9A98F]">
          <span>&copy; {new Date().getFullYear()} Kwa Bhungane. All rights reserved.</span>
          <span>Phase 1</span>
        </div>
      </div>
    </footer>
  );
}
