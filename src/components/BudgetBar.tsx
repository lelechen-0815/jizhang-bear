import { formatMoney } from '../utils/format';

interface Props {
  spent: number; // 单位：分
  budget: number; // 单位：分
}

export default function BudgetBar({ spent, budget }: Props) {
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const remaining = budget - spent;
  const isOver = remaining < 0;

  return (
    <div className={`budget-bar ${isOver ? 'over' : ''}`}>
      <div className="budget-bar-header">
        <span className="budget-label">月度预算</span>
        <span className="budget-amount">
          剩余 {formatMoney(Math.abs(remaining))}
          {isOver ? ' (超支!)' : ''}
        </span>
      </div>
      <div className="budget-track">
        <div className="budget-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="budget-footer">
        <span>{formatMoney(spent)}</span>
        <span>{formatMoney(budget)}</span>
      </div>
    </div>
  );
}
