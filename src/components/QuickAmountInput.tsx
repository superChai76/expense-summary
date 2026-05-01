"use client";

import { useState, useCallback } from "react";

interface QuickAmountInputProps {
  amount: number;
  onChange: (amount: number) => void;
}

interface HistoryEntry {
  amount: number;
}

export default function QuickAmountInput({
  amount,
  onChange,
}: QuickAmountInputProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const pushHistory = useCallback(() => {
    setHistory((prev) => [...prev.slice(-19), { amount }]);
  }, [amount]);

  const adjust = (delta: number) => {
    pushHistory();
    const next = amount + delta;
    onChange(next < 0 ? 0 : next);
  };

  const clear = () => {
    pushHistory();
    onChange(0);
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    onChange(prev.amount);
  };

  const fmt = (n: number) =>
    n.toLocaleString("th-TH", { minimumFractionDigits: 0 });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-0.5">
          <ArrowBtn label="‹‹‹" onPress={() => adjust(-100)} />
          <ArrowBtn label="‹‹" onPress={() => adjust(-10)} />
          <ArrowBtn label="‹" onPress={() => adjust(-1)} />
        </div>

        <div className="px-3 py-1 min-w-[100px] text-center">
          <div className="text-2xl font-bold text-neutral-900 tabular-nums tracking-tight">
            ฿{fmt(amount)}
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          <ArrowBtn label="›" onPress={() => adjust(1)} />
          <ArrowBtn label="››" onPress={() => adjust(10)} />
          <ArrowBtn label="›››" onPress={() => adjust(100)} />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 rounded-lg border border-neutral-200 bg-white text-[11px] font-medium py-1.5 text-neutral-400 hover:bg-neutral-50 transition-colors"
          onClick={clear}
        >
          Clear
        </button>
        <button
          type="button"
          className="flex-1 rounded-lg border border-neutral-200 bg-white text-[11px] font-medium py-1.5 text-neutral-400 hover:bg-neutral-50 transition-colors disabled:opacity-40"
          onClick={undo}
          disabled={history.length === 0}
        >
          Undo
        </button>
      </div>
    </div>
  );
}

function ArrowBtn({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="w-10 h-10 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 active:scale-90 transition-all duration-75 text-sm font-light tracking-tight select-none"
    >
      {label}
    </button>
  );
}
