import type { Category } from '../db';

export const defaultExpenseCategories: Category[] = [
  { key: 'food', name: '餐饮', emoji: '🍔', type: 'expense', isDefault: true },
  { key: 'shopping', name: '购物', emoji: '🛒', type: 'expense', isDefault: true },
  { key: 'transport', name: '交通', emoji: '🚌', type: 'expense', isDefault: true },
  { key: 'entertainment', name: '娱乐', emoji: '🎮', type: 'expense', isDefault: true },
  { key: 'housing', name: '居住', emoji: '🏠', type: 'expense', isDefault: true },
  { key: 'medical', name: '医疗', emoji: '💊', type: 'expense', isDefault: true },
  { key: 'education', name: '教育', emoji: '📚', type: 'expense', isDefault: true },
  { key: 'gift', name: '人情', emoji: '🎁', type: 'expense', isDefault: true },
  { key: 'phone', name: '通讯', emoji: '📱', type: 'expense', isDefault: true },
  { key: 'other_expense', name: '其他', emoji: '📦', type: 'expense', isDefault: true },
];

export const defaultIncomeCategories: Category[] = [
  { key: 'salary', name: '工资', emoji: '💰', type: 'income', isDefault: true },
  { key: 'bonus', name: '奖金', emoji: '🧧', type: 'income', isDefault: true },
  { key: 'parttime', name: '兼职', emoji: '💼', type: 'income', isDefault: true },
  { key: 'investment', name: '理财', emoji: '📈', type: 'income', isDefault: true },
  { key: 'refund', name: '退款', emoji: '↩️', type: 'income', isDefault: true },
  { key: 'other_income', name: '其他', emoji: '📦', type: 'income', isDefault: true },
];
