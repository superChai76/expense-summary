"use client";

interface TotalDisplayProps {
  total: number;
}

export default function TotalDisplay({ total }: TotalDisplayProps) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-sm font-medium text-neutral-400">Total</span>
      <span className="text-2xl font-bold text-neutral-900 tabular-nums tracking-tight">
        ฿{total.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
      </span>
    </div>
  );
}
