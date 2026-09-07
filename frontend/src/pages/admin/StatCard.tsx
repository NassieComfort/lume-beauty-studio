import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  badge?: string;
  badgeColor?: string;
  subtext?: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  badge,
  badgeColor = "bg-[#FCE8E8] text-[#C88A95]",
  subtext,
}: StatCardProps) {
  const formattedValue =
    typeof value === "number"
      ? `\u20A6${value.toLocaleString("en-NG", { minimumFractionDigits: 0 })}`
      : value;

  return (
    <div className="bg-white border border-[#E8DFD8] p-6 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">
          {label}
        </p>

        {badge && (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeColor}`}>
            {badge}
          </span>
        )}

        {Icon && !badge && (
          <div className="w-8 h-8 rounded-full bg-[#FAF7F3] border border-[#E8DFD8] flex items-center justify-center text-[#C88A95]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div>
        <p className="font-serif text-3xl font-bold text-[#292524]">
          {formattedValue}
        </p>
        {subtext && (
          <p className="text-xs text-[#78716C] mt-1">{subtext}</p>
        )}
      </div>
    </div>
  );
}