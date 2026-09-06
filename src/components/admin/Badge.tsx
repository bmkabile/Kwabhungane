export function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[11.5px] font-bold px-2.5 py-0.5 rounded-full ${className}`}>
      {children}
    </span>
  );
}
