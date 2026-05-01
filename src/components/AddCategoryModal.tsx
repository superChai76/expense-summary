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
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center px-4">
      <div className="card bg-base-100 w-full max-w-sm shadow-xl">
        <div className="card-body p-5 gap-4">
          <h3 className="card-title text-base">Add Category</h3>

          <input
            type="text"
            placeholder="Category name"
            className={`input input-bordered input-sm w-full ${
              isDuplicate ? "input-error" : ""
            }`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            autoFocus
          />
          {isDuplicate && (
            <div className="text-xs text-error -mt-2">
              Category already exists
            </div>
          )}

          <div>
            <div className="text-xs text-base-content/60 mb-2">Choose icon</div>
            <IconPicker selected={icon} onSelect={setIcon} />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center gap-2 flex-1">
              <div className="text-sm">
                Preview: {icon} <strong>{name.trim() || "..."}</strong>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-1">
            <button
              className="btn btn-ghost btn-sm flex-1"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary btn-sm flex-1"
              onClick={handleAdd}
              disabled={!name.trim() || isDuplicate}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
