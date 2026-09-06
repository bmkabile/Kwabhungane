"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { login, type LoginState } from "@/app/admin/login/actions";

const initialState: LoginState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full py-3 rounded bg-ember-600 hover:bg-ember-700 disabled:opacity-60 text-white font-bold">
      {pending ? "Signing in…" : "Sign In"}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(login, initialState);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin/dashboard";

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="bg-white rounded-lg p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <Image src="/logo.jpg" alt="Kwa Bhungane" width={56} height={56} className="rounded-full mb-3" />
          <h2 className="text-xl mb-0">Admin Dashboard</h2>
          <p className="text-sm text-muted mt-1">Sign in to manage Kwa Bhungane</p>
        </div>
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="next" value={next} />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-bark">Email</label>
            <input name="email" type="email" required className="input" placeholder="admin@kwabhungane.co.za" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-bark">Password</label>
            <input name="password" type="password" required className="input" placeholder="••••••••" />
          </div>
          {state.error && <p className="text-danger text-sm">{state.error}</p>}
          <SubmitButton />
        </form>
        <p className="text-xs text-muted text-center mt-5">
          Admin accounts are created in Supabase Auth and added to the <code>admins</code> table — see the README.
        </p>
      </div>
    </div>
  );
}
