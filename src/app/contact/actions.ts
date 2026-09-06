"use server";

import { createClient } from "@/lib/supabase/server";

export interface ContactFormState {
  ok: boolean;
  message: string;
}

export async function submitContactMessage(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { ok: false, message: "Please fill in your name, email and message." };
  }

  const supabase = createClient();
  const { error } = await supabase.from("contact_messages").insert({ name, email, subject, message });

  if (error) {
    return { ok: false, message: "Something went wrong sending your message. Please try again." };
  }
  return { ok: true, message: "Thanks — your message has been sent. We'll be in touch within one business day." };
}
