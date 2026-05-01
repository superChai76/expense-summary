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
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <ArrowBtn label="‹‹‹" onPress={() => adjust(-100)} />
          <ArrowBtn label="‹‹" onPress={() => adjust(-10)} />
          <ArrowBtn label="‹" onPress={() => adjust(-1)} />
        </div>

        <div className="min-w-[100px] text-center select-none px-2">
          <span className="text-2xl font-bold text-neutral-900 tabular-nums tracking-tight">
            ฿{fmt(amount)}
          </span>
        </div>

        <div className="flex items-center">
          <ArrowBtn label="›" onPress={() => adjust(1)} />
          <ArrowBtn label="››" onPress={() => adjust(10)} />
          <ArrowBtn label="›››" onPress={() => adjust(100)} />
        </div>
      </div>

      <div className="flex items-center gap-2 justify-center">
        {[100, 500, 1000].map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => adjust(val)}
            className="rounded-full bg-neutral-900 text-white px-4 py-1.5 text-xs font-medium hover:bg-neutral-800 active:scale-95 transition-all duration-75 select-none"
          >
            +{val.toLocaleString()}
          </button>
        ))}
        <button
          type="button"
          onClick={clear}
          className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-400 hover:bg-neutral-50 active:scale-95 transition-all duration-75 select-none"
        >
          C
        </button>
        <button
          type="button"
          onClick={undo}
          disabled={history.length === 0}
          className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-400 hover:bg-neutral-50 active:scale-95 transition-all duration-75 disabled:opacity-30 select-none"
        >
          ↩
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
      className="w-9 h-9 flex items-center justify-center rounded-lg text-neutral-300 hover:bg-neutral-100 hover:text-neutral-500 active:scale-90 transition-all duration-75 text-sm font-light tracking-tight select-none"
    >
      {label}
    </button>
  );
}
