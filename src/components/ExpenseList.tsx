"use client";

import { ExpenseItem, CategoryDef, getCategoryDisplay } from "@/lib/types";

interface ExpenseListProps {
  items: ExpenseItem[];
  categories: CategoryDef[];
  onDelete: (id: string) => void;
}

export default function ExpenseList({
  items,
  categories,
  onDelete,
}: ExpenseListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center text-neutral-300 py-8 text-sm">
        No expenses yet
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {items.map((item) => {
        const cat = getCategoryDisplay(item.category, categories);
        return (
          <div
            key={item.id}
            className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-b-0"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-sm">{cat.icon}</span>
              <div className="flex flex-col min-w-0">
                <span className="text-sm text-neutral-800 truncate leading-tight">
                  {item.title}
                </span>
                <span className="text-[11px] text-neutral-400 leading-tight">
                  {cat.name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm font-semibold text-neutral-800 tabular-nums">
                ฿
                {item.amount.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                })}
              </span>
              <button
                onClick={() => onDelete(item.id)}
                className="text-neutral-300 hover:text-neutral-500 transition-colors text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
