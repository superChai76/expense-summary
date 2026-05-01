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
      width: 240,
      margin: 2,
      color: { dark: "#18181b", light: "#ffffff" },
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(null));
  }, [phone, total]);

  if (!dataUrl) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={dataUrl} alt="QR" style={{ width: 140, height: 140 }} />
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
  const displayName = billName.trim() || "Payment Summary";

  const fmt = (n: number) =>
    n.toLocaleString("th-TH", { minimumFractionDigits: 2 });

  const hasQrSection = qrSource || hasValidQR;

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 20,
        padding: "40px 36px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#18181b",
        width: "100%",
        minWidth: 375,
        maxWidth: 440,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div
          style={{
            fontSize: 20,
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
              marginTop: 10,
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
            marginTop: 10,
          }}
        >
          {new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Items */}
      {items.length > 0 && (
        <div style={{ marginBottom: 4 }}>
          {items.map((item) => {
            const cat = getCategoryDisplay(item.category, categories);
            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    minWidth: 0,
                  }}
                >
                  <span style={{ fontSize: 14, width: 20, textAlign: "center" }}>
                    {cat.icon}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
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
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#18181b",
                    flexShrink: 0,
                    marginLeft: 16,
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

      {/* Category Summary */}
      {categoryEntries.length > 1 && (
        <div style={{ paddingTop: 8, paddingBottom: 4 }}>
          <div
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: "#a1a1aa",
              textTransform: "uppercase",
              letterSpacing: 1.2,
              marginBottom: 8,
            }}
          >
            By Category
          </div>
          {categoryEntries.map(([catName, catTotal]) => {
            const cat = getCategoryDisplay(catName, categories);
            return (
              <div
                key={catName}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "4px 0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12 }}>{cat.icon}</span>
                  <span style={{ fontSize: 13, color: "#71717a" }}>
                    {cat.name}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 13,
                    color: "#52525b",
                    fontWeight: 500,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  ฿{fmt(catTotal)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Total */}
      <div
        style={{
          marginTop: 20,
          padding: "20px 24px",
          background: "#fafafa",
          borderRadius: 14,
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
            marginBottom: 8,
          }}
        >
          Total
        </div>
        <div
          style={{
            fontSize: 32,
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
            marginTop: 28,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#71717a",
              marginBottom: 4,
            }}
          >
            QR Code สำหรับชำระเงิน
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#d4d4d8",
              marginBottom: 16,
            }}
          >
            สแกนเพื่อโอนเงิน
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              border: "1px solid #f0f0f0",
              borderRadius: 14,
              background: "#fafafa",
            }}
          >
            {qrSource ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrSource}
                alt="QR"
                style={{
                  width: 140,
                  height: 140,
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
