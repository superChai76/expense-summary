"use client";

import { ICON_OPTIONS } from "@/lib/types";

interface IconPickerProps {
  selected: string;
  onSelect: (icon: string) => void;
}

export default function IconPicker({ selected, onSelect }: IconPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {ICON_OPTIONS.map((icon) => (
        <button
          key={icon}
          type="button"
          onClick={() => onSelect(icon)}
          className={`rounded-xl py-2 text-base active:scale-95 transition-all ${
            selected === icon
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
