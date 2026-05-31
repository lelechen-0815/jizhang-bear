import { db } from '../db';
import { defaultExpenseCategories, defaultIncomeCategories } from './categories';
import { defaultAccounts } from './accounts';

export async function initializeData(): Promise<void> {
  // 初始化分类
  const catCount = await db.categories.count();
  if (catCount === 0) {
    await db.categories.bulkPut([...defaultExpenseCategories, ...defaultIncomeCategories]);
  }

  // 初始化账户
  const accCount = await db.accounts.count();
  if (accCount === 0) {
    await db.accounts.bulkPut(defaultAccounts);
  }
}
