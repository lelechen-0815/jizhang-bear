import { useState, useEffect } from 'react';
import { getRandomQuote, type QuoteRule } from '../data/quotes';

interface Props {
  condition: QuoteRule['condition'];
  context?: { amount?: number; streak?: number; isMonthEnd?: boolean };
}

export default function BearBubble({ condition, context }: Props) {
  const [quote, setQuote] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const q = getRandomQuote(condition, context);
    setQuote(q);
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(t);
  }, [condition, context]);

  if (!visible) return null;

  return (
    <div className="bear-bubble">
      <div className="bear-bubble-text">{quote}</div>
      <div className="bear-avatar">🐻</div>
    </div>
  );
}
