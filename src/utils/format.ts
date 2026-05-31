/** 金额：分 → 元，格式化显示 */
export function formatAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}

/** 金额显示，带符号 */
export function formatMoney(cents: number, type?: 'expense' | 'income'): string {
  const yuan = formatAmount(cents);
  if (!type) return `¥${yuan}`;
  return type === 'expense' ? `-¥${yuan}` : `+¥${yuan}`;
}

/** 获取当月字符串 YYYY-MM */
export function getCurrentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** 获取今天字符串 YYYY-MM-DD */
export function getToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** 日期分组标签 */
export function getDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dStr = dateStr;
  const tStr = formatDate(today);
  const yStr = formatDate(yesterday);

  if (dStr === tStr) return '今天';
  if (dStr === yStr) return '昨天';

  const dayOfWeek = d.getDay();
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - dayOfWeek);

  if (d >= weekStart) {
    const names = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return names[dayOfWeek];
  }

  const month = d.getMonth() + 1;
  const day = d.getDate();
  if (d.getFullYear() === today.getFullYear()) {
    return `${month}月${day}日`;
  }
  return `${d.getFullYear()}年${month}月${day}日`;
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** yyyy-mm-dd → Date */
export function parseDate(s: string): Date {
  return new Date(s + 'T00:00:00');
}

/** 获取某月的天数 */
export function daysInMonth(month: string): number {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m, 0).getDate();
}

/** 获取已过天数 */
export function passedDaysInMonth(month: string): number {
  const [y, m] = month.split('-').map(Number);
  const now = new Date();
  const curY = now.getFullYear();
  const curM = now.getMonth() + 1;
  if (y < curY || (y === curY && m < curM)) return new Date(y, m, 0).getDate();
  if (y === curY && m === curM) return now.getDate();
  return 0;
}
