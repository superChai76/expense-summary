"use client";

import { useState, useCallback } from "react";

interface QuickAmountInputProps {
  amount: number;
  onChange: (amount: number) => void;
}

interface HistoryEntry {
  amount: number;
  label: string;
}

export default function QuickAmountInput({
  amount,
  onChange,
}: QuickAmountInputProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const pushHistory = useCallback(
    (label: string) => {
      setHistory((prev) => [...prev.slice(-19), { amount, label }]);
    },
    [amount]
  );

  const adjust = (delta: number, label: string) => {
    pushHistory(label);
    const next = amount + delta;
    onChange(next < 0 ? 0 : next);
  };

  const clear = () => {
    pushHistory("clear");
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
      <div className="text-center py-2">
        <div className="text-3xl font-bold text-primary tabular-nums">
          ฿ {fmt(amount)}
        </div>
      </div>

      <div>
        <div className="text-[10px] text-base-content/40 uppercase tracking-wider mb-1.5">
          Quick Add
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { val: 50, label: "+50" },
            { val: 100, label: "+100" },
            { val: 500, label: "+500" },
            { val: 1000, label: "+1k" },
          ].map((btn) => (
            <TapButton
              key={btn.val}
              label={btn.label}
              onClick={() => adjust(btn.val, btn.label)}
              variant="primary"
            />
          ))}
        </div>
      </div>

      <div>
        <div className="text-[10px] text-base-content/40 uppercase tracking-wider mb-1.5">
          Adjust
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {[
            { delta: -100, label: "-100" },
            { delta: -50, label: "-50" },
            { delta: -10, label: "-10" },
            { delta: -5, label: "-5" },
            { delta: -1, label: "-1" },
            { delta: 1, label: "+1" },
            { delta: 5, label: "+5" },
            { delta: 10, label: "+10" },
            { delta: 50, label: "+50" },
            { delta: 100, label: "+100" },
          ].map((btn) => (
            <TapButton
              key={btn.delta}
              label={btn.label}
              onClick={() => adjust(btn.delta, btn.label)}
              variant={btn.delta > 0 ? "plus" : "minus"}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className="btn btn-outline btn-sm flex-1"
          onClick={clear}
        >
          Clear
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm flex-1"
          onClick={undo}
          disabled={history.length === 0}
        >
          Undo
        </button>
      </div>
    </div>
  );
}

function TapButton({
  label,
  onClick,
  variant,
}: {
  label: string;
  onClick: () => void;
  variant: "primary" | "plus" | "minus";
}) {
  const base =
    "btn btn-sm active:scale-95 transition-transform duration-75 font-medium";

  const styles: Record<string, string> = {
    primary: "btn-primary",
    plus: "btn-ghost bg-success/10 text-success border border-success/20",
    minus: "btn-ghost bg-error/10 text-error border border-error/20",
  };

  return (
    <button
      type="button"
      className={`${base} ${styles[variant]}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
