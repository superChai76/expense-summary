"use client";

import { useRef } from "react";

interface QRUploadProps {
  qrImage: string | null;
  onUpload: (dataUrl: string | null) => void;
}

export default function QRUpload({ qrImage, onUpload }: QRUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") {
        onUpload(result);
      }
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
        QR Code
      </div>
      {qrImage ? (
        <div className="flex flex-col items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrImage}
            alt="Uploaded QR"
            className="w-28 h-28 object-contain rounded-xl border border-neutral-100"
          />
          <div className="flex gap-2 w-full">
            <button
              className="flex-1 rounded-xl border border-neutral-200 bg-white text-xs font-medium py-2 text-neutral-600 hover:bg-neutral-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              Replace
            </button>
            <button
              className="flex-1 rounded-xl border border-neutral-200 bg-white text-xs font-medium py-2 text-red-400 hover:bg-red-50 transition-colors"
              onClick={() => onUpload(null)}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-xl py-5 cursor-pointer hover:bg-neutral-50 transition-colors">
          <span className="text-neutral-300 text-lg mb-1">⬆</span>
          <span className="text-xs text-neutral-400">
            Upload QR image
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
}
