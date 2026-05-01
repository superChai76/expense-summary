"use client";

import { useState, useRef, useEffect } from "react";
import { ExpenseItem, CategoryDef, getCategoryDisplay } from "@/lib/types";

interface ExpenseListProps {
  items: ExpenseItem[];
  categories: CategoryDef[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string, amount: number, category: string) => void;
}

function EditRow({
  item,
  categories,
  onSave,
  onCancel,
}: {
  item: ExpenseItem;
  categories: CategoryDef[];
  onSave: (title: string, amount: number, category: string) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [amount, setAmount] = useState(item.amount);
  const [category, setCategory] = useState(item.category);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") {
        if (title.trim() && amount > 0) {
          onSave(title.trim(), amount, category);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [title, amount, category, onSave, onCancel]);

  return (
    <div className="flex flex-col gap-2 py-3 px-3 rounded-xl bg-neutral-50 border border-neutral-200">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm focus:border-neutral-400 focus:outline-none"
        />
        <input
          type="number"
          value={amount || ""}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          className="w-24 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm tabular-nums focus:border-neutral-400 focus:outline-none"
          min="0"
          step="0.01"
        />
      </div>
      <div className="flex gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm focus:border-neutral-400 focus:outline-none"
        >
          {categories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            if (title.trim() && amount > 0) {
              onSave(title.trim(), amount, category);
            }
          }}
          className="rounded-lg bg-neutral-900 text-white text-sm font-medium px-4 py-1.5 active:scale-95 transition-transform"
        >
          ✓
        </button>
      </div>
    </div>
  );
}

export default function ExpenseList({
  items,
  categories,
  onDelete,
  onUpdate,
}: ExpenseListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

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
        if (editingId === item.id) {
          return (
            <div key={item.id} className="mb-1">
              <EditRow
                item={item}
                categories={categories}
                onSave={(title, amount, category) => {
                  onUpdate(item.id, title, amount, category);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            </div>
          );
        }

        const cat = getCategoryDisplay(item.category, categories);
        return (
          <div
            key={item.id}
            className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-b-0 group cursor-pointer"
            onClick={() => setEditingId(item.id)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="text-red-300 hover:text-red-500 transition-colors text-sm active:scale-90"
                title="ลบ"
              >
                🗑
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
