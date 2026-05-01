"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { generatePromptPayPayload } from "@/lib/promptpay";

interface QRGeneratorProps {
  total: number;
  onPhoneNumberChange: (phone: string) => void;
}

function QrImage({ phone, total }: { phone: string; total: number }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const payload = generatePromptPayPayload(phone, total);
    QRCode.toDataURL(payload, {
      width: 200,
      margin: 1,
      color: { dark: "#000000", light: "#ffffff" },
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(null));
  }, [phone, total]);

  if (!dataUrl) {
    return (
      <div className="flex justify-center py-2">
        <span className="loading loading-spinner loading-sm" />
      </div>
    );
  }

  return (
    <div className="flex justify-center py-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUrl} alt="PromptPay QR Code" className="w-40 h-40" />
    </div>
  );
}

export default function QRGenerator({
  total,
  onPhoneNumberChange,
}: QRGeneratorProps) {
  const [phoneNumber, setPhoneNumber] = useState("");

  const cleaned = phoneNumber.replace(/[^0-9]/g, "");
  const isValid = phoneNumber !== "" && total > 0 && cleaned.length >= 10;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhoneNumber(val);
    onPhoneNumberChange(val);
  };

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-4 gap-3">
        <h2 className="card-title text-base">PromptPay QR</h2>
        <input
          type="tel"
          placeholder="Phone number (e.g. 0812345678)"
          className="input input-bordered input-sm w-full"
          value={phoneNumber}
          onChange={handleChange}
          maxLength={13}
        />
        {isValid && <QrImage phone={cleaned} total={total} />}
      </div>
    </div>
  );
}
