import type { Metadata } from "next";
import { ContactForm } from "@/app/contact/ContactForm";

export const metadata: Metadata = { title: "Contact — Kwa Bhungane" };

export default function ContactPage() {
  return (
    <section className="py-14">
      <div className="max-w-wrap mx-auto px-7">
        <div className="max-w-xl mb-10">
          <div className="text-ember-600 font-bold text-xs tracking-wide uppercase mb-2.5">Contact</div>
          <h2 className="text-3xl">Get in touch</h2>
          <p className="text-muted">Have a question about a product or an order? Reach out — our team responds within one business day.</p>
        </div>
        <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-12">
          <div>
            {[
              ["📞", "Phone", "034 312 0000"],
              ["💬", "WhatsApp", "082 000 0000"],
              ["✉️", "Email", "info@kwabhungane.co.za"],
            ].map(([icon, label, value]) => (
              <div key={label} className="bg-white border border-cream-2 rounded p-5 flex gap-3.5 items-start mb-3.5">
                <div className="w-9 h-9 rounded-full bg-leaf-soft text-leaf-700 flex items-center justify-center shrink-0">{icon}</div>
                <div><b className="block text-sm">{label}</b><span className="text-[13.5px] text-muted">{value}</span></div>
              </div>
            ))}
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
