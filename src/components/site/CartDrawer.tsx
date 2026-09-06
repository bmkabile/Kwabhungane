"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatZAR } from "@/lib/format";

export function CartDrawer() {
  const { lines, isOpen, close, subtotal, setQty } = useCart();

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 bg-ink/45 z-[60] transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-[61] shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="px-5 py-5 border-b border-cream-2 flex justify-between items-center">
          <h3 className="text-lg font-serif m-0">Your Cart</h3>
          <button onClick={close} className="w-8 h-8 rounded-full border border-cream-2 bg-white">✕</button>
        </div>
        <div className="px-5 overflow-y-auto flex-1">
          {lines.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">🛒</div>
              <p className="text-muted">Your cart is empty.</p>
            </div>
          ) : (
            lines.map((l) => (
              <div key={l.productId} className="flex gap-3 items-center py-3.5 border-b border-cream-2">
                <div className="w-13 h-13 rounded bg-cream-2 shrink-0" style={{ width: 52, height: 52 }} />
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-sm text-ink truncate">{l.name}</div>
                  <div className="text-xs text-muted">
                    <button onClick={() => setQty(l.productId, l.qty - 1)} className="px-1">−</button>
                    <span className="px-1">{l.qty}</span>
                    <button onClick={() => setQty(l.productId, l.qty + 1)} className="px-1">+</button>
                    {" "}× {formatZAR(l.price)}
                  </div>
                </div>
                <div className="text-sm font-bold">{formatZAR(l.price * l.qty)}</div>
              </div>
            ))
          )}
        </div>
        <div className="px-5 py-4 border-t border-cream-2">
          {lines.length > 0 && (
            <div className="flex justify-between font-extrabold text-lg mb-3.5">
              <span>Subtotal</span>
              <span>{formatZAR(subtotal)}</span>
            </div>
          )}
          <Link
            href="/cart"
            onClick={close}
            className="block text-center w-full py-3 rounded bg-ember-600 hover:bg-ember-700 text-white font-bold mb-2"
          >
            {lines.length ? "View Cart" : "Shop Products"}
          </Link>
          {lines.length > 0 && (
            <Link
              href="/checkout"
              onClick={close}
              className="block text-center w-full py-3 rounded border-2 border-ember-600 text-ember-700 font-bold hover:bg-ember-600 hover:text-white"
            >
              Checkout
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
