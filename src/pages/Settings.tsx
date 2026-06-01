import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Account, type Category } from '../db';
import { useBudget } from '../hooks/useBudget';
import { getCurrentMonth } from '../utils/format';
import { defaultAccounts } from '../data/accounts';
import { defaultExpenseCategories, defaultIncomeCategories } from '../data/categories';
import { defaultCurrencies } from '../data/currencies';
import { setBudget } from '../hooks/useBudget';

export default function Settings() {
  const month = getCurrentMonth();
  const budget = useBudget(month);
  const accounts = useLiveQuery(() => db.accounts.toArray());
  const categories = useLiveQuery(() => db.categories.toArray());
  const currencies = useLiveQuery(() => db.currencies.toArray());

  const [budgetInput, setBudgetInput] = useState(
    budget ? String(budget.totalBudget / 100) : ''
  );
  const [showAccForm, setShowAccForm] = useState(false);
  const [showCatForm, setShowCatForm] = useState(false);
  const [showCurForm, setShowCurForm] = useState(false);

  const [accName, setAccName] = useState('');
  const [accIcon, setAccIcon] = useState('💳');

  const [catName, setCatName] = useState('');
  const [catEmoji, setCatEmoji] = useState('📌');
  const [catType, setCatType] = useState<'expense' | 'income'>('expense');

  const [curName, setCurName] = useState('');
  const [curSymbol, setCurSymbol] = useState('');
  const [curFlag, setCurFlag] = useState('🏳️');

  const handleSaveBudget = async () => {
    const val = parseFloat(budgetInput);
    if (isNaN(val) || val < 0) return;
    await setBudget(month, Math.round(val * 100));
  };

  const handleAddAccount = async () => {
    if (!accName.trim()) return;
    const key = 'custom_' + Date.now();
    await db.accounts.put({ key, name: accName.trim(), icon: accIcon, initialBalance: 0 });
    setAccName('');
    setAccIcon('💳');
    setShowAccForm(false);
  };

  const handleDeleteAccount = async (key: string) => {
    if (defaultAccounts.some((a) => a.key === key)) return;
    await db.accounts.delete(key);
  };

  const handleAddCategory = async () => {
    if (!catName.trim()) return;
    const key = 'custom_cat_' + Date.now();
    await db.categories.put({ key, name: catName.trim(), emoji: catEmoji, type: catType, isDefault: false });
    setCatName('');
    setCatEmoji('📌');
    setShowCatForm(false);
  };

  const handleDeleteCategory = async (key: string) => {
    const allDefault = [...defaultExpenseCategories, ...defaultIncomeCategories];
    if (allDefault.some((c) => c.key === key)) return;
    await db.categories.delete(key);
  };

  const handleAddCurrency = async () => {
    if (!curName.trim() || !curSymbol.trim()) return;
    const key = 'custom_cur_' + Date.now();
    await db.currencies.put({ key, name: curName.trim(), symbol: curSymbol.trim(), flag: curFlag, isDefault: false });
    setCurName('');
    setCurSymbol('');
    setCurFlag('🏳️');
    setShowCurForm(false);
  };

  const handleDeleteCurrency = async (key: string) => {
    if (defaultCurrencies.some((c) => c.key === key)) return;
    await db.currencies.delete(key);
  };

  const handleExportCSV = async () => {
    const bills = await db.bills.orderBy('date').reverse().toArray();
    const catMap = new Map<string, Category>();
    (await db.categories.toArray()).forEach((c) => catMap.set(c.key, c));
    const accMap = new Map<string, Account>();
    (await db.accounts.toArray()).forEach((a) => accMap.set(a.key, a));

    const header = '日期,类型,金额,币种,分类,账户,备注';
    const rows = bills.map((b) => {
      const cat = catMap.get(b.category);
      const acc = accMap.get(b.account);
      return [
        b.date,
        b.type === 'expense' ? '支出' : '收入',
        (b.amount / 100).toFixed(2),
        b.currency ?? 'CNY',
        cat ? `${cat.emoji}${cat.name}` : b.category,
        acc ? acc.name : b.account,
        b.note,
      ].join(',');
    });

    const csv = [header, ...rows].join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `自嘲熊记账_${month}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-settings">

      {/* 月度预算 */}
      <div className="settings-section">
        <h3>月度预算（{month}）</h3>
        <div className="budget-input-row">
          <span className="currency">¥</span>
          <input
            type="number"
            placeholder="设置月度预算"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
          />
          <button onClick={handleSaveBudget}>保存</button>
        </div>
      </div>

      {/* 账户管理 */}
      <div className="settings-section">
        <h3>
          账户管理
          <button className="btn-add" onClick={() => setShowAccForm(!showAccForm)}>＋</button>
        </h3>
        {showAccForm && (
          <div className="form-row">
            <select value={accIcon} onChange={(e) => setAccIcon(e.target.value)}>
              {['💵', '🏦', '🔵', '🟢', '💳', '💰', '🏧', '📱'].map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="账户名称"
              value={accName}
              onChange={(e) => setAccName(e.target.value)}
            />
            <button onClick={handleAddAccount}>添加</button>
          </div>
        )}
        <div className="item-list">
          {accounts?.map((a) => (
            <div key={a.key} className="item-row">
              <span>{a.icon} {a.name}</span>
              <button
                className="btn-delete"
                onClick={() => handleDeleteAccount(a.key)}
                disabled={defaultAccounts.some((da) => da.key === a.key)}
              >
                {defaultAccounts.some((da) => da.key === a.key) ? '' : '✕'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 币种管理 */}
      <div className="settings-section">
        <h3>
          币种管理
          <button className="btn-add" onClick={() => setShowCurForm(!showCurForm)}>＋</button>
        </h3>
        {showCurForm && (
          <div className="form-row">
            <input
              type="text"
              placeholder="符号 如€"
              value={curSymbol}
              onChange={(e) => setCurSymbol(e.target.value)}
              style={{ width: 64 }}
            />
            <input
              type="text"
              placeholder="名称 如欧元"
              value={curName}
              onChange={(e) => setCurName(e.target.value)}
            />
            <button onClick={handleAddCurrency}>添加</button>
          </div>
        )}
        <div className="item-list">
          {currencies?.map((c) => (
            <div key={c.key} className="item-row">
              <span>{c.flag} {c.key} {c.name} <span style={{ color: '#9e8d7c', fontSize: 12 }}>{c.symbol}</span></span>
              <button
                className="btn-delete"
                onClick={() => handleDeleteCurrency(c.key)}
                disabled={defaultCurrencies.some((dc) => dc.key === c.key)}
              >
                {defaultCurrencies.some((dc) => dc.key === c.key) ? '' : '✕'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 分类管理 */}
      <div className="settings-section">
        <h3>
          分类管理
          <button className="btn-add" onClick={() => setShowCatForm(!showCatForm)}>＋</button>
        </h3>
        {showCatForm && (
          <div className="form-col">
            <div className="form-row">
              <select value={catType} onChange={(e) => setCatType(e.target.value as any)}>
                <option value="expense">支出分类</option>
                <option value="income">收入分类</option>
              </select>
              <input
                type="text"
                placeholder="emoji"
                value={catEmoji}
                onChange={(e) => setCatEmoji(e.target.value)}
                style={{ width: 64 }}
              />
              <input
                type="text"
                placeholder="分类名称"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
              />
              <button onClick={handleAddCategory}>添加</button>
            </div>
          </div>
        )}
        <div className="item-list">
          {categories?.map((c) => (
            <div key={c.key} className="item-row">
              <span>{c.emoji} {c.name}</span>
              <button
                className="btn-delete"
                onClick={() => handleDeleteCategory(c.key)}
                disabled={c.isDefault}
              >
                {c.isDefault ? '' : '✕'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 数据导出 */}
      <div className="settings-section">
        <h3>数据管理</h3>
        <button className="btn-export" onClick={handleExportCSV}>
          📥 导出 CSV
        </button>
      </div>

      {/* 关于 */}
      <div className="settings-section about">
        <p>🐻 自嘲熊记账 v1.0</p>
        <p className="about-desc">PWA 渐进式应用 · 数据存储在手机本地 · 无需注册</p>
      </div>
    </div>
  );
}
