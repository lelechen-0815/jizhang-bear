import type { Currency } from '../db';

export const defaultCurrencies: Currency[] = [
  { key: 'CNY', name: '人民币', symbol: '¥', flag: '🇨🇳', isDefault: true },
  { key: 'HKD', name: '港币', symbol: 'HK$', flag: '🇭🇰', isDefault: true },
  { key: 'USD', name: '美元', symbol: '$', flag: '🇺🇸', isDefault: true },
];
