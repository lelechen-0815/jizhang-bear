import Dexie, { type Table } from 'dexie';

export interface Bill {
  id?: number;
  type: 'expense' | 'income';
  amount: number; // 单位：分
  category: string;
  account: string;
  date: string; // YYYY-MM-DD
  note: string;
  recordedBy: 'me' | 'boyfriend';
  createdAt: number;
}

export interface Category {
  key: string;
  name: string;
  emoji: string;
  type: 'expense' | 'income';
  isDefault: boolean;
}

export interface Account {
  key: string;
  name: string;
  icon: string;
  initialBalance: number; // 单位：分
}

export interface Budget {
  id?: number;
  month: string; // YYYY-MM
  totalBudget: number; // 总预算，单位：分
  categoryBudgets: Record<string, number>; // 分类预算，key=category key, value=分
}

export class BearBookDB extends Dexie {
  bills!: Table<Bill, number>;
  categories!: Table<Category, string>;
  accounts!: Table<Account, string>;
  budgets!: Table<Budget, number>;

  constructor() {
    super('BearBook');
    this.version(1).stores({
      bills: '++id, type, category, account, date, recordedBy',
      categories: '&key, type',
      accounts: '&key',
      budgets: '++id, month',
    });
  }
}

export const db = new BearBookDB();
