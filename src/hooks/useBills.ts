import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Bill } from '../db';

export function useBills(month?: string) {
  const bills = useLiveQuery(
    () => {
      if (!month) return db.bills.orderBy('date').reverse().toArray();
      const [y, m] = month.split('-');
      const prefix = `${y}-${m}`;
      return db.bills
        .where('date')
        .startsWith(prefix)
        .reverse()
        .sortBy('date');
    },
    [month]
  );

  return bills ?? [];
}

export function useRecentBills(limit = 5) {
  const bills = useLiveQuery(
    () => db.bills.orderBy('date').reverse().limit(limit).toArray()
  );
  return bills ?? [];
}

export function useMonthBills(month: string) {
  const bills = useLiveQuery(() => {
    const [y, m] = month.split('-');
    const prefix = `${y}-${m}`;
    return db.bills.where('date').startsWith(prefix).reverse().sortBy('date');
  }, [month]);
  return bills ?? [];
}

export async function addBill(bill: Omit<Bill, 'id' | 'createdAt'>): Promise<number> {
  return db.bills.add({
    ...bill,
    createdAt: Date.now(),
  });
}

export async function updateBill(id: number, bill: Partial<Bill>): Promise<number> {
  return db.bills.update(id, bill);
}

export async function deleteBill(id: number): Promise<void> {
  return db.bills.delete(id);
}

export async function getBill(id: number): Promise<Bill | undefined> {
  return db.bills.get(id);
}

/** 获取连续记账天数 */
export async function getStreak(): Promise<number> {
  const allDates = await db.bills.orderBy('date').reverse().uniqueKeys();
  const dateSet = new Set(allDates as string[]);

  let streak = 0;
  const d = new Date();
  d.setDate(d.getDate() - 1); // 从昨天开始

  while (true) {
    const s = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (dateSet.has(s)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }

  // 检查今天有没有记账
  const today = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
  if (dateSet.has(today)) streak++;

  return streak;
}
