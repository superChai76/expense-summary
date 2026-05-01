"use client";

import {
  ExpenseItem,
  CategoryDef,
  getCategoryDisplay,
  getCategoryBadgeClass,
} from "@/lib/types";

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
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-4 gap-2">
        <h2 className="card-title text-base">By Category</h2>
        {entries.map(([catName, total]) => {
          const cat = getCategoryDisplay(catName, categories);
          return (
            <div key={catName} className="flex items-center justify-between">
              <span
                className={`badge badge-sm ${getCategoryBadgeClass(catName)}`}
              >
                {cat.icon} {cat.name}
              </span>
              <span className="text-sm font-medium">
                ฿{total.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
