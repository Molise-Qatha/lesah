export const ACTIVITY_TYPES = {
  TAP_CHOICE: 'tap_choice',
  DRAG_DROP: 'drag_drop',
  COIN_COUNTING: 'coin_counting',
  MATCHING: 'matching',
  SHOPPING: 'shopping',
  SORTING: 'sorting',
  BUDGET_CHALLENGE: 'budget_challenge',
  SCENARIO: 'scenario',
  MEMORY_GAME: 'memory_game',
  PIGGY_BANK: 'piggy_bank',
};

// ═══════════════════════════════════════════
// GRADE 1 — Foundation (Playful Learning)
// ═══════════════════════════════════════════
export const grade1Activities = [
  // Activity 1: Shopping
  {
    id: 'g1_shop_intro',
    type: ACTIVITY_TYPES.SHOPPING,
    title: { english: "Let's Go Shopping!", sesotho: 'A re yeng mabenkeleng!' },
    character: '👧',
    characterName: { english: 'Mpho', sesotho: 'Mpho' },
    prompt: {
      english: 'Mpho has M5. An apple costs M2. Can she buy it?',
      sesotho: 'Mpho o na le M5. Apole e bitsa M2. Na a ka e reka?',
    },
    items: [
      { name: { english: 'Apple', sesotho: 'Apole' }, price: 2, emoji: '🍎' },
      { name: { english: 'Sweet', sesotho: 'Pompong' }, price: 1, emoji: '🍭' },
      { name: { english: 'Bread', sesotho: 'Bohobe' }, price: 10, emoji: '🍞' },
    ],
    budget: 5,
    correctItem: 0,
    feedback: {
      correct: { english: 'YES! You have enough! 🎉', sesotho: 'E! U na le chelete e lekaneng! 🎉' },
      wrong: { english: "Hmm... let's try that again. 🤔", sesotho: "Hmm... ha re leke hape. 🤔" },
    },
  },
  // Activity 2: Coin Counting
  {
    id: 'g1_coin_count',
    type: ACTIVITY_TYPES.COIN_COUNTING,
    title: { english: 'Count the Coins!', sesotho: 'Bala lichelete tsa tšepe!' },
    character: '🪙',
    prompt: {
      english: 'Tap each coin to count them. How many coins?',
      sesotho: 'Tobetsa chelete e \'ngoe le e \'ngoe ho e bala. Ke lichelete tse kae?',
    },
    coins: [1, 1, 1, 1, 1],
    answerOptions: [3, 4, 5],
    answer: 5,
    feedback: {
      correct: { english: '5 coins! Great job! 🌟', sesotho: 'Lichelete tse 5! Mosebetsi o motle! 🌟' },
      wrong: { english: 'Try counting again!', sesotho: 'Leka ho bala hape!' },
    },
  },
  // Activity 3: Save or Spend
  {
    id: 'g1_save_or_spend',
    type: ACTIVITY_TYPES.TAP_CHOICE,
    title: { english: 'Save or Spend?', sesotho: 'Boloka kapa Sebelisa?' },
    character: '🐷',
    prompt: {
      english: 'Mpho has M5. What should she do with it?',
      sesotho: 'Mpho o na le M5. O lokela ho etsa eng ka eona?',
    },
    options: [
      { label: { english: '🐷 Save some', sesotho: '🐷 Boloka e \'ngoe' }, correct: true },
      { label: { english: '🍭 Spend everything', sesotho: '🍭 Sebelisa tsohle' }, correct: false },
    ],
    feedback: {
      correct: { english: 'YES! Saving is smart! 🎉', sesotho: 'E! Ho boloka ke bohlale! 🎉' },
      wrong: { english: "Hmm... maybe save some? 🤔", sesotho: "Hmm... mohlomong boloka e 'ngoe? 🤔" },
    },
  },
  // Activity 4: Piggy Bank
  {
    id: 'g1_piggy_bank',
    type: ACTIVITY_TYPES.PIGGY_BANK,
    title: { english: 'Feed the Piggy Bank!', sesotho: 'Fepa Piggy Bank!' },
    character: '🐷',
    prompt: {
      english: 'Drag M2 into the piggy bank to save it.',
      sesotho: 'Hula M2 ka piggy bank ho e boloka.',
    },
    targetAmount: 2,
    coins: [1, 1, 2, 5],
    correctCoin: 2,
    feedback: {
      correct: { english: 'The piggy bank is happy! 🐷💚', sesotho: 'Piggy bank e thabile! 🐷💚' },
      wrong: { english: 'Try a different coin! 🤔', sesotho: 'Leka chelete e fapaneng! 🤔' },
    },
  },
  // Activity 5: Matching
  {
    id: 'g1_matching',
    type: ACTIVITY_TYPES.MATCHING,
    title: { english: 'Match the Money!', sesotho: 'Bapisa Chelete!' },
    character: '🔗',
    prompt: {
      english: 'Match the item with its price.',
      sesotho: 'Bapisa ntho le theko ea eona.',
    },
    pairs: [
      { left: { english: '🍎 Apple', sesotho: '🍎 Apole' }, right: { english: 'M2', sesotho: 'M2' } },
      { left: { english: '🍞 Bread', sesotho: '🍞 Bohobe' }, right: { english: 'M10', sesotho: 'M10' } },
      { left: { english: '🍭 Sweet', sesotho: '🍭 Pompong' }, right: { english: 'M1', sesotho: 'M1' } },
    ],
    feedback: {
      correct: { english: 'Perfect match! 🌟', sesotho: 'Ho bapisa hantle! 🌟' },
      wrong: { english: 'Try matching again!', sesotho: 'Leka ho bapisa hape!' },
    },
  },
];

// ═══════════════════════════════════════════
// GRADE 4-6 — Exploration (Guided Learning)
// ═══════════════════════════════════════════
export const grade4to6Activities = [
  // Activity 1: Needs vs Wants Sorting
  {
    id: 'g4_sort_needs_wants',
    type: ACTIVITY_TYPES.SORTING,
    title: { english: 'Needs or Wants?', sesotho: 'Litlhoko kapa Litakatso?' },
    character: '⚖️',
    prompt: {
      english: 'Sort each item into Needs or Wants.',
      sesotho: 'Arola ntho e \'ngoe le e \'ngoe ho Litlhoko kapa Litakatso.',
    },
    buckets: [
      { id: 'needs', label: { english: '✅ Needs', sesotho: '✅ Litlhoko' } },
      { id: 'wants', label: { english: '🎈 Wants', sesotho: '🎈 Litakatso' } },
    ],
    items: [
      { name: { english: 'Food', sesotho: 'Lijo' }, emoji: '🍚', correctBucket: 'needs' },
      { name: { english: 'Shelter', sesotho: 'Bolulo' }, emoji: '🏠', correctBucket: 'needs' },
      { name: { english: 'Toy', sesotho: 'Ntho ea ho bapala' }, emoji: '🧸', correctBucket: 'wants' },
      { name: { english: 'Sweets', sesotho: 'Lipompong' }, emoji: '🍬', correctBucket: 'wants' },
      { name: { english: 'School books', sesotho: 'Libuka tsa sekolo' }, emoji: '📚', correctBucket: 'needs' },
    ],
    feedback: {
      correct: { english: 'Correct! 🎯', sesotho: 'Ho nepahetse! 🎯' },
      wrong: { english: 'Think again! Is it essential?', sesotho: 'Nahana hape! Na ke ea bohlokoa?' },
    },
  },
  // Activity 2: Budget Challenge (Simple)
  {
    id: 'g4_simple_budget',
    type: ACTIVITY_TYPES.BUDGET_CHALLENGE,
    title: { english: 'My First Budget', sesotho: 'Tekanyetso ea Ka ea Pele' },
    character: '📊',
    prompt: {
      english: 'You have M50. Decide how to split it: Spend, Save, Give.',
      sesotho: 'U na le M50. Etsa qeto ea ho e arola: Sebelisa, Boloka, Fana.',
    },
    income: 50,
    categories: [
      { name: { english: 'Spend', sesotho: 'Sebelisa' }, emoji: '🛒', min: 10, max: 30 },
      { name: { english: 'Save', sesotho: 'Boloka' }, emoji: '💰', min: 10, max: 25 },
      { name: { english: 'Give', sesotho: 'Fana' }, emoji: '🎁', min: 5, max: 15 },
    ],
    feedback: {
      success: { english: 'Balanced budget! 🎉', sesotho: 'Tekanyetso e leka-lekane! 🎉' },
      overspent: { english: 'Too much! Total must be M50.', sesotho: 'Ho feta! Kakaretso e lokela ho ba M50.' },
    },
  },
  // Activity 3: Memory Game
  {
    id: 'g4_memory',
    type: ACTIVITY_TYPES.MEMORY_GAME,
    title: { english: 'Money Memory', sesotho: 'Memori ea Chelete' },
    character: '🧠',
    prompt: {
      english: 'Find the matching money pairs!',
      sesotho: 'Fumana lipara tse tšoanang tsa chelete!',
    },
    cards: [
      { id: 1, emoji: '🪙', label: { english: 'M1', sesotho: 'M1' } },
      { id: 2, emoji: '🪙', label: { english: 'M1', sesotho: 'M1' } },
      { id: 3, emoji: '💵', label: { english: 'M20', sesotho: 'M20' } },
      { id: 4, emoji: '💵', label: { english: 'M20', sesotho: 'M20' } },
      { id: 5, emoji: '🪙', label: { english: 'M5', sesotho: 'M5' } },
      { id: 6, emoji: '🪙', label: { english: 'M5', sesotho: 'M5' } },
    ],
    feedback: {
      match: { english: 'Match! 🎉', sesotho: 'Ho tšoana! 🎉' },
      noMatch: { english: 'Try again!', sesotho: 'Leka hape!' },
      complete: { english: 'All matched! 🌟', sesotho: 'Kaofela li tšoane! 🌟' },
    },
  },
];

// ═══════════════════════════════════════════
// GRADE 7-9 — Development (Practical Skills)
// ═══════════════════════════════════════════
export const grade7to9Activities = [
  // Activity 1: Budget Challenge (Full)
  {
    id: 'g7_budget_challenge',
    type: ACTIVITY_TYPES.BUDGET_CHALLENGE,
    title: { english: 'Budget Challenge', sesotho: 'Phephetso ea Tekanyetso' },
    character: '📊',
    prompt: {
      english: 'You have M300 for the month. Plan your spending.',
      sesotho: 'U na le M300 khoeli ena. Rera tšebeliso ea hau.',
    },
    income: 300,
    categories: [
      { name: { english: 'Transport', sesotho: 'Lipalangoang' }, emoji: '🚌', min: 50, max: 150 },
      { name: { english: 'Food', sesotho: 'Lijo' }, emoji: '🍚', min: 60, max: 150 },
      { name: { english: 'Airtime', sesotho: 'Airtime' }, emoji: '📱', min: 20, max: 60 },
      { name: { english: 'Savings', sesotho: 'Poloko' }, emoji: '💰', min: 20, max: 100 },
      { name: { english: 'Entertainment', sesotho: 'Boithabiso' }, emoji: '🎮', min: 0, max: 50 },
    ],
    feedback: {
      success: { english: 'Budget balanced! 🎉', sesotho: 'Tekanyetso e lekane! 🎉' },
      overspent: { english: 'Overspent! Adjust your budget.', sesotho: 'U sebelisitse ho feta! Fetola tekanyetso.' },
      underspent: { english: 'Money left! Consider saving more.', sesotho: 'Chelete e setseng! Nahana ka ho boloka.' },
    },
  },
  // Activity 2: Interest Scenario
  {
    id: 'g7_interest_scenario',
    type: ACTIVITY_TYPES.SCENARIO,
    title: { english: 'Interest Decision', sesotho: 'Qeto ea Phaello' },
    character: '📈',
    prompt: {
      english: 'You save M100. Bank A gives 5% interest. Bank B gives 8%. Which bank should you choose?',
      sesotho: 'U boloka M100. Banka A e fana ka 5%. Banka B e fana ka 8%. U khethe banka efe?',
    },
    options: [
      { label: { english: 'Bank B (8%)', sesotho: 'Banka B (8%)' }, correct: true },
      { label: { english: 'Bank A (5%)', sesotho: 'Banka A (5%)' }, correct: false },
      { label: { english: 'Neither', sesotho: 'Ha ho le e \'ngoe' }, correct: false },
    ],
    explanation: {
      english: 'Higher interest means more money earned on your savings. 8% > 5%.',
      sesotho: 'Phaello e phahameng e bolela chelete e ngata e fumanoang polokong. 8% > 5%.',
    },
    feedback: {
      correct: { english: 'Correct! Higher interest = more money! 🎯', sesotho: 'Ho nepahetse! Phaello e phahameng = chelete e ngata! 🎯' },
      wrong: { english: 'Think about which gives more money.', sesotho: 'Nahana hore na ke efe e fanang ka chelete e ngata.' },
    },
  },
  // Activity 3: Debt Awareness
  {
    id: 'g7_debt_awareness',
    type: ACTIVITY_TYPES.TAP_CHOICE,
    title: { english: 'Borrowing Wisely', sesotho: 'Ho Alima ka Bohlale' },
    character: '💳',
    prompt: {
      english: 'Your friend asks to borrow M50 and promises to pay back M50. Is this a good deal for you?',
      sesotho: 'Motsoalle o botsa ho alima M50 \'me o tšepisa ho khutlisa M50. Na see ke ntho e ntle ho uena?',
    },
    options: [
      { label: { english: 'No — no interest for my risk', sesotho: 'Che — ha ho phaello bakeng sa kotsi ea ka' }, correct: true },
      { label: { english: 'Yes — friends help friends', sesotho: 'E — metsoalle e thusana' }, correct: false },
    ],
    feedback: {
      correct: { english: 'Good thinking! Lending has risk. 💡', sesotho: 'Monahano o motle! Ho alima ho na le kotsi. 💡' },
      wrong: { english: 'Friendship is good, but lending has risks.', sesotho: 'Setsoalle se setle, empa ho alima ho na le likotsi.' },
    },
  },
];

// ═══════════════════════════════════════════
// GRADE 10-12 — Application (Real-World)
// ═══════════════════════════════════════════
export const grade10to12Activities = [
  // Activity 1: Compound Interest Calculator
  {
    id: 'g10_compound_calc',
    type: ACTIVITY_TYPES.SCENARIO,
    title: { english: 'Compound Interest Magic', sesotho: 'Mohlolo oa Phaello e Kopaneng' },
    character: '✨',
    prompt: {
      english: 'You invest M1,000 at 10% compound interest. After Year 2, how much do you have?',
      sesotho: 'U kenya M1,000 ka phaello e kopaneng ea 10%. Kamora Selemo 2, u na le bokae?',
    },
    options: [
      { label: { english: 'M1,210', sesotho: 'M1,210' }, correct: true },
      { label: { english: 'M1,200', sesotho: 'M1,200' }, correct: false },
      { label: { english: 'M1,100', sesotho: 'M1,100' }, correct: false },
    ],
    explanation: {
      english: 'Year 1: M1,100. Year 2: M1,100 × 1.10 = M1,210. Interest earns interest!',
      sesotho: 'Selemo 1: M1,100. Selemo 2: M1,100 × 1.10 = M1,210. Phaello e fumana phaello!',
    },
    feedback: {
      correct: { english: 'Correct! Compound interest is powerful! 🎯', sesotho: 'Ho nepahetse! Phaello e kopaneng e matla! 🎯' },
      wrong: { english: 'Remember: interest also earns interest.', sesotho: 'Hopola: phaello le eona e fumana phaello.' },
    },
  },
  // Activity 2: Entrepreneurship
  {
    id: 'g10_business',
    type: ACTIVITY_TYPES.BUDGET_CHALLENGE,
    title: { english: 'Start a Small Business', sesotho: 'Qala Khoebo e Nyane' },
    character: '💼',
    prompt: {
      english: 'You have M200 to start a business. You buy 20 items at M5 each and sell them at M10. What is your profit?',
      sesotho: 'U na le M200 ho qala khoebo. U reka lintho tse 20 ka M5 e le \'ngoe \'me u li rekise ka M10. Phaello ke bokae?',
    },
    income: 200,
    categories: [
      { name: { english: 'Buy items (20 × M5)', sesotho: 'Reka lintho (20 × M5)' }, emoji: '📦', min: 100, max: 100 },
      { name: { english: 'Sell items (20 × M10)', sesotho: 'Rekisa lintho (20 × M10)' }, emoji: '💰', min: 200, max: 200 },
    ],
    feedback: {
      success: { english: 'Profit = M100! 🎉', sesotho: 'Phaello = M100! 🎉' },
      overspent: { english: 'Check your calculations!', sesotho: 'Hlahloba lipalo!' },
    },
  },
];

// ═══════════════════════════════════════════
// UNIVERSITY — Mastery (Advanced)
// ═══════════════════════════════════════════
export const universityActivities = [
  // Activity 1: Loan Comparison
  {
    id: 'uni_loan_comparison',
    type: ACTIVITY_TYPES.SCENARIO,
    title: { english: 'Loan Decision', sesotho: 'Qeto ea Kalimo' },
    character: '🏦',
    prompt: {
      english: 'You need M15,000. Bank A: 8% over 2 years. Bank B: 6% over 3 years. Which is cheaper?',
      sesotho: 'U hloka M15,000. Banka A: 8% ka lilemo tse 2. Banka B: 6% ka lilemo tse 3. Ke efe e theko e tlase?',
    },
    options: [
      { label: { english: 'Bank A (total M17,400)', sesotho: 'Banka A (kakaretso M17,400)' }, correct: true },
      { label: { english: 'Bank B (total M17,700)', sesotho: 'Banka B (kakaretso M17,700)' }, correct: false },
    ],
    explanation: {
      english: 'Bank A total: M15,000 + (M15,000 × 0.08 × 2) = M17,400. Bank B total: M15,000 + (M15,000 × 0.06 × 3) = M17,700. Shorter term can beat lower rate!',
      sesotho: 'Banka A kakaretso: M15,000 + (M15,000 × 0.08 × 2) = M17,400. Banka B kakaretso: M15,000 + (M15,000 × 0.06 × 3) = M17,700. Nako e khuts\'oane e ka hlola phaello e tlase!',
    },
    feedback: {
      correct: { english: 'Excellent analysis! 🎯', sesotho: 'Tlhahlobo e ntle! 🎯' },
      wrong: { english: 'Calculate the total repayment carefully.', sesotho: 'Bala kakaretso ea tefo ka hloko.' },
    },
  },
  // Activity 2: Investment Diversification
  {
    id: 'uni_diversification',
    type: ACTIVITY_TYPES.TAP_CHOICE,
    title: { english: 'Diversification', sesotho: 'Ho Arola Matsete' },
    character: '📊',
    prompt: {
      english: 'You have M5,000 to invest. What is the SMARTEST approach?',
      sesotho: 'U na le M5,000 bakeng sa matsete. Mokhoa o BOHLALE ka ho fetisisa ke ofe?',
    },
    options: [
      { label: { english: 'Spread across savings, stocks, and a small business', sesotho: 'Arola ho poloko, li-stocks, le khoebo e nyane' }, correct: true },
      { label: { english: 'Put everything in one stock', sesotho: 'Kenya tsohle stock e le \'ngoe' }, correct: false },
      { label: { english: 'Keep it all in cash at home', sesotho: 'Boloka tsohle e le chelete lapeng' }, correct: false },
    ],
    feedback: {
      correct: { english: 'Yes! Diversification reduces risk. 🎯', sesotho: 'E! Ho arola matsete ho fokotsa kotsi. 🎯' },
      wrong: { english: 'Diversification is key to managing risk.', sesotho: 'Ho arola matsete ke senotlolo sa ho laola kotsi.' },
    },
  },
  // Activity 3: Emergency Fund
  {
    id: 'uni_emergency_fund',
    type: ACTIVITY_TYPES.BUDGET_CHALLENGE,
    title: { english: 'Build Your Emergency Fund', sesotho: 'Haha Letlole la Tšohanyetso' },
    character: '🛡️',
    prompt: {
      english: 'Your monthly expenses are M3,000. How much should your emergency fund be (3-6 months)?',
      sesotho: 'Litšenyehelo tsa hau tsa khoeli ke M3,000. Letlole la tšohanyetso le lokela ho ba bokae (likhoeli tse 3-6)?',
    },
    income: 18000,
    categories: [
      { name: { english: '3 months (M9,000)', sesotho: 'Likhoeli tse 3 (M9,000)' }, emoji: '💰', min: 9000, max: 9000 },
      { name: { english: '6 months (M18,000)', sesotho: 'Likhoeli tse 6 (M18,000)' }, emoji: '💎', min: 9000, max: 18000 },
    ],
    feedback: {
      success: { english: 'Good range! Aim for 3-6 months of expenses. 🎉', sesotho: 'Tekanyo e ntle! Ipehele likhoeli tse 3-6 tsa litšenyehelo. 🎉' },
      overspent: { english: 'Consider a realistic amount based on your expenses.', sesotho: 'Nahana ka chelete ea nnete e ipapisitseng le litšenyehelo.' },
    },
  },
];

// ═══════════════════════════════════════════
// ACTIVITY SELECTOR
// ═══════════════════════════════════════════
export const getActivitiesForGrade = (gradeId) => {
  const gradeNum = parseInt(gradeId.replace('grade', '')) || 0;
  
  if (gradeNum >= 1 && gradeNum <= 3) return grade1Activities;
  if (gradeNum >= 4 && gradeNum <= 6) return grade4to6Activities;
  if (gradeNum >= 7 && gradeNum <= 9) return grade7to9Activities;
  if (gradeNum >= 10 && gradeNum <= 12) return grade10to12Activities;
  if (gradeId.startsWith('uni_')) return universityActivities;
  
  return grade1Activities;
};

// ═══════════════════════════════════════════
// CHARACTER PERSONALITIES
// ═══════════════════════════════════════════
export const getCharacterForGrade = (gradeId, language = 'english') => {
  const gradeNum = parseInt(gradeId.replace('grade', '')) || 0;
  
  if (gradeNum >= 1 && gradeNum <= 3) {
    return {
      name: 'Mpho',
      emoji: '👧',
      greeting: language === 'sesotho'
        ? 'Lumela! Ke Mpho! A re bapaleng le chelete! 🎉'
        : "Hi! I'm Mpho! Let's play with money! 🎉",
      style: 'playful',
      background: 'linear-gradient(135deg, #ff9800, #ffb74d)',
    };
  }
  if (gradeNum >= 4 && gradeNum <= 6) {
    return {
      name: 'Thabo',
      emoji: '👦',
      greeting: language === 'sesotho'
        ? 'Lumela! Ke Thabo! A re ithuteng ka chelete! 📚'
        : "Hi! I'm Thabo! Let's learn about money! 📚",
      style: 'guided',
      background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
    };
  }
  if (gradeNum >= 7 && gradeNum <= 12) {
    return {
      name: 'Lerato',
      emoji: '🧑🏾',
      greeting: language === 'sesotho'
        ? 'Lumela! Ke Lerato! A re etseng liqeto tse bohlale! 💡'
        : "Hi! I'm Lerato! Let's make smart money decisions! 💡",
      style: 'mentor',
      background: 'linear-gradient(135deg, #1565c0, #64b5f6)',
    };
  }
  return {
    name: 'LeSAH',
    emoji: '🧑🏾‍🏫',
    greeting: language === 'sesotho'
      ? 'Lumela! Ke LeSAH! A re bueng ka lichelete! 🎓'
      : "Hi! I'm LeSAH! Let's talk about money! 🎓",
    style: 'advisor',
    background: 'linear-gradient(135deg, #1b5e20, #4caf50)',
  };
};

// ═══════════════════════════════════════════
// REWARDS & BADGES
// ═══════════════════════════════════════════
export const rewards = [
  { id: 'first_coin', icon: '🪙', title: { english: 'First Coin', sesotho: 'Chelete ea Pele' }, threshold: 1 },
  { id: 'saver_star', icon: '⭐', title: { english: 'Saver Star', sesotho: 'Naleli ea Mopoloki' }, threshold: 3 },
  { id: 'budget_boss', icon: '📊', title: { english: 'Budget Boss', sesotho: 'Mookameli oa Tekanyetso' }, threshold: 5 },
  { id: 'money_master', icon: '👑', title: { english: 'Money Master', sesotho: 'Setsebi sa Chelete' }, threshold: 10 },
  { id: 'financial_guru', icon: '🎓', title: { english: 'Financial Guru', sesotho: 'Guru ea Lichelete' }, threshold: 15 },
];