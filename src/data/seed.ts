import { db } from '../db';
import { defaultExpenseCategories, defaultIncomeCategories } from './categories';
import { defaultAccounts } from './accounts';
import { defaultCurrencies } from './currencies';

export async function initializeData(): Promise<void> {
  const catCount = await db.categories.count();
  if (catCount === 0) {
    await db.categories.bulkPut([...defaultExpenseCategories, ...defaultIncomeCategories]);
  }

  const accCount = await db.accounts.count();
  if (accCount === 0) {
    await db.accounts.bulkPut(defaultAccounts);
  }

  const curCount = await db.currencies.count();
  if (curCount === 0) {
    await db.currencies.bulkPut(defaultCurrencies);
  }
}
