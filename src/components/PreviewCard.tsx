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
      width: 200,
      margin: 2,
      color: { dark: "#18181b", light: "#ffffff" },
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(null));
  }, [phone, total]);

  if (!dataUrl) return null;

  return (
    <div className="flex justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUrl} alt="QR" style={{ width: 120, height: 120, borderRadius: 8 }} />
    </div>
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

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 16,
        padding: 32,
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#18181b",
        width: "100%",
        maxWidth: 380,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#18181b",
            lineHeight: 1.3,
          }}
        >
          {displayName}
        </div>
        {note.trim() && (
          <div
            style={{
              fontSize: 12,
              color: "#a1a1aa",
              marginTop: 6,
              lineHeight: 1.5,
            }}
          >
            {note.trim()}
          </div>
        )}
        <div style={{ fontSize: 10, color: "#d4d4d8", marginTop: 6 }}>
          {new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>

      {items.length > 0 && (
        <div
          style={{
            borderTop: "1px solid #f4f4f5",
            paddingTop: 12,
            marginBottom: 12,
          }}
        >
          {items.map((item) => {
            const cat = getCategoryDisplay(item.category, categories);
            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "5px 0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    minWidth: 0,
                  }}
                >
                  <span style={{ fontSize: 12 }}>{cat.icon}</span>
                  <span
                    style={{
                      fontSize: 13,
                      color: "#52525b",
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
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#18181b",
                    flexShrink: 0,
                    marginLeft: 12,
                  }}
                >
                  ฿{fmt(item.amount)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {categoryEntries.length > 1 && (
        <div
          style={{
            borderTop: "1px solid #f4f4f5",
            paddingTop: 10,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: "#a1a1aa",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 6,
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
                  padding: "3px 0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11 }}>{cat.icon}</span>
                  <span style={{ fontSize: 12, color: "#71717a" }}>
                    {cat.name}
                  </span>
                </div>
                <span style={{ fontSize: 12, color: "#52525b", fontWeight: 500 }}>
                  ฿{fmt(catTotal)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div
        style={{
          borderTop: "2px solid #e4e4e7",
          paddingTop: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: "#18181b" }}>
            Total
          </span>
          <span style={{ fontSize: 22, fontWeight: 700, color: "#18181b" }}>
            ฿{fmt(total)}
          </span>
        </div>
      </div>

      {(qrSource || hasValidQR) && (
        <div style={{ marginTop: 16, textAlign: "center" }}>
          {qrSource ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrSource}
              alt="QR"
              style={{
                width: 120,
                height: 120,
                objectFit: "contain",
                borderRadius: 8,
                display: "inline-block",
              }}
            />
          ) : (
            <PromptPayQr phone={cleaned} total={total} />
          )}
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
