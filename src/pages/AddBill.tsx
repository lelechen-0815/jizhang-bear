import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import { db, type Bill } from '../db';
import { addBill } from '../hooks/useBills';
import { getToday, formatMoney } from '../utils/format';
import BearBubble from '../components/BearBubble';

const CALC_KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', '⌫'],
];

export default function AddBill() {
  const navigate = useNavigate();
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState('');
  const [currency, setCurrency] = useState('CNY');
  const [date, setDate] = useState(getToday());
  const [note, setNote] = useState('');
  const [showQuote, setShowQuote] = useState(false);
  const [quoteContext, setQuoteContext] = useState<{
    condition: 'onAddExpense' | 'onAddIncome';
    context: { amount: number };
  } | null>(null);

  const expenseCats = useLiveQuery(() =>
    db.categories.where('type').equals('expense').toArray()
  );
  const incomeCats = useLiveQuery(() =>
    db.categories.where('type').equals('income').toArray()
  );
  const accounts = useLiveQuery(() => db.accounts.toArray());
  const currencies = useLiveQuery(() => db.currencies.toArray());

  const cats = type === 'expense' ? expenseCats : incomeCats;

  useEffect(() => {
    if (cats && cats.length > 0 && !category) {
      setCategory(cats[0].key);
    }
  }, [cats, category]);

  useEffect(() => {
    if (accounts && accounts.length > 0 && !account) {
      setAccount(accounts[0].key);
    }
  }, [accounts, account]);

  const selectedCurrency = currencies?.find((c) => c.key === currency);
  const currencySymbol = selectedCurrency?.symbol ?? '¥';

  const amountCents = amountStr
    ? Math.round(parseFloat(amountStr) * 100)
    : 0;

  const handleCalcKey = useCallback((key: string) => {
    if (key === '⌫') {
      setAmountStr((prev) => prev.slice(0, -1));
    } else if (key === '.') {
      if (amountStr.includes('.')) return;
      if (amountStr === '') {
        setAmountStr('0.');
      } else {
        setAmountStr((prev) => prev + '.');
      }
    } else {
      if (amountStr.includes('.') && amountStr.split('.')[1].length >= 2) return;
      if (amountStr.replace('.', '').length >= 9) return;
      if (amountStr === '0' && key !== '.') {
        setAmountStr(key);
      } else {
        setAmountStr((prev) => prev + key);
      }
    }
  }, [amountStr]);

  const handleSubmit = async () => {
    if (amountCents <= 0) return;

    const bill: Omit<Bill, 'id' | 'createdAt'> = {
      type,
      amount: amountCents,
      category: category || (type === 'expense' ? 'other_expense' : 'other_income'),
      account: account || 'cash',
      currency,
      date,
      note: note.trim(),
      recordedBy: 'me',
    };

    await addBill(bill);

    setQuoteContext({
      condition: type === 'expense' ? 'onAddExpense' : 'onAddIncome',
      context: { amount: amountCents },
    });
    setShowQuote(true);

    setAmountStr('');
    setNote('');
    setTimeout(() => {
      setShowQuote(false);
      navigate('/');
    }, 1200);
  };

  return (
    <div className="page-add-bill">
      {showQuote && quoteContext && (
        <BearBubble condition={quoteContext.condition} context={quoteContext.context} />
      )}

      {/* 返回按钮 */}
      <div className="add-header">
        <button className="back-btn" onClick={() => navigate(-1)}>✕</button>
      </div>

      {/* 类型切换 */}
      <div className="add-type-toggle">
        <button
          className={type === 'expense' ? 'active expense' : ''}
          onClick={() => { setType('expense'); setCategory(''); }}
        >
          支出
        </button>
        <button
          className={type === 'income' ? 'active income' : ''}
          onClick={() => { setType('income'); setCategory(''); }}
        >
          收入
        </button>
      </div>

      {/* 金额显示 */}
      <div className={`add-amount-display ${type}`}>
        {amountStr
          ? formatMoney(amountCents, type, currencySymbol)
          : (type === 'expense' ? `-${currencySymbol}0.00` : `+${currencySymbol}0.00`)}
      </div>

      {/* 分类选择 */}
      <div className="add-categories">
        {cats?.map((c) => (
          <button
            key={c.key}
            className={`cat-btn ${category === c.key ? 'active' : ''}`}
            onClick={() => setCategory(c.key)}
          >
            <span className="cat-emoji">{c.emoji}</span>
            <span className="cat-name">{c.name}</span>
          </button>
        ))}
      </div>

      {/* 账户 / 币种 / 日期 / 备注 */}
      <div className="add-details">
        <div className="add-detail-row">
          <label>账户</label>
          <select value={account} onChange={(e) => setAccount(e.target.value)}>
            {accounts?.map((a) => (
              <option key={a.key} value={a.key}>{a.icon} {a.name}</option>
            ))}
          </select>
        </div>
        <div className="add-detail-row">
          <label>币种</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {currencies?.map((c) => (
              <option key={c.key} value={c.key}>{c.flag} {c.key} {c.name}</option>
            ))}
          </select>
        </div>
        <div className="add-detail-row">
          <label>日期</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="add-detail-row">
          <label>备注</label>
          <input
            type="text"
            placeholder="添加备注..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>

      {/* 计算器键盘 */}
      <div className="calculator">
        {CALC_KEYS.map((row, ri) => (
          <div key={ri} className="calc-row">
            {row.map((key) => (
              <button
                key={key}
                className={`calc-key ${key === '⌫' ? 'delete' : ''} ${key === '.' ? 'dot' : ''}`}
                onClick={() => handleCalcKey(key)}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
        <div className="calc-row">
          <button className="calc-key submit" onClick={handleSubmit}>
            ✓ 记一笔
          </button>
        </div>
      </div>
    </div>
  );
}
