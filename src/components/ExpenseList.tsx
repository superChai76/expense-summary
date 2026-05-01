"use client";

import {
  ExpenseItem,
  CategoryDef,
  getCategoryDisplay,
  getCategoryBadgeClass,
} from "@/lib/types";

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
      <div className="text-center text-base-content/50 py-6 text-sm">
        No expenses yet. Add one above!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const cat = getCategoryDisplay(item.category, categories);
        return (
          <div
            key={item.id}
            className="flex items-center justify-between bg-base-100 rounded-lg px-3 py-2 shadow-sm"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`badge badge-sm ${getCategoryBadgeClass(item.category)}`}
              >
                {cat.icon} {cat.name}
              </span>
              <span className="text-sm truncate">{item.title}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-semibold">
                ฿
                {item.amount.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                })}
              </span>
              <button
                onClick={() => onDelete(item.id)}
                className="btn btn-ghost btn-xs text-error"
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
