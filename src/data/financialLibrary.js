export const financialLibrary = {
  topics: {
    money: {
      id: 'money',
      category: 'money_basics',
      title: { english: 'Money', sesotho: 'Chelete' },
      icon: '🪙',
      vocabulary: {
        english: ['money', 'maloti', 'lisente', 'cash', 'currency', 'coins', 'notes', 'chelete'],
        sesotho: ['chelete', 'maloti', 'lisente', 'tšepe', 'pampiri'],
      },
      levels: {
        primary: {
          explanation: {
            english: 'Money is something we use to buy things we need and want. In Lesotho, we use Maloti and Lisente.',
            sesotho: 'Chelete ke ntho eo re e sebelisang ho reka lintho tseo re li hlokang le tseo re li batlang. Lesotho, re sebelisa Maloti le Lisente.',
          },
          example: {
            english: 'A bread costs M10. You give the shopkeeper M10 and you get the bread.',
            sesotho: 'Bohobe bo bitsa M10. U fa morekisi M10 ebe u fumana bohobe.',
          },
          commonQuestions: [
            { english: 'What is money?', sesotho: 'Chelete ke eng?' },
            { english: 'What is a Maloti?', sesotho: 'Maloti ke eng?' },
            { english: 'What are Lisente?', sesotho: 'Lisente ke eng?' },
          ],
        },
        high_school: {
          explanation: {
            english: 'Money is a medium of exchange used to buy goods and services. It also serves as a store of value and a unit of account. In Lesotho, we use the Loti (plural: Maloti) which is divided into 100 Lisente.',
            sesotho: 'Chelete ke mokhoa oa ho fapanyetsana o sebelisetsoang ho reka thepa le litšebeletso. E boetse e sebetsa e le mokhoa oa ho boloka boleng. Lesotho, re sebelisa Loti (bongata: Maloti) e arotsoeng ka Lisente tse 100.',
          },
          example: {
            english: 'M1 Loti = 100 Lisente. A M50 note is the same as 5,000 Lisente.',
            sesotho: 'Loti e le 1 = Lisente tse 100. Pampiri ea M50 e lekana le Lisente tse 5,000.',
          },
          commonQuestions: [
            { english: 'What are the functions of money?', sesotho: 'Mesebetsi ea chelete ke efe?' },
            { english: 'How does money work?', sesotho: 'Chelete e sebetsa joang?' },
          ],
        },
        university: {
          explanation: {
            english: 'Money serves three primary functions: medium of exchange, store of value, and unit of account. The Lesotho Loti (LSL) is pegged to the South African Rand (ZAR) at par. Understanding money is foundational to all other financial concepts.',
            sesotho: 'Chelete e sebetsa mesebetsi e meraro ea mantlha: mokhoa oa ho fapanyetsana, ho boloka boleng, le tekanyo ea boleng. Loti ea Lesotho (LSL) e hokahane le Rand ea Afrika Boroa (ZAR) ka ho lekana. Ho utloisisa chelete ke motheo oa likhopolo tsohle tsa lichelete.',
          },
          example: {
            english: 'The Loti is pegged 1:1 with the Rand, meaning M1 = R1. This has implications for trade, inflation, and monetary policy.',
            sesotho: 'Loti e hokahane 1:1 le Rand, ho bolelang hore M1 = R1. Sena se na le liphello bakeng sa khoebo, inflation le leano la lichelete.',
          },
          commonQuestions: [
            { english: 'What are the functions of money?', sesotho: 'Mesebetsi ea chelete ke efe?' },
            { english: 'How does the Loti-Rand peg work?', sesotho: 'Peg ea Loti le Rand e sebetsa joang?' },
          ],
        },
      },
      misconceptions: [
        { english: 'Money is only paper and coins', sesotho: 'Chelete ke pampiri le tšepe feela' },
        { english: 'More money always means more happiness', sesotho: 'Chelete e ngata e bolela thabo e ngata kamehla' },
      ],
    },

    saving: {
      id: 'saving',
      category: 'saving',
      title: { english: 'Saving Money', sesotho: 'Ho Boloka Chelete' },
      icon: '🐷',
      vocabulary: {
        english: ['save', 'saving', 'savings', 'put money aside', 'keep money', 'piggy bank', 'boloka', 'poloko'],
        sesotho: ['boloka', 'poloko', 'piggy bank', 'ho boloka chelete', 'chelete e bolokiloeng'],
      },
      levels: {
        primary: {
          explanation: {
            english: 'Saving means keeping some of your money for later instead of spending it all right now.',
            sesotho: 'Ho boloka ho bolela ho boloka karolo ea chelete ea hau bakeng sa hamorao ho e-na le ho e sebelisa kaofela hona joale.',
          },
          example: {
            english: 'If you get M10 and keep M3 in your piggy bank, you have saved M3.',
            sesotho: 'Haeba u fumana M10 \'me u boloka M3 ka piggy bank, u bolokile M3.',
          },
          commonQuestions: [
            { english: 'What is saving?', sesotho: 'Ho boloka ke eng?' },
            { english: 'Why should I save?', sesotho: 'Ke hobane\'ng ha ke lokela ho boloka?' },
          ],
        },
        high_school: {
          explanation: {
            english: 'Saving is setting aside a portion of your income for future use rather than spending it immediately. It builds financial security and helps you achieve goals.',
            sesotho: 'Ho boloka ke ho behella karolo ea chelete eo u e fumanang ka thoko bakeng sa tšebeliso ea nako e tlang. Ho haha tšireletso ea lichelete le ho u thusa ho fihlela lipakane.',
          },
          example: {
            english: 'If you earn M500 monthly and save M100, you will have M1,200 after one year.',
            sesotho: 'Haeba u fumana M500 ka khoeli \'me u boloka M100, u tla ba le M1,200 kamora selemo.',
          },
          commonQuestions: [
            { english: 'How much should I save?', sesotho: 'Ke lokela ho boloka bokae?' },
            { english: 'Where should I save my money?', sesotho: 'Ke lokela ho boloka chelete ea ka kae?' },
          ],
        },
        university: {
          explanation: {
            english: 'Saving is the deliberate allocation of income toward future consumption or investment. It provides liquidity for emergencies and creates capital for investments. A common guideline is the 50/30/20 rule: 50% needs, 30% wants, 20% savings.',
            sesotho: 'Ho boloka ke ho arola chelete ka boomo ho ea tšebelisong ea nako e tlang kapa matsete. Ho fana ka chelete ea tšohanyetso le ho theha motheo oa matsete. Tloaelo e tloaelehileng ke molao oa 50/30/20: 50% litlhoko, 30% litakatso, 20% poloko.',
          },
          example: {
            english: 'A student with M2,500 monthly bursary following the 50/30/20 rule would save M500 monthly.',
            sesotho: 'Moithuti ea nang le bursary ea M2,500 ka khoeli ea latelang molao oa 50/30/20 o tla boloka M500 ka khoeli.',
          },
          commonQuestions: [
            { english: 'What is the optimal savings rate?', sesotho: 'Tekanyo e nepahetseng ea poloko ke efe?' },
            { english: 'How does inflation affect savings?', sesotho: 'Inflation e ama poloko joang?' },
          ],
        },
      },
      misconceptions: [
        { english: 'Saving is only for rich people', sesotho: 'Ho boloka ke bakeng sa barui feela' },
        { english: 'I need a lot of money to start saving', sesotho: 'Ke hloka chelete e ngata ho qala ho boloka' },
      ],
    },

    budgeting: {
      id: 'budgeting',
      category: 'budgeting',
      title: { english: 'Budgeting', sesotho: 'Tekanyetso' },
      icon: '📊',
      vocabulary: {
        english: ['budget', 'budgeting', 'spending plan', 'money plan', 'track expenses', 'tekanyetso', 'moralo'],
        sesotho: ['tekanyetso', 'moralo', 'ho rera chelete', 'ho latela tšebeliso'],
      },
      levels: {
        primary: {
          explanation: {
            english: 'A budget is a plan for your money. It helps you know how much you have and what you will spend it on.',
            sesotho: 'Tekanyetso ke moralo oa chelete ea hau. E u thusa ho tseba hore na u na le bokae le hore na u tla e sebelisetsa eng.',
          },
          example: {
            english: 'M50 pocket money: M20 snacks, M20 savings, M10 giving.',
            sesotho: 'Chelete ea pokotho ea M50: M20 lipompong, M20 poloko, M10 ho fana.',
          },
          commonQuestions: [
            { english: 'What is a budget?', sesotho: 'Tekanyetso ke eng?' },
            { english: 'How do I make a budget?', sesotho: 'Ke etsa tekanyetso joang?' },
          ],
        },
        high_school: {
          explanation: {
            english: 'Budgeting is creating a structured plan for your income and expenses. It involves tracking spending, setting limits, and ensuring expenses do not exceed income.',
            sesotho: 'Tekanyetso ke ho theha moralo o hlophisitsoeng oa chelete e kenang le e tsoang. Ho kenyelletsa ho latela tšebeliso, ho beha meeli le ho netefatsa hore litšenyehelo ha li fete chelete e kenang.',
          },
          example: {
            english: 'Monthly income M600: M200 transport, M150 food, M100 airtime, M100 savings, M50 entertainment.',
            sesotho: 'Chelete e kenang ka khoeli M600: M200 lipalangoang, M150 lijo, M100 airtime, M100 poloko, M50 boithabiso.',
          },
          commonQuestions: [
            { english: 'How do I stick to my budget?', sesotho: 'Ke khomarela tekanyetso joang?' },
            { english: 'What should I do if I overspend?', sesotho: 'Ke etsa eng haeba ke sebelisitse ho feta?' },
          ],
        },
        university: {
          explanation: {
            english: 'Budgeting is the systematic allocation of financial resources. It involves forecasting income, categorizing expenses (fixed vs variable), and making informed trade-offs. Zero-based budgeting allocates every Maloti to a purpose.',
            sesotho: 'Tekanyetso ke ho arola lichelete ka mokhoa o hlophisitsoeng. Ho kenyelletsa ho rera chelete e kenang, ho arola litšenyehelo (tse sa fetoheng vs tse fetohang) le ho etsa liqeto tse nepahetseng.',
          },
          example: {
            english: 'A student managing M3,000: M1,200 accommodation (fixed), M800 food (variable), M400 transport, M300 academic, M200 savings, M100 emergency.',
            sesotho: 'Moithuti ea tsamaisang M3,000: M1,200 bolulo (e sa fetoheng), M800 lijo (e fetohang), M400 lipalangoang, M300 libuka, M200 poloko, M100 tšohanyetso.',
          },
          commonQuestions: [
            { english: 'What is zero-based budgeting?', sesotho: 'Zero-based budgeting ke eng?' },
            { english: 'How do I categorise expenses?', sesotho: 'Ke arola litšenyehelo joang?' },
          ],
        },
      },
      misconceptions: [
        { english: 'Budgets are too restrictive', sesotho: 'Tekanyetso e thibela haholo' },
        { english: 'Budgeting is only for people who struggle financially', sesotho: 'Tekanyetso ke bakeng sa batho ba nang le mathata a lichelete feela' },
      ],
    },

    interest: {
      id: 'interest',
      category: 'interest',
      title: { english: 'Interest', sesotho: 'Phaello' },
      icon: '📈',
      vocabulary: {
        english: ['interest', 'interest rate', 'returns', 'percentage growth', 'phaello', 'tswala'],
        sesotho: ['phaello', 'tswala', 'peresente', 'chelete e eketsehileng'],
      },
      levels: {
        primary: {
          explanation: {
            english: 'Interest is extra money you get when you keep money in a bank. It is a reward for saving.',
            sesotho: 'Phaello ke chelete e eketsehileng eo u e fumanang ha u boloka chelete bankeng. Ke moputso oa ho boloka.',
          },
          example: {
            english: 'Save M100 at 5% interest. After one year, you have M105. The M5 is interest.',
            sesotho: 'Boloka M100 ka phaello ea 5%. Kamora selemo, u na le M105. M5 ke phaello.',
          },
          commonQuestions: [
            { english: 'What is interest?', sesotho: 'Phaello ke eng?' },
            { english: 'How do I earn interest?', sesotho: 'Ke fumana phaello joang?' },
          ],
        },
        high_school: {
          explanation: {
            english: 'Interest is the cost of borrowing money or the reward for saving/lending. It is expressed as a percentage of the principal amount over a period of time (usually annual).',
            sesotho: 'Phaello ke theko ea ho alima chelete kapa moputso oa ho boloka/ho alima. E hlalosoa e le peresente ea chelete e ka sehloohong ka nako e itseng (hangata selemo).',
          },
          example: {
            english: 'Borrow M1,000 at 10% annual interest = repay M1,100 after one year. Save M1,000 at 5% = receive M1,050.',
            sesotho: 'Alima M1,000 ka phaello ea 10% = khutlisa M1,100 kamora selemo. Boloka M1,000 ka 5% = fumana M1,050.',
          },
          commonQuestions: [
            { english: 'What is simple interest?', sesotho: 'Phaello e bonolo ke eng?' },
            { english: 'What is compound interest?', sesotho: 'Phaello e kopaneng ke eng?' },
          ],
        },
        university: {
          explanation: {
            english: 'Interest represents the time value of money. Simple interest is calculated on principal only. Compound interest is calculated on principal plus accumulated interest, leading to exponential growth. The formula: A = P(1 + r)^n where A is final amount, P is principal, r is rate, n is periods.',
            sesotho: 'Phaello e emela boleng ba nako ba chelete. Phaello e bonolo e baloa ka chelete e ka sehloohong feela. Phaello e kopaneng e baloa ka chelete le phaello e bokelletsoeng, e lebisang kholong e potlakileng. Foromo: A = P(1 + r)^n moo A e leng kakaretso, P e le chelete, r e le phaello, n e le linako.',
          },
          example: {
            english: 'M1,000 at 10% compound interest: Year 1 = M1,100. Year 2 = M1,210. Year 3 = M1,331. Year 10 = M2,594.',
            sesotho: 'M1,000 ka phaello e kopaneng ea 10%: Selemo 1 = M1,100. Selemo 2 = M1,210. Selemo 3 = M1,331. Selemo 10 = M2,594.',
          },
          commonQuestions: [
            { english: 'How does compound interest work?', sesotho: 'Phaello e kopaneng e sebetsa joang?' },
            { english: 'What is the difference between APR and APY?', sesotho: 'Phapang ke eng lipakeng tsa APR le APY?' },
          ],
        },
      },
      misconceptions: [
        { english: 'Interest only applies to loans', sesotho: 'Phaello e sebetsa feela likolotong' },
        { english: 'All interest is bad', sesotho: 'Phaello eohle e mpe' },
      ],
    },

    loans: {
      id: 'loans',
      category: 'loans',
      title: { english: 'Loans', sesotho: 'Likoloto' },
      icon: '🏦',
      vocabulary: {
        english: ['loan', 'borrow', 'borrowing', 'debt', 'repayment', 'lender', 'kalimo', 'sekoloto'],
        sesotho: ['kalimo', 'sekoloto', 'mokitlane', 'ho alima', 'tefo'],
      },
      levels: {
        primary: {
          explanation: {
            english: 'A loan is money you borrow from someone and agree to pay back later, usually with extra money called interest.',
            sesotho: 'Kalimo ke chelete eo u e alimang ho motho \'me u lumela ho e khutlisa hamorao, hangata le chelete e eketsehileng e bitsoang phaello.',
          },
          example: {
            english: 'Borrow M50 from a friend. Agree to pay back M55. The extra M5 is interest.',
            sesotho: 'Alima M50 ho motsoalle. Lumela ho khutlisa M55. M5 e eketsehileng ke phaello.',
          },
          commonQuestions: [
            { english: 'What is a loan?', sesotho: 'Kalimo ke eng?' },
            { english: 'Do I have to pay back a loan?', sesotho: 'Na ke tlameha ho khutlisa kalimo?' },
          ],
        },
        high_school: {
          explanation: {
            english: 'A loan is money borrowed from a lender with a promise to repay the principal plus interest over an agreed period. Loans can be for education, housing, business, or personal needs.',
            sesotho: 'Kalimo ke chelete e alimiloeng ho mofani ka tšepiso ea ho khutlisa chelete eo hammoho le phaello ka nako e lumellanoeng. Likoloto li ka ba tsa thuto, bolulo, khoebo kapa litlhoko tsa botho.',
          },
          example: {
            english: 'Student loan of M10,000 at 8% over 2 years = monthly repayments of approximately M450.',
            sesotho: 'Kalimo ea moithuti ea M10,000 ka 8% nakong ea lilemo tse 2 = tefo ea khoeli e ka bang M450.',
          },
          commonQuestions: [
            { english: 'What should I consider before taking a loan?', sesotho: 'Ke lokela ho nahana ka eng pele ke alima?' },
            { english: 'What happens if I don\'t repay?', sesotho: 'Ho etsahala eng haeba ke sa khutlise?' },
          ],
        },
        university: {
          explanation: {
            english: 'Loans are financial instruments where the borrower receives funds and agrees to repay principal with interest over a specified term. Key considerations: interest rate, fees, repayment term, total cost of borrowing, and ability to repay. Debt-to-income ratio should generally not exceed 36%.',
            sesotho: 'Likoloto ke lisebelisoa tsa lichelete moo moalimi a fumanang chelete \'me a lumela ho khutlisa chelete eo hammoho le phaello ka nako e behiloeng. Lintlha tsa bohlokoa: phaello, litefiso, nako ea ho khutlisa, kakaretso ea litšenyehelo, le bokhoni ba ho khutlisa.',
          },
          example: {
            english: 'M15,000 loan at 10% over 3 years: total interest = M4,500. Total repayment = M19,500.',
            sesotho: 'Kalimo ea M15,000 ka 10% nakong ea lilemo tse 3: phaello eohle = M4,500. Kakaretso = M19,500.',
          },
          commonQuestions: [
            { english: 'How do I compare loan offers?', sesotho: 'Ke bapisa likalimo joang?' },
            { english: 'What is a good debt-to-income ratio?', sesotho: 'Debt-to-income ratio e ntle ke efe?' },
          ],
        },
      },
      misconceptions: [
        { english: 'All debt is bad', sesotho: 'Sekoloto sohle se sebe' },
        { english: 'Borrowing always means you\'re poor', sesotho: 'Ho alima ho bolela hore u futsanehile' },
      ],
    },

    investing: {
      id: 'investing',
      category: 'investing',
      title: { english: 'Investing', sesotho: 'Matsete' },
      icon: '🌱',
      vocabulary: {
        english: ['invest', 'investing', 'investment', 'grow money', 'stocks', 'bonds', 'matsete'],
        sesotho: ['matsete', 'ho kenya chelete', 'ho holisa chelete', 'li-stock', 'li-bond'],
      },
      levels: {
        primary: {
          explanation: {
            english: 'Investing is using your money to try to make more money over time. It is like planting a seed and watching it grow.',
            sesotho: 'Matsete ke ho sebelisa chelete ea hau ho leka ho etsa chelete e ngata ha nako e ntse e ea. Ho tšoana le ho lema peo le ho e shebella e hola.',
          },
          example: {
            english: 'Invest M100 and it grows to M110. You made M10.',
            sesotho: 'Kenya M100 \'me e hole ho fihlela M110. U entse M10.',
          },
          commonQuestions: [
            { english: 'What is investing?', sesotho: 'Matsete ke eng?' },
            { english: 'Can I invest with little money?', sesotho: 'Na nka kenya chelete e nyane?' },
          ],
        },
        high_school: {
          explanation: {
            english: 'Investing is committing money to assets like stocks, bonds, or businesses with the expectation of earning returns. It carries risk but offers higher potential returns than saving.',
            sesotho: 'Matsete ke ho kenya chelete matlotlong a kang li-stock, li-bond, kapa likhoebo ka tebello ea ho fumana phaello. Ho na le kotsi empa ho fana ka phaello e kholo ho feta ho boloka.',
          },
          example: {
            english: 'Invest M5,000 in a diversified fund at 8% annual return. After 10 years, it could grow to approximately M10,800.',
            sesotho: 'Kenya M5,000 letloleng le fapaneng ka phaello ea 8% ka selemo. Kamora lilemo tse 10, e ka hola ho fihlela M10,800.',
          },
          commonQuestions: [
            { english: 'What is diversification?', sesotho: 'Diversification ke eng?' },
            { english: 'What is risk?', sesotho: 'Kotsi ke eng?' },
          ],
        },
        university: {
          explanation: {
            english: 'Investing involves deploying capital into assets with the expectation of earning returns. Key principles: diversification reduces risk, time horizon matters, compound interest amplifies growth, and risk tolerance should guide asset allocation.',
            sesotho: 'Matsete ke ho kenya chelete matlotlong ka tebello ea ho fumana phaello. Melao-motheo: ho arola matsete ho fokotsa kotsi, nako ea matsete e bohlokoa, phaello e kopaneng e eketsa kholo, le mamello ea kotsi e lokela ho tataisa ho arola matlotlo.',
          },
          example: {
            english: 'Invest M500 monthly in a low-cost index fund at 7% annual return for 10 years = approximately M87,000.',
            sesotho: 'Kenya M500 khoeli le khoeli letloleng la index ka phaello ea 7% ka selemo bakeng sa lilemo tse 10 = hoo e ka bang M87,000.',
          },
          commonQuestions: [
            { english: 'How do I start investing?', sesotho: 'Ke qala matsete joang?' },
            { english: 'What is compound interest in investing?', sesotho: 'Phaello e kopaneng matseteng ke eng?' },
          ],
        },
      },
      misconceptions: [
        { english: 'Investing is gambling', sesotho: 'Matsete ke papali ea chelete' },
        { english: 'You need a lot of money to invest', sesotho: 'U hloka chelete e ngata ho kenya matsete' },
      ],
    },

    needs_wants: {
      id: 'needs_wants',
      category: 'needs_wants',
      title: { english: 'Needs vs Wants', sesotho: 'Litlhoko le Litakatso' },
      icon: '⚖️',
      vocabulary: {
        english: ['need', 'want', 'needs', 'wants', 'essential', 'non-essential', 'tlhoko', 'takatso'],
        sesotho: ['tlhoko', 'takatso', 'litlhoko', 'litakatso', 'bohlokoa'],
      },
      levels: {
        primary: {
          explanation: {
            english: 'Needs are things you must have to live. Wants are things that are nice to have but you can live without.',
            sesotho: 'Litlhoko ke lintho tseo u tlamehang ho ba le tsona ho phela. Litakatso ke lintho tse monate ho ba le tsona empa u ka phela ntle le tsona.',
          },
          example: {
            english: 'Food and shelter are needs. A new toy is a want.',
            sesotho: 'Lijo le bolulo ke litlhoko. Ntho e ncha ea ho bapala ke takatso.',
          },
          commonQuestions: [
            { english: 'What is a need?', sesotho: 'Tlhoko ke eng?' },
            { english: 'What is a want?', sesotho: 'Takatso ke eng?' },
          ],
        },
        high_school: {
          explanation: {
            english: 'Needs are essential expenses required for survival and basic wellbeing. Wants are discretionary purchases that improve quality of life but are not essential. Distinguishing them helps with prioritization.',
            sesotho: 'Litlhoko ke litšenyehelo tsa bohlokoa tse hlokahalang bakeng sa ho phela le boiketlo. Litakatso ke lintho tseo u li batlang empa li se bohlokoa. Ho li khetholla ho thusa ho beha pele.',
          },
          example: {
            english: 'School supplies and transport are needs. A new phone case is a want.',
            sesotho: 'Lisebelisoa tsa sekolo le lipalangoang ke litlhoko. Mokotla o mocha oa fono ke takatso.',
          },
          commonQuestions: [
            { english: 'How do I know if something is a need or want?', sesotho: 'Ke tseba joang hore ntho ke tlhoko kapa takatso?' },
          ],
        },
        university: {
          explanation: {
            english: 'Distinguishing between needs and wants is fundamental to financial planning. Needs include housing, food, healthcare, education, and basic transportation. Wants include entertainment, dining out, and luxury items. The 50/30/20 budget rule allocates 50% to needs.',
            sesotho: 'Ho khetholla lipakeng tsa litlhoko le litakatso ke motheo oa moralo oa lichelete. Litlhoko li kenyelletsa bolulo, lijo, bophelo bo botle, thuto le lipalangoang. Litakatso li kenyelletsa boithabiso le lintho tse turang.',
          },
          example: {
            english: 'Rent (need) vs Netflix subscription (want). Rice and vegetables (need) vs eating out (want).',
            sesotho: 'Rente (tlhoko) vs Netflix (takatso). Raese le meroho (tlhoko) vs ho jella kantle (takatso).',
          },
          commonQuestions: [
            { english: 'How do I prioritise my needs?', sesotho: 'Ke beha litlhoko pele joang?' },
          ],
        },
      },
      misconceptions: [
        { english: 'Wants are always bad', sesotho: 'Litakatso li mpe kamehla' },
        { english: 'Everything I want is a need', sesotho: 'Ntho e \'ngoe le e \'ngoe eo ke e batlang ke tlhoko' },
      ],
    },

    income: {
      id: 'income',
      category: 'income',
      title: { english: 'Income', sesotho: 'Moputso' },
      icon: '💵',
      vocabulary: {
        english: ['income', 'earn', 'earning', 'salary', 'wage', 'revenue', 'moputso', 'chelete e kenang'],
        sesotho: ['moputso', 'chelete e kenang', 'mokitlane o kenang', 'ho fumana'],
      },
      levels: {
        primary: {
          explanation: {
            english: 'Income is the money you receive. It can come from allowance, gifts, or doing small jobs.',
            sesotho: 'Moputso ke chelete eo u e fumanang. E ka tsoa ho chelete ea pokotho, limpho, kapa ho etsa mesebetsi e menyenyane.',
          },
          example: {
            english: 'Parents give you M30 per week = your weekly income.',
            sesotho: 'Batsoali ba u fa M30 ka beke = moputso oa hau oa beke.',
          },
          commonQuestions: [
            { english: 'What is income?', sesotho: 'Moputso ke eng?' },
            { english: 'How do I earn money?', sesotho: 'Ke fumana chelete joang?' },
          ],
        },
        high_school: {
          explanation: {
            english: 'Income is money received regularly from work, investments, or other sources. It is the foundation of your budget and determines your spending capacity.',
            sesotho: 'Moputso ke chelete e fumanoang khafetsa ho tsoa mosebetsing, matseteng kapa mehloling e meng. Ke motheo oa tekanyetso ea hau le matla a hau a ho reka.',
          },
          example: {
            english: 'Part-time job paying M25/hour for 20 hours/week = M500 weekly income.',
            sesotho: 'Mosebetsi oa nakoana o lefang M25 ka hora bakeng sa lihora tse 20 ka beke = M500 ka beke.',
          },
          commonQuestions: [
            { english: 'How do I increase my income?', sesotho: 'Ke eketsa moputso joang?' },
            { english: 'What is disposable income?', sesotho: 'Disposable income ke eng?' },
          ],
        },
        university: {
          explanation: {
            english: 'Income represents the inflow of financial resources. Sources include bursaries, scholarships, part-time work, family support, investments, and entrepreneurial activities. Gross income vs net income matters for budgeting.',
            sesotho: 'Moputso o emela ho kena ha lichelete. Mehloli e kenyelletsa li-bursary, lihlapiso, mosebetsi oa nakoana, tšehetso ea lelapa, matsete le khoebo.',
          },
          example: {
            english: 'Student with M2,500 bursary + M1,000 part-time = M3,500 monthly gross income.',
            sesotho: 'Moithuti ea nang le bursary ea M2,500 + M1,000 ea nakoana = M3,500 ka khoeli.',
          },
          commonQuestions: [
            { english: 'How do I manage irregular income?', sesotho: 'Ke laola chelete e sa tloaelehang joang?' },
            { english: 'What is the difference between gross and net income?', sesotho: 'Phapang ke eng lipakeng tsa gross le net income?' },
          ],
        },
      },
      misconceptions: [
        { english: 'Income is only from jobs', sesotho: 'Moputso o tsoa mesebetsing feela' },
        { english: 'More income always means more money problems', sesotho: 'Chelete e ngata e bolela mathata a mangata' },
      ],
    },
  },

  // Helper function to find the best topic for a question
  findBestTopic: (question) => {
    const q = question.toLowerCase();
    let bestTopic = null;
    let bestScore = 0;

    for (const [topicId, topicData] of Object.entries(financialLibrary.topics)) {
      let score = 0;
      const allVocab = [
        ...(topicData.vocabulary?.english || []),
        ...(topicData.vocabulary?.sesotho || []),
      ];
      for (const word of allVocab) {
        if (q.includes(word.toLowerCase())) {
          score += word.length;
        }
        const words = q.split(' ');
        for (const w of words) {
          if (w.length > 3 && (word.toLowerCase().includes(w) || w.includes(word.toLowerCase()))) {
            score += 2;
          }
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestTopic = topicId;
      }
    }

    return bestScore > 3 ? bestTopic : null;
  },

  // Helper function to get answer for a question at a specific level
  getAnswer: (question, level, language = 'english') => {
    const topicId = financialLibrary.findBestTopic(question);
    if (!topicId) return null;

    const topic = financialLibrary.topics[topicId];
    const levelMap = {
      primary: 'primary',
      high_school: 'high_school',
      university: 'university',
    };
    const mappedLevel = levelMap[level] || 'primary';
    const levelData = topic.levels[mappedLevel] || topic.levels.primary;
    const lang = language === 'sesotho' ? 'sesotho' : 'english';

    return {
      topicId,
      title: topic.title[lang] || topic.title.english,
      explanation: levelData.explanation[lang] || levelData.explanation.english,
      example: levelData.example[lang] || levelData.example.english,
      commonQuestions: levelData.commonQuestions || [],
      misconceptions: topic.misconceptions || [],
    };
  },
};