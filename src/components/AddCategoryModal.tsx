"use client";

import { useState } from "react";
import { CategoryDef, ICON_OPTIONS } from "@/lib/types";
import IconPicker from "@/components/IconPicker";

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (category: CategoryDef) => void;
  existingNames: string[];
}

export default function AddCategoryModal({
  open,
  onClose,
  onAdd,
  existingNames,
}: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);

  if (!open) return null;

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (existingNames.includes(trimmed)) return;
    onAdd({ name: trimmed, icon });
    setName("");
    setIcon(ICON_OPTIONS[0]);
    onClose();
  };

  const isDuplicate = existingNames.includes(name.trim());

  return (
    <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl">
        <h3 className="text-sm font-semibold text-neutral-800 mb-4">
          New Category
        </h3>

        <input
          type="text"
          placeholder="Category name"
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm placeholder:text-neutral-400 focus:outline-none transition-colors mb-3 ${
            isDuplicate
              ? "border-red-300 focus:border-red-400"
              : "border-neutral-200 focus:border-neutral-400"
          }`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          autoFocus
        />
        {isDuplicate && (
          <div className="text-xs text-red-400 -mt-2 mb-3">
            Category already exists
          </div>
        )}

        <div className="mb-4">
          <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Icon
          </div>
          <IconPicker selected={icon} onSelect={setIcon} />
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
          <span>{icon}</span>
          <span className="font-medium">{name.trim() || "..."}</span>
        </div>

        <div className="flex gap-2">
          <button
            className="flex-1 rounded-xl border border-neutral-200 bg-white text-sm font-medium py-2.5 text-neutral-500 hover:bg-neutral-50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 rounded-xl bg-neutral-900 text-white text-sm font-medium py-2.5 hover:bg-neutral-800 active:scale-[0.98] transition-all disabled:opacity-40"
            onClick={handleAdd}
            disabled={!name.trim() || isDuplicate}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
