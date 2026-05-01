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
      margin: 2,
      color: { dark: "#18181b", light: "#ffffff" },
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(null));
  }, [phone, total]);

  if (!dataUrl) {
    return (
      <div className="flex justify-center py-2">
        <span className="loading loading-spinner loading-sm text-neutral-300" />
      </div>
    );
  }

  return (
    <div className="flex justify-center py-1">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUrl} alt="PromptPay QR Code" className="w-28 h-28 rounded-xl" />
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
    <div className="flex flex-col gap-2">
      <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
        PromptPay
      </div>
      <input
        type="tel"
        placeholder="Phone number (e.g. 0812345678)"
        className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none transition-colors"
        value={phoneNumber}
        onChange={handleChange}
        maxLength={13}
      />
      {isValid && <QrImage phone={cleaned} total={total} />}
    </div>
  );
}
