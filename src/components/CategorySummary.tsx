"use client";

import { ExpenseItem, CategoryDef, getCategoryDisplay } from "@/lib/types";

interface CategorySummaryProps {
  items: ExpenseItem[];
  categories: CategoryDef[];
}

export default function CategorySummary({
  items,
  categories,
}: CategorySummaryProps) {
  const grouped = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const entries = Object.entries(grouped).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
        By Category
      </div>
      {entries.map(([catName, total]) => {
        const cat = getCategoryDisplay(catName, categories);
        return (
          <div key={catName} className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <span className="text-xs">{cat.icon}</span>
              <span className="text-xs text-neutral-500">{cat.name}</span>
            </div>
            <span className="text-xs font-medium text-neutral-700 tabular-nums">
              ฿{total.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
            </span>
          </div>
        );
      })}
    </div>
  );
}
