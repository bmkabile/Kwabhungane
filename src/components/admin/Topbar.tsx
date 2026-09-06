export function Topbar({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="bg-white border-b border-[#E7DCC7] px-7.5 py-4 flex justify-between items-center sticky top-0 z-10">
      <div>
        <h2 className="text-xl m-0">{title}</h2>
        <div className="text-[13px] text-muted mt-0.5">{subtitle}</div>
      </div>
      <div className="w-8.5 h-8.5 rounded-full bg-gold-soft text-ember-700 flex items-center justify-center font-extrabold text-[13px]" style={{ width: 34, height: 34 }}>
        A
      </div>
    </div>
  );
}
