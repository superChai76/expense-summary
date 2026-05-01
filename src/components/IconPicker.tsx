"use client";

import { ICON_OPTIONS } from "@/lib/types";

interface IconPickerProps {
  selected: string;
  onSelect: (icon: string) => void;
}

export default function IconPicker({ selected, onSelect }: IconPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {ICON_OPTIONS.map((icon) => (
        <button
          key={icon}
          type="button"
          onClick={() => onSelect(icon)}
          className={`btn btn-sm btn-square text-lg ${
            selected === icon ? "btn-primary" : "btn-ghost bg-base-200"
          }`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
