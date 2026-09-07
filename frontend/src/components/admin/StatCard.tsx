import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sublabel: string;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
}: StatCardProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-lume-chocolate p-6 shadow-lume">
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.16em] text-lume-grey">
          {label}
        </p>
        <Icon aria-hidden="true" className="h-5 w-5 text-lume-cream/60" />
      </div>
      <p className="mt-6 font-display text-3xl text-lume-cream">{value}</p>
      <p className="mt-2 text-xs text-lume-grey">{sublabel}</p>
    </section>
  );
}
