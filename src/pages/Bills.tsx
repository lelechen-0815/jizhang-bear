import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { deleteBill } from '../hooks/useBills';
import { getCurrentMonth, getDateLabel } from '../utils/format';
import BillItem from '../components/BillItem';

export default function Bills() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = useLiveQuery(() => db.categories.toArray());

  const bills = useLiveQuery(() => {
    const [y, m] = month.split('-');
    let query = db.bills.where('date').startsWith(`${y}-${m}`).reverse();
    return query.sortBy('date');
  }, [month]);

  const filteredBills = useMemo(() => {
    if (!bills) return [];
    return bills.filter((b) => {
      if (typeFilter !== 'all' && b.type !== typeFilter) return false;
      if (categoryFilter !== 'all' && b.category !== categoryFilter) return false;
      return true;
    });
  }, [bills, typeFilter, categoryFilter]);

  // 按日期分组
  const grouped = useMemo(() => {
    const groups: Record<string, typeof filteredBills> = {};
    filteredBills.forEach((b) => {
      if (!groups[b.date]) groups[b.date] = [];
      groups[b.date].push(b);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredBills]);

  const handleDelete = async (id: number) => {
    await deleteBill(id);
  };

  const changeMonth = (delta: number) => {
    const [y, m] = month.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  return (
    <div className="page-bills">
      {/* 顶部筛选 */}
      <div className="bills-header">
        <div className="month-picker">
          <button onClick={() => changeMonth(-1)}>‹</button>
          <span>{month}</span>
          <button onClick={() => changeMonth(1)}>›</button>
        </div>
        <div className="bills-filters">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}>
            <option value="all">全部</option>
            <option value="expense">支出</option>
            <option value="income">收入</option>
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">全部分类</option>
            {categories?.map((c) => (
              <option key={c.key} value={c.key}>{c.emoji} {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 账单列表 */}
      <div className="bills-list">
        {grouped.length === 0 ? (
          <div className="empty-state">这个月还没有账单~</div>
        ) : (
          grouped.map(([date, items]) => (
            <div key={date} className="bill-group">
              <div className="bill-group-date">{getDateLabel(date)}</div>
              {items.map((b) => (
                <BillItem key={b.id} bill={b} onDelete={() => b.id && handleDelete(b.id)} />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
