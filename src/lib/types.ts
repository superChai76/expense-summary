export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: string;
}

export interface CategoryDef {
  name: string;
  icon: string;
}

export const ICON_OPTIONS = [
  "🍜", "☕", "🍔", "🍕", "🍰",
  "🛍️", "🎮", "✈️", "🚗", "🏠",
  "🎉", "💼", "💸", "❤️", "📱",
  "🎬", "🎵", "💊", "📚", "🎁",
  "🐾", "⚽", "🏋️", "💇", "🧹",
];

export const DEFAULT_CATEGORIES: CategoryDef[] = [
  { name: "Food", icon: "🍜" },
  { name: "Transport", icon: "🚗" },
  { name: "Shopping", icon: "🛍️" },
  { name: "Entertainment", icon: "🎮" },
  { name: "Bills", icon: "🏠" },
  { name: "Other", icon: "💸" },
];

export const CATEGORY_COLORS: Record<string, string> = {
  Food: "badge-primary",
  Transport: "badge-secondary",
  Shopping: "badge-accent",
  Entertainment: "badge-info",
  Bills: "badge-warning",
  Other: "badge-ghost",
};

export const CATEGORY_BG_COLORS: Record<string, string> = {
  Food: "#fef3c7",
  Transport: "#ede9fe",
  Shopping: "#fce7f3",
  Entertainment: "#dbeafe",
  Bills: "#d1fae5",
  Other: "#f1f5f9",
};

export const CATEGORY_TEXT_COLORS: Record<string, string> = {
  Food: "#92400e",
  Transport: "#5b21b6",
  Shopping: "#9d174d",
  Entertainment: "#1e40af",
  Bills: "#065f46",
  Other: "#475569",
};

export function getCategoryDisplay(
  categoryName: string,
  allCategories: CategoryDef[]
): CategoryDef {
  return (
    allCategories.find((c) => c.name === categoryName) || {
      name: categoryName,
      icon: "📌",
    }
  );
}

export function getCategoryBadgeClass(categoryName: string): string {
  return CATEGORY_COLORS[categoryName] || "badge-ghost";
}

export function getCategoryBgColor(categoryName: string): string {
  return CATEGORY_BG_COLORS[categoryName] || "#f1f5f9";
}

export function getCategoryTextColor(categoryName: string): string {
  return CATEGORY_TEXT_COLORS[categoryName] || "#475569";
}
