"use server";

import { createClient } from "@/lib/supabase/server";

export interface CheckoutItem {
  productId: string;
  quantity: number;
}

export interface CheckoutInput {
  name: string;
  email: string;
  phone: string;
  branchName: string;
  delivery: "courier" | "collection";
  address: string;
  items: CheckoutItem[];
}

export interface CheckoutResult {
  ok: boolean;
  orderNumber?: string;
  error?: string;
}

export async function placeOrder(input: CheckoutInput): Promise<CheckoutResult> {
  if (!input.items.length) {
    return { ok: false, error: "Your cart is empty." };
  }

  const supabase = createClient();

  const { data: branch } = await supabase
    .from("branches")
    .select("id")
    .eq("name", input.branchName)
    .maybeSingle();

  const { data, error } = await supabase.rpc("create_order", {
    p_customer_name: input.name,
    p_customer_email: input.email,
    p_customer_phone: input.phone,
    p_branch_id: branch?.id ?? null,
    p_delivery_method: input.delivery,
    p_delivery_address: input.address || null,
    p_items: input.items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
  });

  if (error) {
    return { ok: false, error: error.message.replace(/^.*?:\s*/, "") };
  }

  const row = Array.isArray(data) ? data[0] : data;
  return { ok: true, orderNumber: row?.order_number };
}
