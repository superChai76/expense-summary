"use client";

interface BillInfoFormProps {
  billName: string;
  note: string;
  onBillNameChange: (name: string) => void;
  onNoteChange: (note: string) => void;
}

export default function BillInfoForm({
  billName,
  note,
  onBillNameChange,
  onNoteChange,
}: BillInfoFormProps) {
  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Bill name (e.g. Dinner with friends)"
        className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none transition-colors"
        value={billName}
        onChange={(e) => onBillNameChange(e.target.value)}
      />
      <textarea
        placeholder="Note (optional)"
        className="w-full rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-2.5 text-sm placeholder:text-neutral-300 focus:border-neutral-300 focus:outline-none transition-colors resize-none"
        rows={1}
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
      />
    </div>
  );
}
