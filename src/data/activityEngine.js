// Activity types that the AI can use to teach
export const ACTIVITY_TYPES = {
  TAP_CHOICE: 'tap_choice',
  DRAG_DROP: 'drag_drop',
  COIN_COUNTING: 'coin_counting',
  MATCHING: 'matching',
  SHOPPING: 'shopping',
  SORTING: 'sorting',
  BUDGET_CHALLENGE: 'budget_challenge',
  SCENARIO: 'scenario',
};

// Sample activities for Grade 1 — Money Basics
export const grade1Activities = [
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
  {
    id: 'g1_coin_count',
    type: ACTIVITY_TYPES.COIN_COUNTING,
    title: { english: 'Count the Coins!', sesotho: 'Bala lichelete tsa tšepe!' },
    character: '🪙',
    prompt: {
      english: 'Tap each coin to count them.',
      sesotho: 'Tobetsa chelete e \'ngoe le e \'ngoe ho e bala.',
    },
    coins: [1, 1, 1, 1, 1],
    answer: 5,
    feedback: {
      correct: { english: '5 coins! Great job! 🌟', sesotho: 'Lichelete tse 5! Mosebetsi o motle! 🌟' },
      wrong: { english: 'Try counting again!', sesotho: 'Leka ho bala hape!' },
    },
  },
  {
    id: 'g1_save_or_spend',
    type: ACTIVITY_TYPES.TAP_CHOICE,
    title: { english: 'Save or Spend?', sesotho: 'Boloka kapa Sebelisa?' },
    character: '🐷',
    prompt: {
      english: 'Mpho has M5. What should she do?',
      sesotho: 'Mpho o na le M5. O lokela ho etsa eng?',
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
];

// Sample activities for Grade 7 — Budgeting
export const grade7Activities = [
  {
    id: 'g7_budget_challenge',
    type: ACTIVITY_TYPES.BUDGET_CHALLENGE,
    title: { english: 'Budget Challenge', sesotho: 'Phephetso ea Tekanyetso' },
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
      success: { english: 'Budget balanced! Great planning! 🎉', sesotho: 'Tekanyetso e lekane! Moralo o motle! 🎉' },
      overspent: { english: "You've spent too much! Adjust your budget.", sesotho: 'U sebelisitse ho feta! Fetola tekanyetso.' },
      underspent: { english: "You have money left! Consider saving more.", sesotho: 'U na le chelete e setseng! Nahana ka ho boloka haholoanyane.' },
    },
  },
];

// Sample activities for University
export const universityActivities = [
  {
    id: 'uni_loan_scenario',
    type: ACTIVITY_TYPES.SCENARIO,
    title: { english: 'Loan Decision', sesotho: 'Qeto ea Kalimo' },
    prompt: {
      english: 'You need M15,000 for tuition. Bank A offers 8% interest over 2 years. Bank B offers 6% over 3 years. Which is cheaper overall?',
      sesotho: 'U hloka M15,000 bakeng sa thuto. Banka A e fana ka phaello ea 8% ka lilemo tse 2. Banka B e fana ka 6% ka lilemo tse 3. Ke efe e theko e tlase?',
    },
    options: [
      { label: { english: 'Bank A (8% over 2 years)', sesotho: 'Banka A (8% ka lilemo tse 2)' }, correct: true },
      { label: { english: 'Bank B (6% over 3 years)', sesotho: 'Banka B (6% ka lilemo tse 3)' }, correct: false },
    ],
    explanation: {
      english: 'Bank A: Total repayment = M17,400. Bank B: Total repayment = M17,700. Bank A is cheaper despite the higher rate because the term is shorter.',
      sesotho: 'Banka A: Kakaretso = M17,400. Banka B: Kakaretso = M17,700. Banka A e theko e tlase leha phaello e phahame hobane nako e khuts\'oane.',
    },
    feedback: {
      correct: { english: 'Correct! Shorter terms can save money even with higher rates. 🎯', sesotho: 'Ho nepahetse! Nako e khuts\'oane e ka boloka chelete leha phaello e phahame. 🎯' },
      wrong: { english: 'Not quite. Calculate the total repayment for both.', sesotho: 'Ha se hantle成长为. Bala kakaretso ea tefo bakeng sa bobeli.' },
    },
  },
];

// Activity selector based on grade
export const getActivitiesForGrade = (gradeId) => {
  const gradeNum = parseInt(gradeId.replace('grade', '')) || 0;
  
  if (gradeNum >= 1 && gradeNum <= 3) return grade1Activities;
  if (gradeNum >= 4 && gradeNum <= 6) return grade1Activities; // Extend later
  if (gradeNum >= 7 && gradeNum <= 9) return grade7Activities;
  if (gradeNum >= 10 && gradeNum <= 12) return grade7Activities; // Extend later
  if (gradeId.startsWith('uni_')) return universityActivities;
  
  return grade1Activities;
};

// Character personalities per grade level
export const getCharacterForGrade = (gradeId, language = 'english') => {
  const gradeNum = parseInt(gradeId.replace('grade', '')) || 0;
  
  if (gradeNum >= 1 && gradeNum <= 3) {
    return {
      name: language === 'sesotho' ? 'Mpho' : 'Mpho',
      emoji: '👧',
      greeting: language === 'sesotho' 
        ? 'Lumela! Ke Mpho! A re bapaleng le chelete! 🎉'
        : "Hi! I'm Mpho! Let's play with money! 🎉",
      style: 'playful',
    };
  }
  if (gradeNum >= 4 && gradeNum <= 6) {
    return {
      name: language === 'sesotho' ? 'Thabo' : 'Thabo',
      emoji: '👦',
      greeting: language === 'sesotho'
        ? 'Lumela! Ke Thabo! A re ithuteng ka chelete! 📚'
        : "Hi! I'm Thabo! Let's learn about money! 📚",
      style: 'guided',
    };
  }
  if (gradeNum >= 7 && gradeNum <= 12) {
    return {
      name: language === 'sesotho' ? 'Lerato' : 'Lerato',
      emoji: '🧑🏾',
      greeting: language === 'sesotho'
        ? 'Lumela! Ke Lerato! A re etseng liqeto tse bohlale tsa lichelete! 💡'
        : "Hi! I'm Lerato! Let's make smart financial decisions! 💡",
      style: 'mentor',
    };
  }
  return {
    name: 'LeSAH',
    emoji: '🧑🏾‍🏫',
    greeting: language === 'sesotho'
      ? 'Lumela! Ke LeSAH! A re bueng ka lichelete! 🎓'
      : "Hi! I'm LeSAH! Let's talk about money! 🎓",
    style: 'advisor',
  };
};