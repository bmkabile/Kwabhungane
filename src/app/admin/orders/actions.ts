"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/database.types";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = createClient();
  const payload: { status: OrderStatus; payment_status?: "Paid" } =
    status === "Paid" ? { status, payment_status: "Paid" } : { status };
  const { error } = await supabase.from("orders").update(payload).eq("id", orderId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
}
