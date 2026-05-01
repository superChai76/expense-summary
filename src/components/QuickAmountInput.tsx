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
      <div className="text-center py-1">
        <div className="text-2xl font-bold text-neutral-900 tabular-nums tracking-tight">
          ฿ {fmt(amount)}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {[
          { val: 50, label: "+50" },
          { val: 100, label: "+100" },
          { val: 500, label: "+500" },
          { val: 1000, label: "+1k" },
        ].map((btn) => (
          <button
            key={btn.val}
            type="button"
            onClick={() => adjust(btn.val)}
            className="rounded-xl bg-neutral-900 text-white text-xs font-medium py-2.5 active:scale-95 transition-transform duration-75"
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-1">
        {[-100, -50, -10, -5, -1, 1, 5, 10, 50, 100].map((delta) => (
          <button
            key={delta}
            type="button"
            onClick={() => adjust(delta)}
            className={`rounded-xl border text-xs font-medium py-2 active:scale-95 transition-transform duration-75 ${
              delta > 0
                ? "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                : "border-neutral-200 bg-neutral-50 text-neutral-400 hover:bg-neutral-100"
            }`}
          >
            {delta > 0 ? `+${delta}` : `${delta}`}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 rounded-xl border border-neutral-200 bg-white text-xs font-medium py-2 text-neutral-500 hover:bg-neutral-50 transition-colors"
          onClick={clear}
        >
          Clear
        </button>
        <button
          type="button"
          className="flex-1 rounded-xl border border-neutral-200 bg-white text-xs font-medium py-2 text-neutral-500 hover:bg-neutral-50 transition-colors disabled:opacity-40"
          onClick={undo}
          disabled={history.length === 0}
        >
          Undo
        </button>
      </div>
    </div>
  );
}
