"use client";

import { useState } from "react";
import { CategoryDef, DEFAULT_CATEGORIES } from "@/lib/types";
import AddCategoryModal from "@/components/AddCategoryModal";

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
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>(DEFAULT_CATEGORIES[0].name);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!title.trim() || isNaN(numAmount) || numAmount <= 0) return;
    onAdd(title.trim(), numAmount, category);
    setTitle("");
    setAmount("");
  };

  const selectedCat = categories.find((c) => c.name === category);

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-4 gap-3">
        <h2 className="card-title text-base">Add Expense</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Title (e.g. Food, Taxi)"
            className="input input-bordered input-sm w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            className="input input-bordered input-sm w-full"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
          />

          <div className="flex gap-2">
            <select
              className="select select-bordered select-sm flex-1"
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
              className="btn btn-outline btn-sm btn-square"
              onClick={() => setShowAddCategory(true)}
              title="Add category"
            >
              +
            </button>
          </div>

          {selectedCat && (
            <div className="flex items-center gap-1 text-xs text-base-content/50">
              <span>{selectedCat.icon}</span>
              <span>{selectedCat.name}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-sm">
            + Add
          </button>
        </form>
      </div>

      <AddCategoryModal
        open={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        onAdd={(cat) => {
          onAddCategory(cat);
          setCategory(cat.name);
        }}
        existingNames={categories.map((c) => c.name)}
      />
    </div>
  );
}
