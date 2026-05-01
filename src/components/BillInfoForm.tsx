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
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-4 gap-3">
        <h2 className="card-title text-base">Bill Info</h2>
        <input
          type="text"
          placeholder="Bill name (e.g. Dinner with friends)"
          className="input input-bordered input-sm w-full"
          value={billName}
          onChange={(e) => onBillNameChange(e.target.value)}
        />
        <textarea
          placeholder="Note (optional, e.g. หาร 3 คน)"
          className="textarea textarea-bordered textarea-sm w-full"
          rows={2}
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
        />
      </div>
    </div>
  );
}
