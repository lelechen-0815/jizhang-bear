import Dexie, { type Table } from 'dexie';

export interface Bill {
  id?: number;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  account: string;
  currency: string;
  date: string;
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
  initialBalance: number;
}

export interface Currency {
  key: string;
  name: string;
  symbol: string;
  flag: string;
  isDefault: boolean;
}

export interface Budget {
  id?: number;
  month: string;
  totalBudget: number;
  categoryBudgets: Record<string, number>;
}

export class BearBookDB extends Dexie {
  bills!: Table<Bill, number>;
  categories!: Table<Category, string>;
  accounts!: Table<Account, string>;
  currencies!: Table<Currency, string>;
  budgets!: Table<Budget, number>;

  constructor() {
    super('BearBook');
    this.version(1).stores({
      bills: '++id, type, category, account, date, recordedBy',
      categories: '&key, type',
      accounts: '&key',
      budgets: '++id, month',
    });
    this.version(2).stores({
      bills: '++id, type, category, account, currency, date, recordedBy',
      categories: '&key, type',
      accounts: '&key',
      currencies: '&key',
      budgets: '++id, month',
    });
  }
}

export const db = new BearBookDB();
