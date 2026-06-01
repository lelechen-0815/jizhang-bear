import type { Bill } from '../db';
import { formatMoney } from '../utils/format';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

interface Props {
  bill: Bill;
  onClick?: () => void;
  onDelete?: () => void;
}

export default function BillItem({ bill, onClick, onDelete }: Props) {
  const category = useLiveQuery(() => db.categories.get(bill.category), [bill.category]);
  const account = useLiveQuery(() => db.accounts.get(bill.account), [bill.account]);

  return (
    <div className="bill-item" onClick={onClick}>
      <div className="bill-item-icon">{category?.emoji ?? '📦'}</div>
      <div className="bill-item-info">
        <div className="bill-item-name">{category?.name ?? bill.category}</div>
        {bill.note && <div className="bill-item-note">{bill.note}</div>}
        <div className="bill-item-meta">
          {account && <span>{account.icon} {account.name}</span>}
        </div>
      </div>
      <div className={`bill-item-amount ${bill.type}`}>
        {formatMoney(bill.amount, bill.type)}
      </div>
      {onDelete && (
        <button
          className="bill-item-delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          🗑
        </button>
      )}
    </div>
  );
}
