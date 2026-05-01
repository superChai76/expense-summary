"use client";

import { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import {
  ExpenseItem,
  CategoryDef,
  getCategoryDisplay,
  getCategoryBgColor,
  getCategoryTextColor,
} from "@/lib/types";
import { generatePromptPayPayload } from "@/lib/promptpay";
import QRCode from "qrcode";

interface ExportCardProps {
  items: ExpenseItem[];
  total: number;
  billName: string;
  note: string;
  phoneNumber: string;
  uploadedQrImage: string | null;
  categories: CategoryDef[];
  onClose: () => void;
}

function PromptPayQr({ phone, total }: { phone: string; total: number }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const payload = generatePromptPayPayload(phone, total);
    QRCode.toDataURL(payload, {
      width: 160,
      margin: 1,
      color: { dark: "#1e293b", light: "#ffffff" },
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(null));
  }, [phone, total]);

  if (!dataUrl) return null;

  return (
    <div className="flex justify-center pt-1">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUrl} alt="PromptPay QR" className="w-28 h-28 rounded" />
    </div>
  );
}

export default function ExportCard({
  items,
  total,
  billName,
  note,
  phoneNumber,
  uploadedQrImage,
  categories,
  onClose,
}: ExportCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const grouped = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});
  const categoryEntries = Object.entries(grouped).sort(
    (a, b) => b[1] - a[1]
  );

  const cleaned = phoneNumber.replace(/[^0-9]/g, "");
  const hasValidQR =
    phoneNumber !== "" && total > 0 && cleaned.length >= 10;

  const qrSource = uploadedQrImage || null;

  const handleExport = async () => {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `payment-summary-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  const fmt = (n: number) =>
    n.toLocaleString("th-TH", { minimumFractionDigits: 2 });

  const displayName = billName.trim() || "Payment Summary";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <button className="btn btn-circle btn-ghost btn-sm" onClick={onClose}>
          ✕
        </button>
      </div>

      <div
        ref={cardRef}
        className="bg-white text-slate-800 rounded-2xl p-6 shadow-lg"
        style={{
          width: "100%",
          maxWidth: 400,
          margin: "0 auto",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div className="text-center mb-1">
          <h1 className="text-lg font-bold text-slate-900 leading-tight">
            {displayName}
          </h1>
          {note.trim() && (
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {note.trim()}
            </p>
          )}
          <div className="text-[10px] text-slate-300 mt-1.5">
            {new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3 mb-3">
          {items.map((item) => {
            const cat = getCategoryDisplay(item.category, categories);
            return (
              <div
                key={item.id}
                className="flex items-center justify-between py-1.5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor:
                        getCategoryBgColor(item.category),
                      color: getCategoryTextColor(item.category),
                    }}
                  >
                    {cat.icon} {cat.name}
                  </span>
                  <span className="text-sm text-slate-700">{item.title}</span>
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  ฿{fmt(item.amount)}
                </span>
              </div>
            );
          })}
        </div>

        {categoryEntries.length > 0 && (
          <div className="border-t border-slate-100 pt-3 mb-3">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Category
            </div>
            {categoryEntries.map(([catName, catTotal]) => {
              const cat = getCategoryDisplay(catName, categories);
              return (
                <div
                  key={catName}
                  className="flex items-center justify-between py-1"
                >
                  <span
                    className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: getCategoryBgColor(catName),
                      color: getCategoryTextColor(catName),
                    }}
                  >
                    {cat.icon} {cat.name}
                  </span>
                  <span className="text-sm font-medium text-slate-600">
                    ฿{fmt(catTotal)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="border-t-2 border-slate-200 pt-3 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-slate-900">Total</span>
            <span className="text-xl font-bold text-slate-900">
              ฿{fmt(total)}
            </span>
          </div>
        </div>

        {qrSource && (
          <div className="flex justify-center pt-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrSource}
              alt="QR Code"
              className="w-28 h-28 object-contain rounded"
            />
          </div>
        )}
        {!qrSource && hasValidQR && (
          <PromptPayQr phone={cleaned} total={total} />
        )}
      </div>

      <button
        onClick={handleExport}
        disabled={exporting}
        className="btn btn-primary w-full"
      >
        {exporting ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          "Export as Image"
        )}
      </button>
    </div>
  );
}
