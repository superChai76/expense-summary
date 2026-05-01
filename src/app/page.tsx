"use client";

import { useState, useRef } from "react";
import { ExpenseItem, CategoryDef, DEFAULT_CATEGORIES } from "@/lib/types";
import BillInfoForm from "@/components/BillInfoForm";
import AddItemForm from "@/components/AddItemForm";
import ExpenseList from "@/components/ExpenseList";
import TotalDisplay from "@/components/TotalDisplay";
import QRGenerator from "@/components/QRGenerator";
import QRUpload from "@/components/QRUpload";
import PreviewCard, { PreviewCardHandle } from "@/components/PreviewCard";

export default function Home() {
  const [billName, setBillName] = useState("");
  const [note, setNote] = useState("");
  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [categories, setCategories] = useState<CategoryDef[]>(DEFAULT_CATEGORIES);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [qrUploadImage, setQrUploadImage] = useState<string | null>(null);
  const [mobilePreview, setMobilePreview] = useState(false);

  const previewRef = useRef<PreviewCardHandle>(null);

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

  const handleUpdate = (id: string, title: string, amount: number, category: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, title, amount, category } : item
      )
    );
  };

  const handleAddCategory = (cat: CategoryDef) => {
    setCategories((prev) => [...prev, cat]);
  };

  const previewProps = {
    items,
    total,
    billName,
    note,
    phoneNumber,
    uploadedQrImage: qrUploadImage,
    categories,
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 h-14 flex items-center justify-between">
          <h1 className="text-sm font-bold text-neutral-900 tracking-tight">
            Summary
          </h1>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={() => previewRef.current?.exportImage()}
                className="hidden lg:inline-flex rounded-xl bg-neutral-900 text-white text-xs font-medium px-4 py-2 hover:bg-neutral-800 active:scale-[0.98] transition-all"
              >
                Export Image
              </button>
            )}
            {items.length > 0 && (
              <button
                onClick={() => setMobilePreview(true)}
                className="lg:hidden rounded-xl bg-neutral-900 text-white text-xs font-medium px-4 py-2"
              >
                Preview
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
        <div className="lg:flex lg:gap-8">
          <div className="lg:w-[58%] lg:min-w-0">
            <div className="max-w-lg mx-auto lg:mx-0 flex flex-col gap-6">
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
                onUpdate={handleUpdate}
              />

              {items.length > 0 && (
                <div className="flex flex-col gap-5">
                  <TotalDisplay total={total} />
                  <div className="border-t border-neutral-100" />
                  <QRUpload
                    qrImage={qrUploadImage}
                    onUpload={setQrUploadImage}
                  />
                  <QRGenerator
                    total={total}
                    onPhoneNumberChange={setPhoneNumber}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block lg:w-[42%]">
            <div className="sticky top-20">
              <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                Live Preview
              </div>
              <PreviewCard ref={previewRef} {...previewProps} />
            </div>
          </div>
        </div>
      </div>

      {mobilePreview && (
        <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden">
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-neutral-100">
              <span className="text-xs font-semibold text-neutral-800">
                Preview
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => previewRef.current?.exportImage()}
                  className="rounded-xl bg-neutral-900 text-white text-xs font-medium px-3 py-1.5"
                >
                  Export
                </button>
                <button
                  onClick={() => setMobilePreview(false)}
                  className="text-neutral-400 text-sm px-2"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-4">
              <PreviewCard ref={previewRef} {...previewProps} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
