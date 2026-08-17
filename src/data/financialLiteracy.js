export const financialLiteracyData = {
  topics: {
    saving: {
      keywords: ['save', 'saving', 'savings', 'keep money', 'put money aside'],
      levels: {
        primary: {
          title: 'Saving',
          explanation: 'Saving means keeping some of your money instead of spending it all right away. It helps you have money for things you need later.',
          example: 'If you receive M100 and keep M20 for later, you have saved M20.',
          related: 'budgeting',
        },
        high_school: {
          title: 'Saving',
          explanation: 'Saving is setting aside a portion of your income for future use rather than spending it immediately. It builds financial security and helps you achieve financial goals.',
          example: 'If you earn M500 from a part-time job and save M100 each month, you will have M1,200 saved after one year.',
          related: 'interest',
        },
        university: {
          title: 'Saving',
          explanation: 'Saving is the deliberate allocation of income toward future consumption or investment. It provides liquidity for emergencies and creates capital for investments.',
          example: 'A student saving M300 monthly from a M2,000 bursary at 4% annual interest will accumulate approximately M3,750 in one year.',
          related: 'investing',
        },
      },
    },

    budgeting: {
      keywords: ['budget', 'budgeting', 'plan money', 'manage money', 'spending plan', 'track spending'],
      levels: {
        primary: {
          title: 'Budgeting',
          explanation: 'A budget is a plan for your money. It helps you know how much money you have and what you will spend it on.',
          example: 'If you get M50 pocket money, you could budget M20 for snacks, M20 for saving, and M10 for giving.',
          related: 'spending',
        },
        high_school: {
          title: 'Budgeting',
          explanation: 'Budgeting is creating a structured plan for your income and expenses. It helps you track spending, achieve savings goals, and avoid unnecessary debt.',
          example: 'A monthly budget for M600 income: M200 for transport, M150 for food, M100 for airtime, M100 for savings, and M50 for entertainment.',
          related: 'saving',
        },
        university: {
          title: 'Budgeting',
          explanation: 'Budgeting is the systematic allocation of financial resources across competing needs. It involves forecasting income, categorizing expenses, and making informed trade-offs.',
          example: 'A university student managing M3,000 monthly: M1,200 accommodation, M800 food, M400 transport, M300 academic materials, M200 savings, and M100 emergency fund.',
          related: 'student_budgeting',
        },
      },
    },

    interest: {
      keywords: ['interest', 'interest rate', 'returns', 'bank interest'],
      levels: {
        primary: {
          title: 'Interest',
          explanation: 'Interest is extra money you receive when you keep your money in a bank account. It is a reward for saving.',
          example: 'If you save M100 in the bank and the interest rate is 5%, after one year you will have M105.',
          related: 'saving',
        },
        high_school: {
          title: 'Interest',
          explanation: 'Interest is the cost of borrowing money or the reward for lending/saving money. It is usually expressed as a percentage of the principal amount over a period of time.',
          example: 'If you borrow M1,000 at 10% annual interest, you will owe M1,100 after one year.',
          related: 'loans',
        },
        university: {
          title: 'Interest',
          explanation: 'Interest represents the time value of money. It compensates lenders for deferred consumption and credit risk. Compound interest can significantly grow savings or debt over time.',
          example: 'M1,000 invested at 6% annual compound interest for 5 years will grow to approximately M1,338. M1,000 borrowed at the same rate will cost M1,338 to repay after 5 years.',
          related: 'compound_interest',
        },
      },
    },

    loans: {
      keywords: ['loan', 'borrow', 'borrowing', 'debt', 'lend', 'borrowed money'],
      levels: {
        primary: {
          title: 'Loans',
          explanation: 'A loan is money you borrow from someone or a bank and agree to pay back later, usually with extra money called interest.',
          example: 'If you borrow M50 from a friend and agree to pay back M55, the extra M5 is interest.',
          related: 'interest',
        },
        high_school: {
          title: 'Loans',
          explanation: 'A loan is an amount of money borrowed from a lender with a promise to repay the principal plus interest over an agreed period. Loans can be for education, housing, business, or personal needs.',
          example: 'A student loan of M10,000 at 8% interest over 2 years would require monthly repayments of approximately M450.',
          related: 'budgeting',
        },
        university: {
          title: 'Loans',
          explanation: 'Loans are financial instruments where the borrower receives funds and agrees to repay the principal with interest over a specified term. Key considerations include interest rates, fees, repayment terms, and total cost of borrowing.',
          example: 'Before taking a loan, calculate the total repayment amount. A M20,000 loan at 12% annual interest over 3 years will cost approximately M24,000 in total.',
          related: 'debt_management',
        },
      },
    },

    spending: {
      keywords: ['spend', 'spending', 'buy', 'purchase', 'spending habits'],
      levels: {
        primary: {
          title: 'Spending',
          explanation: 'Spending is using your money to buy things you need or want. It is important to think before you spend.',
          example: 'Before buying something, ask yourself: Do I need this, or do I just want it?',
          related: 'needs_vs_wants',
        },
        high_school: {
          title: 'Spending',
          explanation: 'Spending involves using money to purchase goods and services. Responsible spending means making informed decisions that align with your budget and financial goals.',
          example: 'Tracking your spending for one month can reveal patterns and help you identify areas where you can cut back.',
          related: 'budgeting',
        },
        university: {
          title: 'Spending',
          explanation: 'Spending encompasses both discretionary and non-discretionary expenses. Understanding your spending patterns is critical for effective personal financial management.',
          example: 'Categorise your spending into needs (rent, food) and wants (entertainment). This helps identify where to reduce costs during financial stress.',
          related: 'budgeting',
        },
      },
    },

    income: {
      keywords: ['income', 'earn', 'earning', 'salary', 'wage', 'make money'],
      levels: {
        primary: {
          title: 'Income',
          explanation: 'Income is the money you receive. It can come from allowances, gifts, or doing small jobs.',
          example: 'If your parents give you M30 per week for pocket money, that is your weekly income.',
          related: 'spending',
        },
        high_school: {
          title: 'Income',
          explanation: 'Income is money received on a regular basis from work, investments, or other sources. It is the foundation of your budget.',
          example: 'A part-time job paying M25 per hour for 20 hours per week gives you M500 weekly income.',
          related: 'budgeting',
        },
        university: {
          title: 'Income',
          explanation: 'Income represents the inflow of financial resources. Sources include bursaries, scholarships, part-time work, family support, and entrepreneurial activities.',
          example: 'A student with M2,500 monthly bursary plus M1,000 from part-time work has a total monthly income of M3,500.',
          related: 'personal_financial_planning',
        },
      },
    },

    needs_vs_wants: {
      keywords: ['need', 'want', 'needs', 'wants', 'difference between need and want'],
      levels: {
        primary: {
          title: 'Needs vs Wants',
          explanation: 'Needs are things you must have to live, like food and shelter. Wants are things that are nice to have but you can live without, like toys and sweets.',
          example: 'Food is a need. A new toy is a want.',
          related: 'spending',
        },
        high_school: {
          title: 'Needs vs Wants',
          explanation: 'Needs are essential expenses required for survival and basic wellbeing. Wants are discretionary purchases that improve quality of life but are not essential.',
          example: 'School supplies and transport are needs. A new phone case is a want.',
          related: 'budgeting',
        },
        university: {
          title: 'Needs vs Wants',
          explanation: 'Distinguishing between needs and wants is a fundamental financial skill. Needs include housing, food, healthcare, and education. Wants include entertainment, dining out, and luxury items.',
          example: 'Rent and groceries are needs. Streaming subscriptions and eating out are wants.',
          related: 'budgeting',
        },
      },
    },

    investing: {
      keywords: ['invest', 'investing', 'investment', 'grow money', 'make money grow'],
      levels: {
        primary: {
          title: 'Investing',
          explanation: 'Investing is using your money to try to make more money over time. It is like planting a seed and watching it grow.',
          example: 'If you invest M100 in something that grows by 10%, you will have M110.',
          related: 'saving',
        },
        high_school: {
          title: 'Investing',
          explanation: 'Investing is committing money to assets like stocks, bonds, or businesses with the expectation of generating returns. It carries risk but offers higher potential returns than saving.',
          example: 'Investing M5,000 in a diversified fund with 8% annual return could grow to approximately M10,800 in 10 years.',
          related: 'interest',
        },
        university: {
          title: 'Investing',
          explanation: 'Investing involves deploying capital into assets with the expectation of earning returns. Understanding risk tolerance, diversification, and time horizon is essential for effective investing.',
          example: 'A student investing M500 monthly in a low-cost index fund at 7% annual return would accumulate approximately M87,000 after 10 years.',
          related: 'compound_interest',
        },
      },
    },

    inflation: {
      keywords: ['inflation', 'prices rising', 'cost of living', 'prices going up'],
      levels: {
        primary: {
          title: 'Inflation',
          explanation: 'Inflation is when prices of things go up over time. The same amount of money buys less than before.',
          example: 'If a bread costs M10 this year and M11 next year, that is inflation.',
          related: 'spending',
        },
        high_school: {
          title: 'Inflation',
          explanation: 'Inflation is the general rise in prices over time, reducing the purchasing power of money. It affects how much your savings can buy in the future.',
          example: 'At 5% inflation, M100 today will only buy about M95 worth of goods next year.',
          related: 'saving',
        },
        university: {
          title: 'Inflation',
          explanation: 'Inflation is the rate at which the general price level of goods and services rises. It erodes purchasing power and should be considered when planning savings and investments.',
          example: 'If inflation averages 6% and your savings account earns 3%, your purchasing power actually decreases by 3% annually.',
          related: 'investing',
        },
      },
    },
  },

  // Suggested questions shown in the welcome screen
  suggestedQuestions: [
    'What is saving?',
    'How do I make a budget?',
    'What is interest?',
    'What is a loan?',
    'What is the difference between a need and a want?',
  ],

  // Fallback response when no topic matches
  fallbackResponse: "I don't have information about that topic yet. Try asking about saving, budgeting, interest, loans, spending, income, or investing!",
};