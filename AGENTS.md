# Expense Summary - Project Guide

## Commands
- `npm run dev` — Start local dev server (http://localhost:3000)
- `npm run build` — Production build
- `npm run lint` — ESLint check
- `vercel dev` — Local dev with Vercel runtime
- `vercel --yes` — Deploy to Vercel production

## Deployment
- Platform: Vercel (already linked)
- Production URL: https://expense-summary-phi.vercel.app
- Project: superchai76s-projects/expense-summary
- Vercel CLI is authenticated globally (`npm install -g vercel`)

## Tech Stack
- Next.js 16 (App Router)
- Tailwind CSS v4 + DaisyUI v5
- html-to-image (export card as PNG)
- qrcode (PromptPay QR generation)
- No backend — React state only

## Project Structure
- `src/app/page.tsx` — Main page, state management
- `src/components/` — All UI components
- `src/lib/types.ts` — Types & category constants
- `src/lib/promptpay.ts` — PromptPay EMVCo QR payload generator

## Components
- `BillInfoForm` — Bill name + optional note
- `AddItemForm` — Add expense (title, amount, category)
- `ExpenseList` — List with delete
- `CategorySummary` — Grouped totals by category
- `TotalDisplay` — Grand total
- `QRUpload` — Upload custom QR image (overrides generated)
- `QRGenerator` — PromptPay QR from phone number + amount
- `ExportCard` — Modal with export card layout + download as PNG

## Conventions
- All components are `"use client"`
- DaisyUI classes for UI components (btn, card, badge, input, select)
- Thai Baht (฿) currency format
- Color-coded category badges
- ESLint: no-img-element rule suppressed for dynamic QR data URLs
- Export opens as modal overlay with sticky bottom "Preview & Export" button
- QR priority: uploaded image > generated PromptPay QR
