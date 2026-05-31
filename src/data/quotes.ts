export interface QuoteRule {
  id: string;
  condition: 'onAddIncome' | 'onAddExpense' | 'onOpen' | 'onOverBudget' | 'onStreak' | 'onMonthSummary';
  /** 可选：满足此条件才触发，如 { minAmount: 50000 } 表示大于500元 */
  params?: { minAmount?: number; maxAmount?: number; streak?: number; hour?: [number, number]; isMonthEnd?: boolean };
  quotes: string[];
}

export const quoteRules: QuoteRule[] = [
  // === 记收入 ===
  {
    id: 'income_small',
    condition: 'onAddIncome',
    params: { maxAmount: 10000 }, // ≤100元
    quotes: [
      '哦？有钱进账了？熊表示怀疑。',
      '这点小钱，熊都懒得数。',
      '积少成多嘛……熊努力安慰自己。',
    ],
  },
  {
    id: 'income_normal',
    condition: 'onAddIncome',
    params: { minAmount: 10000, maxAmount: 50000 }, // 100-500元
    quotes: [
      '老板发工资了？该请熊吃饭了。',
      '收入到账！熊的眼睛亮了一下。',
      '终于有钱了，熊可以不用吃土了。',
    ],
  },
  {
    id: 'income_big',
    condition: 'onAddIncome',
    params: { minAmount: 50000 }, // >500元
    quotes: [
      '巨款到账！熊震惊得从沙发上弹了起来！',
      '哇哦！熊宣布今天为"好日子"。',
      '这么多钱？！熊决定今晚加餐！',
      '老板大气！熊感动得热泪盈眶。',
    ],
  },

  // === 记支出 ===
  {
    id: 'expense_tiny',
    condition: 'onAddExpense',
    params: { maxAmount: 2000 }, // ≤20元
    quotes: [
      '小钱，问题不大。熊淡定地喝了口茶。',
      '毛毛雨啦~熊甚至懒得记账。',
      '这点花费，熊批准了。',
    ],
  },
  {
    id: 'expense_normal',
    condition: 'onAddExpense',
    params: { minAmount: 2000, maxAmount: 20000 }, // 20-200元
    quotes: [
      '一笔日常开销，熊默默记下了。',
      '好吧，合理消费，熊不说什么。',
      '钱嘛，就是用来花的。熊自我安慰中。',
    ],
  },
  {
    id: 'expense_big',
    condition: 'onAddExpense',
    params: { minAmount: 20000, maxAmount: 50000 }, // 200-500元
    quotes: [
      '熊的眉头皱了皱：这笔是不是有点多了？',
      '不小的数目呢……熊替你心疼三秒。',
      '花钱一时爽，记账火葬场。熊如是说。',
    ],
  },
  {
    id: 'expense_huge',
    condition: 'onAddExpense',
    params: { minAmount: 50000 }, // >500元
    quotes: [
      '熊的心脏骤停了一秒。',
      '？？？熊揉了揉眼睛，确认没看错。',
      '天哪！你这个月是要和熊一起吃土吗？',
      '熊已晕倒，请用理性消费唤醒它。',
    ],
  },

  // === 打开 App ===
  {
    id: 'open_morning',
    condition: 'onOpen',
    params: { hour: [5, 10] },
    quotes: [
      '早上好！今天也要努力省钱哦~（熊自己都不信）',
      '新的一天，新的账单。熊准备好了吗？',
      '早安！熊昨晚做梦都在记账。',
    ],
  },
  {
    id: 'open_noon',
    condition: 'onOpen',
    params: { hour: [10, 14] },
    quotes: [
      '中午了，该想想今天又花了多少钱了。',
      '午饭时间！熊提醒你该记账了。',
      '熊掐指一算，你今天好像还没记账。',
    ],
  },
  {
    id: 'open_evening',
    condition: 'onOpen',
    params: { hour: [14, 20] },
    quotes: [
      '下班了吗？让熊猜猜你今天花了多少。',
      '夜晚将至，购物车里的东西清一清吧~',
      '认真记账的人运气不会太差。熊瞎说的。',
    ],
  },
  {
    id: 'open_night',
    condition: 'onOpen',
    params: { hour: [20, 5] },
    quotes: [
      '这么晚了还打开记账？熊很感动。',
      '深夜记账，你是认真的吗？熊困了。',
      '熬夜花钱还是熬夜记账？熊选择睡觉。',
    ],
  },

  // === 超预算 ===
  {
    id: 'overbudget',
    condition: 'onOverBudget',
    quotes: [
      '又超了？不愧是你。',
      '你看这个账单，像不像你下个月的泡面？',
      '预算是什么？反正是用来超的。熊放弃了。',
      '熊已经不想说什么了，自己看着办吧。',
      '超预算的感觉是不是很刺激？',
    ],
  },

  // === 记账连续 ===
  {
    id: 'streak_3',
    condition: 'onStreak',
    params: { streak: 3 },
    quotes: [
      '连续记账3天！熊对你有点改观了。',
      '三天了，你居然还在坚持？熊很意外。',
    ],
  },
  {
    id: 'streak_7',
    condition: 'onStreak',
    params: { streak: 7 },
    quotes: [
      '连续记账7天！熊开始对你刮目相看了。',
      '一周了！你是不是偷偷设了闹钟？',
      '自律の熊徽章在向你招手！',
    ],
  },
  {
    id: 'streak_30',
    condition: 'onStreak',
    params: { streak: 30 },
    quotes: [
      '连续记账30天！！！熊已感动到哭泣。',
      '你赢了。熊宣布你是记账界的王者。',
      '一个月了，熊已经离不开你了。',
    ],
  },

  // === 月底总结 ===
  {
    id: 'summary_surplus',
    condition: 'onMonthSummary',
    params: { minAmount: 0 },
    quotes: [
      '居然还有剩的？熊很欣慰。',
      '这个月你做得不错，熊为你骄傲。',
      '月底结余为正，熊决定给你一朵小红花🌺',
    ],
  },
  {
    id: 'summary_deficit',
    condition: 'onMonthSummary',
    params: { maxAmount: -1 },
    quotes: [
      '这个月你和熊一起喝西北风。',
      '钱包：我空了。熊：我也无语了。',
      '下个月重新做人吧。熊拍了拍你的肩膀。',
    ],
  },
];

/** 根据规则匹配随机获取一句台词 */
export function getRandomQuote(
  condition: QuoteRule['condition'],
  context?: { amount?: number; streak?: number; isMonthEnd?: boolean }
): string {
  const now = new Date();
  const hour = now.getHours();

  const candidates = quoteRules.filter((rule) => {
    if (rule.condition !== condition) return false;
    const p = rule.params;
    if (!p) return true;
    // 检查金额范围
    if (p.minAmount !== undefined && (context?.amount ?? 0) < p.minAmount) return false;
    if (p.maxAmount !== undefined && (context?.amount ?? 0) > p.maxAmount) return false;
    // 检查连击天数
    if (p.streak !== undefined && context?.streak !== p.streak) return false;
    // 检查时间段
    if (p.hour) {
      const [start, end] = p.hour;
      if (end > start) {
        if (hour < start || hour >= end) return false;
      } else {
        // 跨天如 [20, 5]
        if (hour < start && hour >= end) return false;
      }
    }
    return true;
  });

  if (candidates.length === 0) {
    // fallback
    const fallbacks = quoteRules.filter((r) => r.condition === condition && !r.params);
    if (fallbacks.length > 0) {
      const fb = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      return fb.quotes[Math.floor(Math.random() * fb.quotes.length)];
    }
    return '熊不想说话。';
  }

  const rule = candidates[Math.floor(Math.random() * candidates.length)];
  return rule.quotes[Math.floor(Math.random() * rule.quotes.length)];
}
