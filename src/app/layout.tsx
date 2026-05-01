import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Expense Summary",
  description: "Summarize shared expenses and generate payment summary images",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">
        {children}
      </body>
    </html>
  );
}
