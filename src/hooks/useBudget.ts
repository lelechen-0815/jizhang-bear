import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export function useBudget(month: string) {
  const budget = useLiveQuery(() => db.budgets.where('month').equals(month).first(), [month]);
  return budget ?? null;
}

export async function setBudget(month: string, totalBudget: number, categoryBudgets: Record<string, number> = {}): Promise<void> {
  const existing = await db.budgets.where('month').equals(month).first();
  if (existing?.id) {
    await db.budgets.update(existing.id, { totalBudget, categoryBudgets });
  } else {
    await db.budgets.add({ month, totalBudget, categoryBudgets });
  }
}

export function useMonthExpenseTotal(month: string): number {
  const bills = useLiveQuery(() => {
    const [y, m] = month.split('-');
    return db.bills.where('date').startsWith(`${y}-${m}`).toArray();
  }, [month]);

  if (!bills) return 0;
  return bills
    .filter((b) => b.type === 'expense')
    .reduce((sum, b) => sum + b.amount, 0);
}

export function useMonthIncomeTotal(month: string): number {
  const bills = useLiveQuery(() => {
    const [y, m] = month.split('-');
    return db.bills.where('date').startsWith(`${y}-${m}`).toArray();
  }, [month]);

  if (!bills) return 0;
  return bills
    .filter((b) => b.type === 'income')
    .reduce((sum, b) => sum + b.amount, 0);
}

export function useMonthCategoryExpenses(month: string): Map<string, number> {
  const bills = useLiveQuery(() => {
    const [y, m] = month.split('-');
    return db.bills.where('date').startsWith(`${y}-${m}`).toArray();
  }, [month]);

  if (!bills) return new Map();
  const map = new Map<string, number>();
  bills
    .filter((b) => b.type === 'expense')
    .forEach((b) => {
      map.set(b.category, (map.get(b.category) ?? 0) + b.amount);
    });
  return map;
}
