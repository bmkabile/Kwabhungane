"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitContactMessage, type ContactFormState } from "@/app/contact/actions";

const initialState: ContactFormState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-6 py-3 rounded bg-ember-600 hover:bg-ember-700 disabled:opacity-60 text-white font-bold">
      {pending ? "Sending…" : "Send Message"}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useFormState(submitContactMessage, initialState);

  return (
    <form action={formAction}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-xs font-bold text-bark">Full name</label>
          <input name="name" required placeholder="Your name" className="border border-cream-2 rounded px-3.5 py-2.5 text-sm" />
        </div>
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-xs font-bold text-bark">Email</label>
          <input name="email" required type="email" placeholder="you@example.com" className="border border-cream-2 rounded px-3.5 py-2.5 text-sm" />
        </div>
        <div className="flex flex-col gap-1.5 mb-4 sm:col-span-2">
          <label className="text-xs font-bold text-bark">Subject</label>
          <input name="subject" placeholder="How can we help?" className="border border-cream-2 rounded px-3.5 py-2.5 text-sm" />
        </div>
        <div className="flex flex-col gap-1.5 mb-4 sm:col-span-2">
          <label className="text-xs font-bold text-bark">Message</label>
          <textarea name="message" rows={5} required placeholder="Tell us more…" className="border border-cream-2 rounded px-3.5 py-2.5 text-sm" />
        </div>
      </div>
      <SubmitButton />
      {state.message && (
        <p className={`mt-3 text-sm ${state.ok ? "text-ok" : "text-danger"}`}>{state.message}</p>
      )}
    </form>
  );
}
