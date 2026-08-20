// Financial Topic Knowledge Library with Enhanced Keyword Matching
export const financialTopics = {
  money_basics: {
    id: 'money_basics',
    icon: '🪙',
    keywords: {
      english: [
        'money', 'cash', 'maloti', 'lisente', 'currency', 'coins', 'notes',
        'buy', 'buying', 'sell', 'selling', 'price', 'prices', 'change',
        'count money', 'counting money', 'how much money', 'chelete',
      ],
      sesotho: [
        'chelete', 'maloti', 'lisente', 'tšepe', 'pampiri', 'reka', 'rekisa',
        'theko', 'balana', 'ho bala chelete',
      ],
    },
    definitions: {
      primary: {
        english: 'Money is what we use to buy things. In Lesotho, we use Maloti and Lisente.',
        sesotho: 'Chelete ke seo re se sebelisang ho reka lintho. Lesotho, re sebelisa Maloti le Lisente.',
      },
      high_school: {
        english: 'Money is a medium of exchange used to buy goods and services. The Loti is divided into 100 Lisente.',
        sesotho: 'Chelete ke mokhoa oa ho fapanyetsana o sebelisetsoang ho reka thepa le litšebeletso. Loti e arotsoe ka Lisente tse 100.',
      },
      university: {
        english: 'Money serves as a medium of exchange, store of value, and unit of account. The Lesotho Loti (LSL) is pegged to the South African Rand (ZAR).',
        sesotho: 'Chelete e sebetsa e le mokhoa oa ho fapanyetsana, ho boloka boleng le tekanyo ea boleng. Loti ea Lesotho (LSL) e hokahane le Rand ea Afrika Boroa (ZAR).',
      },
    },
    examples: [
      { english: 'A bread costs M10. You give M10 and get bread.', sesotho: 'Bohobe bo bitsa M10. U fana ka M10 \'me u fumana bohobe.' },
      { english: 'M1 = 100 Lisente', sesotho: 'M1 = Lisente tse 100' },
    ],
  },

  saving: {
    id: 'saving',
    icon: '💰',
    keywords: {
      english: [
        'save', 'saving', 'savings', 'put money aside', 'keep money',
        'store money', 'set aside', 'save money', 'saving money',
        'how much should i save', 'where to save', 'where should i keep',
        'boloka', 'poloko',
      ],
      sesotho: [
        'boloka', 'ho boloka', 'poloko', 'chelete e bolokiloeng',
        'behella ka thoko', 'ke boloka', 'ho boloka chelete',
      ],
    },
    definitions: {
      primary: {
        english: 'Saving means keeping some money for later instead of spending it all now.',
        sesotho: 'Ho boloka ho bolela ho boloka chelete bakeng sa hamorao ho e-na le ho e sebelisa kaofela hona joale.',
      },
      high_school: {
        english: 'Saving is setting aside a portion of your income for future use. It builds financial security and helps achieve goals.',
        sesotho: 'Ho boloka ke ho behella karolo ea chelete eo u e fumanang ka thoko bakeng sa tšebeliso ea nako e tlang. Ho haha tšireletso ea lichelete.',
      },
      university: {
        english: 'Saving is the deliberate allocation of income toward future consumption or investment. The 50/30/20 rule suggests saving 20% of income.',
        sesotho: 'Ho boloka ke ho arola chelete ka boomo ho ea tšebelisong ea nako e tlang kapa matsete. Molao oa 50/30/20 o fana ka maikutlo a ho boloka 20% ea chelete e kenang.',
      },
    },
    intents: {
      why: {
        english: 'Saving helps you prepare for the future, handle emergencies, and reach your goals. It gives you peace of mind.',
        sesotho: 'Ho boloka ho u thusa ho itokisetsa bokamoso, ho sebetsana le maemo a tšohanyetso le ho fihlela lipakane tsa hau.',
      },
      how_to: {
        english: 'Start by saving a small amount regularly. Even M5 or M10 from every M100 you receive builds up over time. Use a piggy bank or savings account.',
        sesotho: 'Qala ka ho boloka chelete e nyane khafetsa. Le M5 kapa M10 ho tsoa ho M100 e \'ngoe le e \'ngoe eo u e fumanang ea eketseha ha nako e ntse e ea.',
      },
      where: {
        english: 'You can save money in a piggy bank, a bank savings account, or a mobile money account. A bank account is safer and may earn interest.',
        sesotho: 'U ka boloka chelete ka piggy bank, akhaontong ea poloko bankeng, kapa akhaontong ea mobile money. Akhaonto ea banka e sireletsehile haholoanyane \'me e ka fumana phaello.',
      },
    },
    examples: [
      { english: 'If you get M10 and keep M3, you saved M3.', sesotho: 'Haeba u fumana M10 \'me u boloka M3, u bolokile M3.' },
      { english: 'Save M50 monthly = M600 after one year.', sesotho: 'Boloka M50 ka khoeli = M600 kamora selemo.' },
    ],
  },

  budgeting: {
    id: 'budgeting',
    icon: '📊',
    keywords: {
      english: [
        'budget', 'budgeting', 'spending plan', 'money plan', 'plan spending',
        'track expenses', 'track spending', 'how to budget', 'make a budget',
        'tekanyetso', 'moralo',
      ],
      sesotho: [
        'tekanyetso', 'moralo oa chelete', 'ho rera chelete',
        'ho latela tšebeliso', 'ho etsa tekanyetso',
      ],
    },
    definitions: {
      primary: {
        english: 'A budget is a plan for your money. It shows how much you have and how you will spend it.',
        sesotho: 'Tekanyetso ke moralo oa chelete ea hau. E bontša hore na u na le bokae le hore na u tla e sebelisa joang.',
      },
      high_school: {
        english: 'Budgeting is planning your income and expenses. It helps you track spending and avoid overspending.',
        sesotho: 'Tekanyetso ke ho rera chelete e kenang le e tsoang. E u thusa ho latela tšebeliso le ho qoba ho sebelisa ho feta tekano.',
      },
      university: {
        english: 'Budgeting involves forecasting income, categorizing expenses (fixed vs variable), and making informed trade-offs to achieve financial objectives.',
        sesotho: 'Tekanyetso e kenyelletsa ho rera chelete e kenang, ho arola litšenyehelo, le ho etsa liqeto tse nepahetseng ho fihlela lipakane tsa lichelete.',
      },
    },
    intents: {
      how_to: {
        english: 'To make a budget: 1) List all income. 2) List all expenses. 3) Compare them. 4) Adjust spending if expenses exceed income.',
        sesotho: 'Ho etsa tekanyetso: 1) Ngola chelete eohle e kenang. 2) Ngola litšenyehelo tsohle. 3) Li bapise. 4) Fetola tšebeliso haeba litšenyehelo li feta chelete.',
      },
    },
  },

  needs_wants: {
    id: 'needs_wants',
    icon: '⚖️',
    keywords: {
      english: [
        'need', 'needs', 'want', 'wants', 'essential', 'non-essential',
        'must have', 'nice to have', 'difference between need and want',
        'tlhoko', 'takatso',
      ],
      sesotho: [
        'tlhoko', 'takatso', 'litlhoko', 'litakatso', 'bohlokoa',
        'phapang pakeng tsa',
      ],
    },
    definitions: {
      primary: {
        english: 'Needs are things you MUST have like food and shelter. Wants are things you would LIKE but can live without.',
        sesotho: 'Litlhoko ke lintho tseo U T LAMEHANG ho ba le tsona joaloka lijo le bolulo. Litakatso ke lintho tseo u ka RATANG ho ba le tsona empa u ka phela ntle le tsona.',
      },
      high_school: {
        english: 'Needs are essential for survival and wellbeing. Wants improve quality of life but are not essential.',
        sesotho: 'Litlhoko li bohlokoa bakeng sa ho phela le boiketlo. Litakatso li ntlafatsa bophelo empa ha li bohlokoa.',
      },
      university: {
        english: 'Distinguishing needs from wants is foundational to financial planning. Needs include housing, food, healthcare, education. Wants include entertainment and luxury items.',
        sesotho: 'Ho khetholla litlhoko ho litakatso ke motheo oa moralo oa lichelete. Litlhoko li kenyelletsa bolulo, lijo, bophelo, thuto. Litakatso li kenyelletsa boithabiso.',
      },
    },
  },

  interest: {
    id: 'interest',
    icon: '📈',
    keywords: {
      english: [
        'interest', 'interest rate', 'returns', 'percentage growth',
        'earn interest', 'interest earned', 'interest charged',
        'phaello', 'tswala',
      ],
      sesotho: [
        'phaello', 'tswala', 'peresente', 'chelete e eketsehileng',
        'ho fumana phaello',
      ],
    },
    definitions: {
      primary: {
        english: 'Interest is extra money you get when you save in a bank. It is a reward for saving.',
        sesotho: 'Phaello ke chelete e eketsehileng eo u e fumanang ha u boloka bankeng. Ke moputso oa ho boloka.',
      },
      high_school: {
        english: 'Interest is the cost of borrowing or the reward for saving. It is a percentage of the principal amount.',
        sesotho: 'Phaello ke theko ea ho alima kapa moputso oa ho boloka. Ke peresente ea chelete e ka sehloohong.',
      },
      university: {
        english: 'Interest represents the time value of money. Simple interest = P × r × t. Compound interest = P(1 + r)^n - P.',
        sesotho: 'Phaello e emela boleng ba nako ba chelete. Phaello e bonolo = P × r × t. Phaello e kopaneng = P(1 + r)^n - P.',
      },
    },
  },

  loans: {
    id: 'loans',
    icon: '🏦',
    keywords: {
      english: [
        'loan', 'loans', 'borrow', 'borrowing', 'debt', 'lend',
        'repayment', 'repay', 'borrowed money', 'student loan',
        'kalimo', 'sekoloto',
      ],
      sesotho: [
        'kalimo', 'sekoloto', 'mokitlane', 'ho alima', 'tefo',
        'ho khutlisa',
      ],
    },
    definitions: {
      primary: {
        english: 'A loan is money you borrow and agree to pay back later, usually with extra money called interest.',
        sesotho: 'Kalimo ke chelete eo u e alimang \'me u lumela ho e khutlisa hamorao, hangata le chelete e eketsehileng e bitsoang phaello.',
      },
      high_school: {
        english: 'A loan is borrowed money that must be repaid with interest over an agreed period.',
        sesotho: 'Kalimo ke chelete e alimiloeng e lokelang ho khutlisoa le phaello ka nako e lumellanoeng.',
      },
      university: {
        english: 'Loans are financial instruments requiring repayment of principal with interest. Key considerations: rate, fees, term, total cost.',
        sesotho: 'Likoloto ke lisebelisoa tsa lichelete tse hlokang ho khutlisa chelete le phaello. Lintlha tsa bohlokoa: phaello, litefiso, nako, kakaretso.',
      },
    },
  },

  investing: {
    id: 'investing',
    icon: '🌱',
    keywords: {
      english: [
        'invest', 'investing', 'investment', 'grow money', 'stocks',
        'bonds', 'matsete', 'make money grow',
      ],
      sesotho: [
        'matsete', 'ho kenya chelete', 'ho holisa chelete',
        'li-stock', 'li-bond',
      ],
    },
    definitions: {
      primary: {
        english: 'Investing is using your money to try to make more money. Like planting a seed and watching it grow.',
        sesotho: 'Matsete ke ho sebelisa chelete ea hau ho leka ho etsa chelete e ngata. Joaloka ho lema peo le ho e shebella e hola.',
      },
      high_school: {
        english: 'Investing is committing money to assets expecting returns. Higher risk can mean higher potential return.',
        sesotho: 'Matsete ke ho kenya chelete matlotlong ka tebello ea phaello. Kotsi e phahameng e ka bolela phaello e phahameng.',
      },
      university: {
        english: 'Investing involves deploying capital into assets. Diversification reduces risk. Compound interest amplifies long-term growth.',
        sesotho: 'Matsete ke ho kenya chelete matlotlong. Ho arola matsete ho fokotsa kotsi. Phaello e kopaneng e eketsa kholo ea nako e telele.',
      },
    },
  },

  income: {
    id: 'income',
    icon: '💵',
    keywords: {
      english: [
        'income', 'earn', 'earning', 'salary', 'wage', 'revenue',
        'make money', 'moputso', 'earn money',
      ],
      sesotho: [
        'moputso', 'chelete e kenang', 'ho fumana', 'ho kenya chelete',
      ],
    },
    definitions: {
      primary: {
        english: 'Income is the money you receive. It can come from allowance, gifts, or small jobs.',
        sesotho: 'Moputso ke chelete eo u e fumanang. E ka tsoa ho chelete ea pokotho, limpho kapa mesebetsi e menyenyane.',
      },
      high_school: {
        english: 'Income is money received regularly from work, investments, or other sources.',
        sesotho: 'Moputso ke chelete e fumanoang khafetsa ho tsoa mosebetsing, matseteng kapa mehloling e meng.',
      },
      university: {
        english: 'Income represents inflow of financial resources. Sources include bursaries, part-time work, and entrepreneurship.',
        sesotho: 'Moputso o emela ho kena ha lichelete. Mehloli e kenyelletsa li-bursary, mosebetsi oa nakoana le khoebo.',
      },
    },
  },

  spending: {
    id: 'spending',
    icon: '🛒',
    keywords: {
      english: [
        'spend', 'spending', 'buy', 'purchase', 'spending habits',
        'impulse buying', 'compare prices', 'discount',
      ],
      sesotho: [
        'tšebeliso', 'ho sebelisa', 'ho reka', 'ho sebelisa chelete',
      ],
    },
    definitions: {
      primary: {
        english: 'Spending is using money to buy things. Think before you spend!',
        sesotho: 'Ho sebelisa chelete ke ho e sebelisa ho reka lintho. Nahana pele u sebelisa!',
      },
      high_school: {
        english: 'Spending involves using money for goods and services. Responsible spending aligns with your budget.',
        sesotho: 'Tšebeliso ke ho sebelisa chelete bakeng sa thepa le litšebeletso. Tšebeliso e nang le boikarabelo e tsamaellana le tekanyetso.',
      },
      university: {
        english: 'Spending includes fixed and variable expenses. Tracking spending reveals patterns and identifies areas to reduce costs.',
        sesotho: 'Tšebeliso e kenyelletsa litšenyehelo tse sa fetoheng le tse fetohang. Ho latela tšebeliso ho senola mekhoa.',
      },
    },
  },
};

// Enhanced intent detection with single-word support
export const detectFinancialIntent = (question, language = 'english') => {
  const q = question.toLowerCase().trim();
  const lang = language === 'sesotho' ? 'sesotho' : 'english';
  
  let bestTopic = null;
  let bestScore = 0;

  for (const [topicId, topicData] of Object.entries(financialTopics)) {
    let score = 0;
    const allKeywords = [
      ...(topicData.keywords?.english || []),
      ...(topicData.keywords?.sesotho || []),
    ];
    
    for (const keyword of allKeywords) {
      const kw = keyword.toLowerCase().trim();
      if (!kw) continue;
      
      if (q.includes(kw)) {
        score += kw.length * 3;
      }
      
      const kwWords = kw.split(' ');
      const qWords = q.split(' ');
      
      for (const kwWord of kwWords) {
        if (kwWord.length < 3) continue;
        for (const qWord of qWords) {
          if (qWord === kwWord) {
            score += kwWord.length * 2;
          }
          if (qWord.length > 3 && kwWord.length > 3) {
            if (qWord.startsWith(kwWord) || kwWord.startsWith(qWord)) {
              score += 2;
            }
          }
        }
      }
    }
    
    const topicWords = topicId.replace(/_/g, ' ').toLowerCase().split(' ');
    for (const tw of topicWords) {
      if (q.includes(tw) && tw.length > 3) {
        score += tw.length * 2;
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestTopic = topicId;
    }
  }

  let intent = 'definition';
  if (/what is|what's|what are|define|definition|ke eng|ho bolela eng|what does/.test(q)) intent = 'definition';
  else if (/why|hobaneng|ke hobane|why should|why is|why do/.test(q)) intent = 'why';
  else if (/how|joang|kamoo|how to|how can|how do|how should|how much/.test(q)) intent = 'how_to';
  else if (/where|kae|where should|where to|where can/.test(q)) intent = 'where';
  else if (/example|mohlala|show me|give me/.test(q)) intent = 'example';
  else if (/difference|compare|phapang|bapisa/.test(q)) intent = 'comparison';

  return {
    topic: bestTopic,
    intent,
    confidence: bestScore > 8 ? Math.min(0.95, bestScore / 20) : bestScore > 3 ? 0.45 : 0.15,
  };
};

// Get answer for a topic and intent
export const getTopicAnswer = (topicId, intent, level, language = 'english') => {
  const topic = financialTopics[topicId];
  if (!topic) return null;

  const lang = language === 'sesotho' ? 'sesotho' : 'english';
  const levelMap = { primary: 'primary', high_school: 'high_school', university: 'university' };
  const mappedLevel = levelMap[level] || 'primary';

  const definition = topic.definitions?.[mappedLevel]?.[lang] || topic.definitions?.[mappedLevel]?.english;
  const intentResponse = topic.intents?.[intent]?.[lang] || topic.intents?.[intent]?.english;
  const example = topic.examples?.[0]?.[lang] || topic.examples?.[0]?.english;

  return {
    title: topicId.replace(/_/g, ' ').toUpperCase(),
    icon: topic.icon,
    definition,
    intentResponse,
    example,
  };
};