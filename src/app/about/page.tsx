import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us — Kwa Bhungane" };

const pillars = [
  { title: "Our Mission", body: "Placeholder — to be confirmed with Kwa Bhungane. Making indigenous healthcare accessible, professional and trusted." },
  { title: "Our Vision", body: "Placeholder — to be confirmed with Kwa Bhungane. Building South Africa's leading indigenous healthcare platform." },
  { title: "Indigenous Knowledge", body: "Every product carries knowledge passed down through generations of practice." },
  { title: "The Three Branches", body: "Newcastle (Head Office), Madadeni and Nelspruit — one standard of care, three doors." },
];

export default function AboutPage() {
  return (
    <section className="py-14">
      <div className="max-w-wrap mx-auto px-7 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <div className="text-ember-600 font-bold text-xs tracking-wide uppercase mb-2.5">About Kwa Bhungane</div>
          <h2 className="text-3xl">Umtholampilo Wesintu — a clinic of the people</h2>
          <p>
            Kwa Bhungane was founded to preserve indigenous knowledge and make traditional healthcare more
            accessible, professional and sustainable for the communities we serve. What began as a single
            practice has grown into three branches across Newcastle, Madadeni and Nelspruit.
          </p>
          <p>
            Today we&rsquo;re bringing that same care online — so customers anywhere in South Africa can reach
            the products and knowledge that have always been at the heart of Kwa Bhungane.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-5">
            {pillars.map((p) => (
              <div key={p.title} className="bg-white border border-cream-2 rounded p-4.5">
                <h4 className="text-sm text-ember-700 mb-1.5">{p.title}</h4>
                <p className="text-[13.5px] text-muted m-0">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-bark rounded p-10 flex items-center justify-center">
          <Image src="/logo.jpg" alt="Kwa Bhungane" width={280} height={280} className="rounded-full w-full max-w-[280px]" />
        </div>
      </div>
    </section>
  );
}
