"use client";

interface TotalDisplayProps {
  total: number;
}

export default function TotalDisplay({ total }: TotalDisplayProps) {
  return (
    <div className="text-center py-3">
      <div className="text-sm text-base-content/60 mb-1">Total</div>
      <div className="text-3xl font-bold text-primary">
        ฿{total.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
}
