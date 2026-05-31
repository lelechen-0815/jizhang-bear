import { useState, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import * as echarts from 'echarts';
import { db } from '../db';
import { getCurrentMonth, formatMoney } from '../utils/format';
import { useMonthExpenseTotal, useMonthIncomeTotal, useMonthCategoryExpenses } from '../hooks/useBudget';

export default function Stats() {
  const [month, setMonth] = useState(getCurrentMonth());
  const expenseTotal = useMonthExpenseTotal(month);
  const incomeTotal = useMonthIncomeTotal(month);
  const categoryExpenses = useMonthCategoryExpenses(month);
  const categories = useLiveQuery(() => db.categories.where('type').equals('expense').toArray());

  const pieRef = useRef<HTMLDivElement>(null);

  // 获取最近6个月的收支数据
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }).reverse();

  const trendData = useLiveQuery(async () => {
    const result: { month: string; expense: number; income: number }[] = [];
    for (const m of last6Months) {
      const [y, mon] = m.split('-');
      const bills = await db.bills.where('date').startsWith(`${y}-${mon}`).toArray();
      result.push({
        month: m,
        expense: bills.filter((b) => b.type === 'expense').reduce((s, b) => s + b.amount, 0),
        income: bills.filter((b) => b.type === 'income').reduce((s, b) => s + b.amount, 0),
      });
    }
    return result;
  }, [month]);

  // 饼图
  useEffect(() => {
    if (!pieRef.current || !categories) return;

    const chart = echarts.init(pieRef.current);
    const data = categories
      .map((c) => ({
        name: `${c.emoji} ${c.name}`,
        value: categoryExpenses.get(c.key) ?? 0,
      }))
      .filter((d) => d.value > 0);

    chart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: (p: any) => `${p.name}: ¥${(p.value / 100).toFixed(2)} (${p.percent}%)`,
      },
      series: [
        {
          type: 'pie',
          radius: ['45%', '75%'],
          center: ['50%', '50%'],
          label: { show: false },
          emphasis: {
            label: { show: true, fontSize: 14 },
          },
          data,
        },
      ],
    });

    return () => chart.dispose();
  }, [categoryExpenses, categories]);

  // 趋势图
  const trendRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trendRef.current || !trendData) return;

    const chart = echarts.init(trendRef.current);
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 16, right: 16, top: 8, bottom: 24 },
      xAxis: {
        type: 'category',
        data: trendData.map((d) => d.month.substring(5)),
        axisLabel: { fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (v: number) => `¥${(v / 100).toFixed(0)}`,
          fontSize: 11,
        },
      },
      series: [
        {
          name: '支出',
          type: 'bar',
          data: trendData.map((d) => d.expense),
          itemStyle: { color: '#ff6b6b' },
        },
        {
          name: '收入',
          type: 'bar',
          data: trendData.map((d) => d.income),
          itemStyle: { color: '#51cf66' },
        },
      ],
    });

    return () => chart.dispose();
  }, [trendData]);

  const changeMonth = (delta: number) => {
    const [y, m] = month.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  return (
    <div className="page-stats">
      {/* 月份选择 */}
      <div className="month-picker">
        <button onClick={() => changeMonth(-1)}>‹</button>
        <span>{month}</span>
        <button onClick={() => changeMonth(1)}>›</button>
      </div>

      {/* 月度概览 */}
      <div className="stats-overview">
        <div className="stat-card expense">
          <div className="stat-label">支出</div>
          <div className="stat-value">{formatMoney(expenseTotal, 'expense')}</div>
        </div>
        <div className="stat-card income">
          <div className="stat-label">收入</div>
          <div className="stat-value">{formatMoney(incomeTotal, 'income')}</div>
        </div>
        <div className="stat-card balance">
          <div className="stat-label">结余</div>
          <div className="stat-value">{formatMoney(incomeTotal - expenseTotal)}</div>
        </div>
      </div>

      {/* 分类饼图 */}
      <div className="stat-section">
        <h3>支出分类</h3>
        <div ref={pieRef} style={{ height: 240 }} />
      </div>

      {/* 趋势图 */}
      <div className="stat-section">
        <h3>近6个月趋势</h3>
        <div ref={trendRef} style={{ height: 200 }} />
      </div>
    </div>
  );
}
