"use client";

import { useState } from "react";
import { ExpenseItem, CategoryDef, DEFAULT_CATEGORIES } from "@/lib/types";
import BillInfoForm from "@/components/BillInfoForm";
import AddItemForm from "@/components/AddItemForm";
import ExpenseList from "@/components/ExpenseList";
import CategorySummary from "@/components/CategorySummary";
import TotalDisplay from "@/components/TotalDisplay";
import QRGenerator from "@/components/QRGenerator";
import QRUpload from "@/components/QRUpload";
import ExportCard from "@/components/ExportCard";

export default function Home() {
  const [billName, setBillName] = useState("");
  const [note, setNote] = useState("");
  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [categories, setCategories] = useState<CategoryDef[]>(DEFAULT_CATEGORIES);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [qrUploadImage, setQrUploadImage] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  const handleAdd = (title: string, amount: number, category: string) => {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, amount, category },
    ]);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddCategory = (cat: CategoryDef) => {
    setCategories((prev) => [...prev, cat]);
  };

  const canExport = items.length > 0;

  return (
    <div className="min-h-screen bg-base-200 pb-24">
      <div className="sticky top-0 z-10 bg-primary text-primary-content py-3 px-4 shadow-md">
        <h1 className="text-lg font-bold text-center">Summary</h1>
      </div>

      <div className="max-w-md mx-auto px-4 flex flex-col gap-4 mt-4">
        <BillInfoForm
          billName={billName}
          note={note}
          onBillNameChange={setBillName}
          onNoteChange={setNote}
        />

        <AddItemForm
          categories={categories}
          onAdd={handleAdd}
          onAddCategory={handleAddCategory}
        />

        <ExpenseList
          items={items}
          categories={categories}
          onDelete={handleDelete}
        />

        {items.length > 0 && (
          <>
            <TotalDisplay total={total} />
            <CategorySummary items={items} categories={categories} />
            <QRUpload
              qrImage={qrUploadImage}
              onUpload={setQrUploadImage}
            />
            <QRGenerator
              total={total}
              onPhoneNumberChange={setPhoneNumber}
            />
          </>
        )}
      </div>

      {canExport && (
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-base-100 border-t border-base-300 px-4 py-3">
          <div className="max-w-md mx-auto">
            <button
              className="btn btn-primary w-full"
              onClick={() => setShowExport(true)}
            >
              Preview & Export
            </button>
          </div>
        </div>
      )}

      {showExport && (
        <div className="fixed inset-0 z-30 bg-black/50 flex items-start justify-center overflow-y-auto py-8">
          <div className="w-full max-w-md mx-4">
            <ExportCard
              items={items}
              total={total}
              billName={billName}
              note={note}
              phoneNumber={phoneNumber}
              uploadedQrImage={qrUploadImage}
              categories={categories}
              onClose={() => setShowExport(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
