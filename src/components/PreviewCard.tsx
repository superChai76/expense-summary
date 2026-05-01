"use client";

import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { toPng } from "html-to-image";
import {
  ExpenseItem,
  CategoryDef,
  getCategoryDisplay,
} from "@/lib/types";
import { generatePromptPayPayload } from "@/lib/promptpay";
import QRCode from "qrcode";

interface PreviewCardProps {
  items: ExpenseItem[];
  total: number;
  billName: string;
  note: string;
  phoneNumber: string;
  uploadedQrImage: string | null;
  categories: CategoryDef[];
}

export interface PreviewCardHandle {
  exportImage: () => Promise<void>;
}

function PromptPayQr({ phone, total }: { phone: string; total: number }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const payload = generatePromptPayPayload(phone, total);
    QRCode.toDataURL(payload, {
      width: 280,
      margin: 2,
      color: { dark: "#18181b", light: "#ffffff" },
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(null));
  }, [phone, total]);

  if (!dataUrl) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={dataUrl} alt="QR" style={{ width: 160, height: 160 }} />
  );
}

const CardContent = ({
  items,
  total,
  billName,
  note,
  phoneNumber,
  uploadedQrImage,
  categories,
}: PreviewCardProps) => {
  const cleaned = phoneNumber.replace(/[^0-9]/g, "");
  const hasValidQR =
    phoneNumber !== "" && total > 0 && cleaned.length >= 10;

  const qrSource = uploadedQrImage || null;
  const displayName = billName.trim() || "Payment Summary";

  const fmt = (n: number) =>
    n.toLocaleString("th-TH", { minimumFractionDigits: 2 });

  const hasQrSection = qrSource || hasValidQR;

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 20,
        padding: "44px 40px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#18181b",
        width: "100%",
        minWidth: 375,
        maxWidth: 480,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#09090b",
            lineHeight: 1.3,
            letterSpacing: -0.01,
          }}
        >
          {displayName}
        </div>
        {note.trim() && (
          <div
            style={{
              fontSize: 13,
              color: "#a1a1aa",
              marginTop: 12,
              lineHeight: 1.6,
            }}
          >
            {note.trim()}
          </div>
        )}
        <div
          style={{
            fontSize: 11,
            color: "#d4d4d8",
            marginTop: 12,
          }}
        >
          {new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Items - flat list */}
      {items.length > 0 && (
        <div>
          {items.map((item) => {
            const cat = getCategoryDisplay(item.category, categories);
            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    minWidth: 0,
                  }}
                >
                  <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>
                    {cat.icon}
                  </span>
                  <span
                    style={{
                      fontSize: 15,
                      color: "#3f3f46",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.title}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#18181b",
                    flexShrink: 0,
                    marginLeft: 20,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  ฿{fmt(item.amount)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Total */}
      <div
        style={{
          marginTop: 24,
          padding: "24px",
          background: "#fafafa",
          borderRadius: 16,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#a1a1aa",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 10,
          }}
        >
          Total
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#09090b",
            letterSpacing: -0.02,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1.1,
          }}
        >
          ฿{fmt(total)}
        </div>
      </div>

      {/* QR Section */}
      {hasQrSection && (
        <div
          style={{
            marginTop: 32,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#71717a",
              marginBottom: 4,
            }}
          >
            QR Code สำหรับชำระเงิน
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#d4d4d8",
              marginBottom: 20,
            }}
          >
            สแกนเพื่อโอนเงิน
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              border: "1px solid #f0f0f0",
              borderRadius: 16,
              background: "#fafafa",
            }}
          >
            {qrSource ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrSource}
                alt="QR"
                style={{
                  width: 160,
                  height: 160,
                  objectFit: "contain",
                }}
              />
            ) : (
              <PromptPayQr phone={cleaned} total={total} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const PreviewCard = forwardRef<PreviewCardHandle, PreviewCardProps>(
  function PreviewCard(props, ref) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [exporting, setExporting] = useState(false);

    useImperativeHandle(ref, () => ({
      async exportImage() {
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
      },
    }));

    return (
      <div className="flex flex-col items-center">
        <div ref={cardRef}>
          <CardContent {...props} />
        </div>
        {exporting && (
          <div className="mt-3 text-xs text-neutral-400">Exporting...</div>
        )}
      </div>
    );
  }
);

export default PreviewCard;
export { CardContent };
