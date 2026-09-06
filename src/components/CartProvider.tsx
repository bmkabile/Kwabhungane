"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { FREE_DELIVERY_THRESHOLD, COURIER_FEE } from "@/lib/constants";

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  price: number; // unit price at time of adding (sale price if applicable)
  stock: number; // known stock at time of adding, used for +/- clamping in the UI
  qty: number;
}

interface CartContextValue {
  lines: CartLine[];
  add: (item: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "kb_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const deliveryFee = count === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : COURIER_FEE;

    return {
      lines,
      count,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add: (item, qty = 1) => {
        setLines((prev) => {
          const existing = prev.find((l) => l.productId === item.productId);
          if (existing) {
            return prev.map((l) =>
              l.productId === item.productId
                ? { ...l, qty: Math.min(l.qty + qty, item.stock) }
                : l
            );
          }
          return [...prev, { ...item, qty: Math.min(qty, item.stock) }];
        });
        setIsOpen(true);
      },
      setQty: (productId, qty) => {
        setLines((prev) =>
          prev
            .map((l) => (l.productId === productId ? { ...l, qty: Math.max(1, Math.min(qty, l.stock)) } : l))
        );
      },
      remove: (productId) => setLines((prev) => prev.filter((l) => l.productId !== productId)),
      clear: () => setLines([]),
    };
  }, [lines, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
