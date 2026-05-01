"use client";

import { useState, useRef } from "react";
import { CategoryDef, DEFAULT_CATEGORIES } from "@/lib/types";
import AddCategoryModal from "@/components/AddCategoryModal";
import QuickAmountInput from "@/components/QuickAmountInput";

interface AddItemFormProps {
  categories: CategoryDef[];
  onAdd: (title: string, amount: number, category: string) => void;
  onAddCategory: (category: CategoryDef) => void;
}

export default function AddItemForm({
  categories,
  onAdd,
  onAddCategory,
}: AddItemFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState<string>(DEFAULT_CATEGORIES[0].name);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) return;
    onAdd(title.trim(), amount, category);
    setTitle("");
    setAmount(0);
    titleRef.current?.focus();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          ref={titleRef}
          type="text"
          placeholder="What did you spend on?"
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none transition-colors"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <QuickAmountInput amount={amount} onChange={setAmount} />

        <div className="flex gap-2">
          <select
            className="flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm focus:border-neutral-400 focus:outline-none transition-colors"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-500 hover:bg-neutral-50 active:scale-95 transition-all"
            onClick={() => setShowAddCategory(true)}
          >
            +
          </button>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-neutral-900 text-white text-sm font-medium py-3 hover:bg-neutral-800 active:scale-[0.98] transition-all"
        >
          Add Expense
        </button>
      </form>

      <AddCategoryModal
        open={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        onAdd={(cat) => {
          onAddCategory(cat);
          setCategory(cat.name);
        }}
        existingNames={categories.map((c) => c.name)}
      />
    </>
  );
}
