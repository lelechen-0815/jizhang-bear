import type { Account } from '../db';

export const defaultAccounts: Account[] = [
  { key: 'cash', name: '现金', icon: '💵', initialBalance: 0 },
  { key: 'bank', name: '银行卡', icon: '🏦', initialBalance: 0 },
  { key: 'alipay', name: '支付宝', icon: '🔵', initialBalance: 0 },
  { key: 'wechat', name: '微信', icon: '🟢', initialBalance: 0 },
];
