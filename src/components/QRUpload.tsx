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

  const handleRemove = () => {
    onUpload(null);
  };

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-4 gap-3">
        <h2 className="card-title text-base">QR Code Image</h2>
        {qrImage ? (
          <div className="flex flex-col items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrImage}
              alt="Uploaded QR"
              className="w-40 h-40 object-contain rounded border border-base-300"
            />
            <div className="flex gap-2 w-full">
              <button
                className="btn btn-outline btn-sm flex-1"
                onClick={() => fileInputRef.current?.click()}
              >
                Replace
              </button>
              <button
                className="btn btn-ghost btn-sm text-error flex-1"
                onClick={handleRemove}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-base-300 rounded-lg py-6 cursor-pointer hover:bg-base-200 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-base-content/40 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <span className="text-sm text-base-content/50">
              Tap to upload QR image
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
    </div>
  );
}
