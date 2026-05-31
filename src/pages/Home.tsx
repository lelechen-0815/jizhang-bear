import { useEffect, useState } from 'react';
import { useRecentBills, getStreak } from '../hooks/useBills';
import { useBudget, useMonthExpenseTotal, useMonthIncomeTotal } from '../hooks/useBudget';
import { getCurrentMonth, formatMoney } from '../utils/format';
import { getRandomQuote } from '../data/quotes';
import BillItem from '../components/BillItem';
import BudgetBar from '../components/BudgetBar';

export default function Home() {
  const month = getCurrentMonth();
  const recentBills = useRecentBills(5);
  const budget = useBudget(month);
  const expenseTotal = useMonthExpenseTotal(month);
  const incomeTotal = useMonthIncomeTotal(month);
  const [bearQuote, setBearQuote] = useState('');
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setBearQuote(getRandomQuote('onOpen'));
    getStreak().then(setStreak);
  }, []);

  return (
    <div className="page-home">
      {/* 熊台词区 */}
      <div className="home-bear">
        <div className="home-bear-avatar">🐻</div>
        <div className="home-bear-quote">{bearQuote}</div>
      </div>

      {/* 月度概览 */}
      <div className="home-summary">
        <div className="summary-item expense">
          <div className="summary-label">支出</div>
          <div className="summary-value">{formatMoney(expenseTotal, 'expense')}</div>
        </div>
        <div className="summary-item income">
          <div className="summary-label">收入</div>
          <div className="summary-value">{formatMoney(incomeTotal, 'income')}</div>
        </div>
        <div className="summary-item balance">
          <div className="summary-label">结余</div>
          <div className="summary-value">{formatMoney(incomeTotal - expenseTotal)}</div>
        </div>
      </div>

      {/* 预算进度 */}
      {budget && (
        <BudgetBar spent={expenseTotal} budget={budget.totalBudget} />
      )}

      {/* 连击 */}
      {streak >= 3 && (
        <div className="home-streak">
          🔥 连续记账 {streak} 天！{getRandomQuote('onStreak', { streak })}
        </div>
      )}

      {/* 最近账单 */}
      <div className="home-bills">
        <div className="section-header">
          <h3>最近账单</h3>
        </div>
        {recentBills.length === 0 ? (
          <div className="empty-state">还没有账单，记一笔吧~</div>
        ) : (
          recentBills.map((b) => <BillItem key={b.id} bill={b} />)
        )}
      </div>
    </div>
  );
}
