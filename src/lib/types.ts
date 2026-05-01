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
  "🏠", "🍜", "☕", "🚗", "🛍️",
  "🎉", "💡", "💊", "🎓", "🧾",
  "✈️", "🎮", "💼", "💸", "❤️",
  "📱", "🎬", "🎵", "📚", "🎁",
  "🐾", "⚽", "🏋️", "💇", "🧹",
];

export const DEFAULT_CATEGORIES: CategoryDef[] = [
  { name: "ที่พัก / ค่าเช่า", icon: "🏠" },
  { name: "อาหาร / เครื่องดื่ม", icon: "🍜" },
  { name: "เดินทาง", icon: "🚗" },
  { name: "ช้อปปิ้ง", icon: "🛍️" },
  { name: "สังสรรค์", icon: "🎉" },
  { name: "ค่าสาธารณูปโภค", icon: "💡" },
  { name: "สุขภาพ", icon: "💊" },
  { name: "การศึกษา", icon: "🎓" },
  { name: "อื่นๆ", icon: "🧾" },
];

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
