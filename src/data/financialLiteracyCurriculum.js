export const curriculumData = {
  phases: {
    foundation: {
      title: { english: 'Foundation', sesotho: 'Motheo' },
      grades: [1, 2, 3],
      description: { english: 'Understanding what money is and how it is used in daily life.', sesotho: 'Ho utloisisa hore na chelete ke eng le hore na e sebelisoa joang bophelong ba letsatsi le letsatsi.' },
    },
    exploration: {
      title: { english: 'Exploration', sesotho: 'Ho Fumana' },
      grades: [4, 5, 6],
      description: { english: 'Learning to make choices with money and understanding basic financial habits.', sesotho: 'Ho ithuta ho etsa liqeto ka chelete le ho utloisisa mekhoa ea motheo ea lichelete.' },
    },
    development: {
      title: { english: 'Development', sesotho: 'Khōlo' },
      grades: [7, 8, 9],
      description: { english: 'Building financial skills for independence and future planning.', sesotho: 'Ho haha litsebo tsa lichelete bakeng sa boikemelo le moralo oa bokamoso.' },
    },
    application: {
      title: { english: 'Application', sesotho: 'Tšebeliso' },
      grades: [10, 11, 12],
      description: { english: 'Applying financial knowledge to real-life situations and preparing for adulthood.', sesotho: 'Ho sebelisa tsebo ea lichelete maemong a bophelo le ho itokisetsa bophelo ba batho ba baholo.' },
    },
    mastery: {
      title: { english: 'Mastery', sesotho: 'Boqhetseke' },
      grades: ['uni_1', 'uni_2', 'uni_3', 'uni_4'],
      description: { english: 'Advanced financial literacy for university students and young adults.', sesotho: 'Tsebo e tsoetseng pele ea lichelete bakeng sa baithuti ba univesithi le bacha ba baholo.' },
    },
  },

  grades: {
    // ═══════════ GRADE 1 ═══════════
    grade1: {
      label: { english: 'Grade 1', sesotho: 'Kereiti 1' },
      age: { english: 'Age 6-7', sesotho: 'Lilemo tse 6-7' },
      icon: '🪙',
      phase: 'foundation',
      modules: [
        {
          id: 'g1_what_is_money',
          title: { english: 'What is Money?', sesotho: 'Chelete ke Eng?' },
          explanation: {
            english: 'Money is something we use to buy things we need. In Lesotho we use Maloti and Lisente.',
            sesotho: 'Chelete ke ntho eo re e sebelisang ho reka lintho tseo re li hlokang. Lesotho re sebelisa Maloti le Lisente.',
          },
          example: {
            english: 'A loaf of bread costs about M10. You give the shopkeeper M10 and you get the bread.',
            sesotho: 'Bohobe bo bitsa M10. U fa morekisi M10 ebe u fumana bohobe.',
          },
          quiz: [
            {
              question: { english: 'What do we use to buy things?', sesotho: 'Re sebelisa eng ho reka lintho?' },
              options: {
                english: ['Money', 'Stones', 'Leaves'],
                sesotho: ['Chelete', 'Majoe', 'Makhasi'],
              },
              correctIndex: 0,
            },
            {
              question: { english: 'What money do we use in Lesotho?', sesotho: 'Re sebelisa chelete efe Lesotho?' },
              options: {
                english: ['Dollars', 'Maloti and Lisente', 'Euros'],
                sesotho: ['Dollars', 'Maloti le Lisente', 'Euros'],
              },
              correctIndex: 1,
            },
          ],
        },
        {
          id: 'g1_coins_notes',
          title: { english: 'Coins and Notes', sesotho: 'Lichelete tsa Tšepe le Pampiri' },
          explanation: {
            english: 'Money comes in coins and notes. Coins are small and round. Notes are paper.',
            sesotho: 'Chelete e tla ka lichelete tsa tšepe le tsa pampiri. Tsa tšepe li nyane ebile li chitja. Tsa pampiri ke pampiri.',
          },
          example: {
            english: 'M1 coin is round. M20 note is paper. Both are money.',
            sesotho: 'Chelete ea M1 ke tšepe e chitja. M20 ke pampiri. Ka bobeli ke chelete.',
          },
          quiz: [
            {
              question: { english: 'What shape are coins usually?', sesotho: 'Lichelete tsa tšepe li na le sebopeho sefe hangata?' },
              options: {
                english: ['Round', 'Square', 'Triangle'],
                sesotho: ['Chitja', 'Sekwere', 'Tharo-tharo'],
              },
              correctIndex: 0,
            },
            {
              question: { english: 'What is a M20 note made of?', sesotho: 'Chelete ea M20 e entsoe ka eng?' },
              options: {
                english: ['Paper', 'Metal', 'Wood'],
                sesotho: ['Pampiri', 'Tšepe', 'Lehong'],
              },
              correctIndex: 0,
            },
          ],
        },
        {
          id: 'g1_piggy_bank',
          title: { english: 'Saving in a Piggy Bank', sesotho: 'Ho Boloka ka Piggy Bank' },
          explanation: {
            english: 'Saving means keeping some money for later. A piggy bank is a special container for saving money.',
            sesotho: 'Ho boloka ho bolela ho boloka chelete bakeng sa hamorao. Piggy bank ke sejana se khethehileng sa ho boloka chelete.',
          },
          example: {
            english: 'If your grandmother gives you M5, you can put M2 in your piggy bank and keep M3 for sweets.',
            sesotho: 'Haeba nkhono a u fa M5, u ka kenya M2 ka piggy bank ea hau \'me u boloke M3 bakeng sa lipompong.',
          },
          quiz: [
            {
              question: { english: 'What does saving mean?', sesotho: 'Ho boloka ho bolela eng?' },
              options: {
                english: ['Keeping money for later', 'Spending all money now', 'Giving money away'],
                sesotho: ['Ho boloka chelete bakeng sa hamorao', 'Ho sebelisa chelete eohle hona joale', 'Ho fana ka chelete'],
              },
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════ GRADE 2 ═══════════
    grade2: {
      label: { english: 'Grade 2', sesotho: 'Kereiti 2' },
      age: { english: 'Age 7-8', sesotho: 'Lilemo tse 7-8' },
      icon: '🪙',
      phase: 'foundation',
      modules: [
        {
          id: 'g2_spending_choices',
          title: { english: 'Making Choices with Money', sesotho: 'Ho Etsa Liqeto ka Chelete' },
          explanation: {
            english: 'You cannot buy everything you want. You must choose what is most important.',
            sesotho: 'U ke ke ua reka ntho e \'ngoe le e \'ngoe eo u e batlang. U tlameha ho khetha se bohlokoa ka ho fetisisa.',
          },
          example: {
            english: 'You have M10. You can buy a sweet (M5) OR a packet of chips (M10). Choose one.',
            sesotho: 'U na le M10. U ka reka pompong (M5) KAPA pakete ea chips (M10). Khetha e le \'ngoe.',
          },
          quiz: [
            {
              question: { english: 'If you have M10, what should you do?', sesotho: 'Haeba u na le M10, o lokela ho etsa eng?' },
              options: {
                english: ['Choose what is most important', 'Buy everything', 'Throw the money away'],
                sesotho: ['Khetha se bohlokoa ka ho fetisisa', 'Reka ntho e \'ngoe le e \'ngoe', 'Lahla chelete'],
              },
              correctIndex: 0,
            },
          ],
        },
        {
          id: 'g2_bank_basics',
          title: { english: 'What is a Bank?', sesotho: 'Banka ke Eng?' },
          explanation: {
            english: 'A bank is a safe place to keep your money. People put money in banks to keep it safe.',
            sesotho: 'Banka ke sebaka se sireletsehileng sa ho boloka chelete. Batho ba kenya chelete libankeng ho e boloka e sireletsehile.',
          },
          example: {
            english: 'Your parents may have a bank account. They put money there to keep it safe.',
            sesotho: 'Batsoali ba hau ba ka ba le akhaonto ea banka. Ba kenya chelete moo ho e boloka e sireletsehile.',
          },
          quiz: [
            {
              question: { english: 'Why do people use banks?', sesotho: 'Ke hobane\'ng ha batho ba sebelisa libanka?' },
              options: {
                english: ['To keep money safe', 'To lose money', 'To spend money'],
                sesotho: ['Ho boloka chelete e sireletsehile', 'Ho lahleheloa ke chelete', 'Ho sebelisa chelete'],
              },
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════ GRADE 3 ═══════════
    grade3: {
      label: { english: 'Grade 3', sesotho: 'Kereiti 3' },
      age: { english: 'Age 8-9', sesotho: 'Lilemo tse 8-9' },
      icon: '🪙',
      phase: 'foundation',
      modules: [
        {
          id: 'g3_allowance',
          title: { english: 'Allowance and Pocket Money', sesotho: 'Chelete ea Pokotho' },
          explanation: {
            english: 'Allowance is money given to you regularly, usually by parents or family. You can learn to manage it.',
            sesotho: 'Chelete ea pokotho ke chelete eo u e fuoang khafetsa, hangata ke batsoali kapa lelapa. U ka ithuta ho e sebelisa ka nepo.',
          },
          example: {
            english: 'If you get M20 per week, you could spend M10 on snacks, save M5, and give M5 to church.',
            sesotho: 'Haeba u fumana M20 ka beke, u ka sebelisa M10 lipompong, u boloka M5, \'me u fana ka M5 kerekeng.',
          },
          quiz: [
            {
              question: { english: 'What is allowance?', sesotho: 'Chelete ea pokotho ke eng?' },
              options: {
                english: ['Money given regularly', 'Money you steal', 'Money you find'],
                sesotho: ['Chelete e fuoang khafetsa', 'Chelete eo u e utsoang', 'Chelete eo u e fumanang'],
              },
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════ GRADE 4 ═══════════
    grade4: {
      label: { english: 'Grade 4', sesotho: 'Kereiti 4' },
      age: { english: 'Age 9-10', sesotho: 'Lilemo tse 9-10' },
      icon: '📊',
      phase: 'exploration',
      modules: [
        {
          id: 'g4_needs_wants',
          title: { english: 'Needs vs Wants', sesotho: 'Litlhoko le Litakatso' },
          explanation: {
            english: 'Needs are things you must have to survive. Wants are things you would like to have but can live without.',
            sesotho: 'Litlhoko ke lintho tseo u tlamehang ho ba le tsona ho phela. Litakatso ke lintho tseo u ka ratang ho ba le tsona empa u ka phela ntle le tsona.',
          },
          example: {
            english: 'Food and shelter are needs. A new toy or fancy shoes are wants.',
            sesotho: 'Lijo le bolulo ke litlhoko. Ntho e ncha ea ho bapala kapa lieta tse turang ke litakatso.',
          },
          quiz: [
            {
              question: { english: 'Is food a need or a want?', sesotho: 'Na lijo ke tlhoko kapa takatso?' },
              options: {
                english: ['Need', 'Want', 'Neither'],
                sesotho: ['Tlhoko', 'Takatso', 'Ha se letho'],
              },
              correctIndex: 0,
            },
            {
              question: { english: 'Is a new toy a need or a want?', sesotho: 'Na ntho e ncha ea ho bapala ke tlhoko kapa takatso?' },
              options: {
                english: ['Want', 'Need', 'Neither'],
                sesotho: ['Takatso', 'Tlhoko', 'Ha se letho'],
              },
              correctIndex: 0,
            },
          ],
        },
        {
          id: 'g4_simple_budget',
          title: { english: 'Simple Budget', sesotho: 'Tekanyetso e Bonolo' },
          explanation: {
            english: 'A budget is a plan for your money. You decide how much to spend, save, and give before you get the money.',
            sesotho: 'Tekanyetso ke moralo oa chelete ea hau. U etsa qeto ea hore na u sebelise bokae, u boloke bokae, le ho fana bokae pele u fumana chelete.',
          },
          example: {
            english: 'M50 budget: M20 spending, M20 saving, M10 giving.',
            sesotho: 'Tekanyetso ea M50: M20 ea ho sebelisa, M20 ea ho boloka, M10 ea ho fana.',
          },
          quiz: [
            {
              question: { english: 'What is a budget?', sesotho: 'Tekanyetso ke eng?' },
              options: {
                english: ['A plan for your money', 'A type of bank', 'A game'],
                sesotho: ['Moralo oa chelete ea hau', 'Mofuta oa banka', 'Papali'],
              },
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════ GRADE 5 ═══════════
    grade5: {
      label: { english: 'Grade 5', sesotho: 'Kereiti 5' },
      age: { english: 'Age 10-11', sesotho: 'Lilemo tse 10-11' },
      icon: '📊',
      phase: 'exploration',
      modules: [
        {
          id: 'g5_goals',
          title: { english: 'Setting Savings Goals', sesotho: 'Ho Beha Lipakane tsa Poloko' },
          explanation: {
            english: 'A savings goal is a specific thing you are saving for. Having a goal makes saving easier and more exciting.',
            sesotho: 'Pakane ea poloko ke ntho e itseng eo u e bolokelang. Ho ba le pakane ho etsa hore ho boloka ho be bonolo le ho be monate.',
          },
          example: {
            english: 'Goal: Save M100 for new school shoes. If you save M20 per week, you will reach your goal in 5 weeks.',
            sesotho: 'Pakane: Boloka M100 bakeng sa lieta tse ncha tsa sekolo. Haeba u boloka M20 ka beke, u tla fihlela pakane ka libeke tse 5.',
          },
          quiz: [
            {
              question: { english: 'What is a savings goal?', sesotho: 'Pakane ea poloko ke eng?' },
              options: {
                english: ['A specific thing you are saving for', 'A type of bank', 'A loan'],
                sesotho: ['Ntho e itseng eo u e bolokelang', 'Mofuta oa banka', 'Kalimo'],
              },
              correctIndex: 0,
            },
            {
              question: { english: 'If you save M20 per week and need M100, how many weeks?', sesotho: 'Haeba u boloka M20 ka beke \'me u hloka M100, ke libeke tse kae?' },
              options: {
                english: ['5 weeks', '10 weeks', '2 weeks'],
                sesotho: ['Libeke tse 5', 'Libeke tse 10', 'Libeke tse 2'],
              },
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════ GRADE 6 ═══════════
    grade6: {
      label: { english: 'Grade 6', sesotho: 'Kereiti 6' },
      age: { english: 'Age 11-12', sesotho: 'Lilemo tse 11-12' },
      icon: '📊',
      phase: 'exploration',
      modules: [
        {
          id: 'g6_banking',
          title: { english: 'Bank Accounts for Kids', sesotho: 'Liakhaonto tsa Banka tsa Bana' },
          explanation: {
            english: 'Many banks offer savings accounts for children. Opening an account helps you learn how banking works.',
            sesotho: 'Libanka tse ngata li fana ka liakhaonto tsa poloko tsa bana. Ho bula akhaonto ho u thusa ho ithuta hore na banka e sebetsa joang.',
          },
          example: {
            english: 'Some banks allow children to open savings accounts with as little as M50.',
            sesotho: 'Libanka tse ling li lumella bana ho bula liakhaonto tsa poloko ka chelete e nyane joaloka M50.',
          },
          quiz: [
            {
              question: { english: 'What can you open at a bank to save money?', sesotho: 'U ka bula eng bankeng ho boloka chelete?' },
              options: {
                english: ['Savings account', 'A game', 'A shop'],
                sesotho: ['Akhaonto ea poloko', 'Papali', 'Lebenkele'],
              },
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════ GRADE 7 ═══════════
    grade7: {
      label: { english: 'Grade 7', sesotho: 'Kereiti 7' },
      age: { english: 'Age 12-13', sesotho: 'Lilemo tse 12-13' },
      icon: '📈',
      phase: 'development',
      modules: [
        {
          id: 'g7_income',
          title: { english: 'Understanding Income', sesotho: 'Ho Utloisisa Moputso' },
          explanation: {
            english: 'Income is money you receive regularly. It can come from allowance, gifts, or small jobs you do for others.',
            sesotho: 'Moputso ke chelete eo u e fumanang khafetsa. E ka tsoa ho chelete ea pokotho, limpho, kapa mesebetsi e menyenyane eo u e etsetsang ba bang.',
          },
          example: {
            english: 'If you help your neighbour and earn M30, that is income.',
            sesotho: 'Haeba u thusa moahelani \'me u fumana M30, ke moputso.',
          },
          quiz: [
            {
              question: { english: 'What is income?', sesotho: 'Moputso ke eng?' },
              options: {
                english: ['Money you receive regularly', 'Money you spend', 'Money you lose'],
                sesotho: ['Chelete e fumanang khafetsa', 'Chelete eo u e sebelisang', 'Chelete eo u e lahlang'],
              },
              correctIndex: 0,
            },
          ],
        },
        {
          id: 'g7_interest_intro',
          title: { english: 'Introduction to Interest', sesotho: 'Kenyelletso ea Phaello' },
          explanation: {
            english: 'Interest is extra money you earn when you keep money in a savings account. It is a reward for saving.',
            sesotho: 'Phaello ke chelete e eketsehileng eo u e fumanang ha u boloka chelete akhaontong ea poloko. Ke moputso oa ho boloka.',
          },
          example: {
            english: 'If you save M100 at 5% interest, after one year you will have M105. The M5 is interest.',
            sesotho: 'Haeba u boloka M100 ka phaello ea 5%, kamora selemo u tla ba le M105. M5 ke phaello.',
          },
          quiz: [
            {
              question: { english: 'What is interest?', sesotho: 'Phaello ke eng?' },
              options: {
                english: ['Extra money for saving', 'Money you lose', 'A type of loan'],
                sesotho: ['Chelete e eketsehileng ea poloko', 'Chelete eo u e lahlang', 'Mofuta oa kalimo'],
              },
              correctIndex: 0,
            },
            {
              question: { english: 'If you save M100 at 5% interest for 1 year, how much do you have?', sesotho: 'Haeba u boloka M100 ka phaello ea 5% bakeng sa selemo se le seng, u na le bokae?' },
              options: {
                english: ['M105', 'M100', 'M95'],
                sesotho: ['M105', 'M100', 'M95'],
              },
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════ GRADE 8 ═══════════
    grade8: {
      label: { english: 'Grade 8', sesotho: 'Kereiti 8' },
      age: { english: 'Age 13-14', sesotho: 'Lilemo tse 13-14' },
      icon: '📈',
      phase: 'development',
      modules: [
        {
          id: 'g8_budgeting',
          title: { english: 'Creating a Budget', sesotho: 'Ho Theha Tekanyetso' },
          explanation: {
            english: 'A budget helps you plan your income and expenses. It prevents overspending and helps you save.',
            sesotho: 'Tekanyetso e u thusa ho rera chelete e kenang le e tsoang. E thibela ho sebelisa chelete ho feta tekano le ho thusa ho boloka.',
          },
          example: {
            english: 'Monthly income M300: M100 transport, M80 food, M50 airtime, M40 savings, M30 entertainment.',
            sesotho: 'Chelete e kenang ka khoeli M300: M100 lipalangoang, M80 lijo, M50 airtime, M40 poloko, M30 boithabiso.',
          },
          quiz: [
            {
              question: { english: 'What does a budget help you do?', sesotho: 'Tekanyetso e u thusa ho etsa eng?' },
              options: {
                english: ['Plan income and expenses', 'Spend more money', 'Lose money'],
                sesotho: ['Rera chelete e kenang le e tsoang', 'Sebelisa chelete e ngata', 'Lahleheloa ke chelete'],
              },
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════ GRADE 9 ═══════════
    grade9: {
      label: { english: 'Grade 9', sesotho: 'Kereiti 9' },
      age: { english: 'Age 14-15', sesotho: 'Lilemo tse 14-15' },
      icon: '📈',
      phase: 'development',
      modules: [
        {
          id: 'g9_debt',
          title: { english: 'Understanding Debt', sesotho: 'Ho Utloisisa Sekoloto' },
          explanation: {
            english: 'Debt is money you owe to someone. Borrowing money means you must pay it back, usually with interest.',
            sesotho: 'Sekoloto ke chelete eo u e kolotang motho. Ho alima chelete ho bolela hore u tlameha ho e khutlisa, hangata le phaello.',
          },
          example: {
            english: 'If you borrow M100 and agree to pay back M110, the extra M10 is interest. The total debt is M110.',
            sesotho: 'Haeba u alima M100 \'me u lumela ho khutlisa M110, M10 e eketsehileng ke phaello. Sekoloto kaofela ke M110.',
          },
          quiz: [
            {
              question: { english: 'What is debt?', sesotho: 'Sekoloto ke eng?' },
              options: {
                english: ['Money you owe', 'Money you earn', 'Money you save'],
                sesotho: ['Chelete eo u e kolotang', 'Chelete eo u e fumanang', 'Chelete eo u e bolokang'],
              },
              correctIndex: 0,
            },
            {
              question: { english: 'If you borrow M100 and pay back M110, what is M10?', sesotho: 'Haeba u alima M100 \'me u khutlisa M110, M10 ke eng?' },
              options: {
                english: ['Interest', 'Gift', 'Salary'],
                sesotho: ['Phaello', 'Mpho', 'Moputso'],
              },
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════ GRADE 10 ═══════════
    grade10: {
      label: { english: 'Grade 10', sesotho: 'Kereiti 10' },
      age: { english: 'Age 15-16', sesotho: 'Lilemo tse 15-16' },
      icon: '💼',
      phase: 'application',
      modules: [
        {
          id: 'g10_compound',
          title: { english: 'Compound Interest', sesotho: 'Phaello e Kopaneng' },
          explanation: {
            english: 'Compound interest is interest on interest. Your money grows faster because you earn interest on both your original money AND the interest it has already earned.',
            sesotho: 'Phaello e kopaneng ke phaello holim\'a phaello. Chelete ea hau e hola ka potlako hobane u fumana phaello holim\'a chelete ea pele LE phaello e seng e fumanoe.',
          },
          example: {
            english: 'M1,000 at 10% compound interest: Year 1 = M1,100. Year 2 = M1,210. Year 3 = M1,331.',
            sesotho: 'M1,000 ka phaello e kopaneng ea 10%: Selemo 1 = M1,100. Selemo 2 = M1,210. Selemo 3 = M1,331.',
          },
          quiz: [
            {
              question: { english: 'What is compound interest?', sesotho: 'Phaello e kopaneng ke eng?' },
              options: {
                english: ['Interest on interest', 'Simple interest only', 'No interest'],
                sesotho: ['Phaello holim\'a phaello', 'Phaello e bonolo feela', 'Ha ho phaello'],
              },
              correctIndex: 0,
            },
            {
              question: { english: 'M1,000 at 10% compound interest. How much after Year 2?', sesotho: 'M1,000 ka phaello e kopaneng ea 10%. Ke bokae kamora Selemo 2?' },
              options: {
                english: ['M1,210', 'M1,100', 'M1,200'],
                sesotho: ['M1,210', 'M1,100', 'M1,200'],
              },
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════ GRADE 11 ═══════════
    grade11: {
      label: { english: 'Grade 11', sesotho: 'Kereiti 11' },
      age: { english: 'Age 16-17', sesotho: 'Lilemo tse 16-17' },
      icon: '💼',
      phase: 'application',
      modules: [
        {
          id: 'g11_planning',
          title: { english: 'Financial Planning', sesotho: 'Moralo oa Lichelete' },
          explanation: {
            english: 'Financial planning is setting financial goals and creating a strategy to achieve them.',
            sesotho: 'Moralo oa lichelete ke ho beha lipakane tsa lichelete le ho theha leano la ho li fihlela.',
          },
          example: {
            english: 'Goal: Save M5,000 for a laptop in 2 years. Save approximately M210 per month.',
            sesotho: 'Pakane: Boloka M5,000 bakeng sa laptop ka lilemo tse 2. Boloka hoo e ka bang M210 ka khoeli.',
          },
          quiz: [
            {
              question: { english: 'What is financial planning?', sesotho: 'Moralo oa lichelete ke eng?' },
              options: {
                english: ['Setting goals and creating a strategy', 'Spending all money', 'Borrowing more'],
                sesotho: ['Ho beha lipakane le ho theha leano', 'Ho sebelisa chelete eohle', 'Ho alima ho feta'],
              },
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════ GRADE 12 ═══════════
    grade12: {
      label: { english: 'Grade 12', sesotho: 'Kereiti 12' },
      age: { english: 'Age 17-18', sesotho: 'Lilemo tse 17-18' },
      icon: '💼',
      phase: 'application',
      modules: [
        {
          id: 'g12_entrepreneurship',
          title: { english: 'Entrepreneurship Basics', sesotho: 'Motheo oa Khoebo' },
          explanation: {
            english: 'Entrepreneurship is starting and running your own business. It requires planning, budgeting, and understanding money flow.',
            sesotho: 'Khoebo ke ho qala le ho tsamaisa khoebo ea hau. E hloka moralo, tekanyetso le ho utloisisa phallo ea chelete.',
          },
          example: {
            english: 'Sell 20 items at M15 each. Revenue = M300. Costs = M150. Profit = M150.',
            sesotho: 'Rekisa lintho tse 20 ka M15 e le \'ngoe. Chelete e kenang = M300. Litšenyehelo = M150. Phaello = M150.',
          },
          quiz: [
            {
              question: { english: 'If revenue is M300 and costs are M150, what is profit?', sesotho: 'Haeba chelete e kenang e le M300 le litšenyehelo e le M150, phaello ke bokae?' },
              options: {
                english: ['M150', 'M300', 'M450'],
                sesotho: ['M150', 'M300', 'M450'],
              },
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════ UNIVERSITY YEAR 1 ═══════════
    uni_1: {
      label: { english: 'University Year 1', sesotho: 'Univesithi Selemo 1' },
      age: { english: 'Age 18-19', sesotho: 'Lilemo tse 18-19' },
      icon: '🎓',
      phase: 'mastery',
      modules: [
        {
          id: 'uni1_student_budget',
          title: { english: 'Student Budgeting', sesotho: 'Tekanyetso ea Moithuti' },
          explanation: {
            english: 'University comes with new financial responsibilities. Creating a realistic budget is essential.',
            sesotho: 'Univesithi e tla le boikarabelo bo bocha ba lichelete. Ho theha tekanyetso ea nnete ho bohlokoa.',
          },
          example: {
            english: 'Monthly bursary M2,500: M1,000 accommodation, M700 food, M300 transport, M200 books, M200 savings, M100 emergency.',
            sesotho: 'Bursary ea khoeli M2,500: M1,000 bolulo, M700 lijo, M300 lipalangoang, M200 libuka, M200 poloko, M100 tšohanyetso.',
          },
          quiz: [
            {
              question: { english: 'What is the most important part of student budgeting?', sesotho: 'Ke eng karolo ea bohlokoa ea tekanyetso ea moithuti?' },
              options: {
                english: ['Planning expenses realistically', 'Spending everything', 'Ignoring costs'],
                sesotho: ['Ho rera litšenyehelo ka nnete', 'Ho sebelisa tsohle', 'Ho hlokomoloha litšenyehelo'],
              },
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════ UNIVERSITY YEAR 2 ═══════════
    uni_2: {
      label: { english: 'University Year 2', sesotho: 'Univesithi Selemo 2' },
      age: { english: 'Age 19-20', sesotho: 'Lilemo tse 19-20' },
      icon: '🎓',
      phase: 'mastery',
      modules: [
        {
          id: 'uni2_investing',
          title: { english: 'Introduction to Investing', sesotho: 'Kenyelletso ea Matsete' },
          explanation: {
            english: 'Investing is committing money to assets with the expectation of earning returns. Even small amounts can grow significantly over time.',
            sesotho: 'Matsete ke ho kenya chelete matlotlong ka tebello ea ho fumana phaello. Le chelete e nyane e ka hola haholo ha nako e ntse e ea.',
          },
          example: {
            english: 'Invest M500 monthly at 7% annual return for 10 years. You would accumulate approximately M87,000.',
            sesotho: 'Kenya M500 khoeli le khoeli ka phaello ea 7% ka selemo bakeng sa lilemo tse 10. U tla bokella hoo e ka bang M87,000.',
          },
          quiz: [
            {
              question: { english: 'What is investing?', sesotho: 'Matsete ke eng?' },
              options: {
                english: ['Committing money to earn returns', 'Spending money', 'Losing money'],
                sesotho: ['Ho kenya chelete ho fumana phaello', 'Ho sebelisa chelete', 'Ho lahleheloa ke chelete'],
              },
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════ UNIVERSITY YEAR 3 ═══════════
    uni_3: {
      label: { english: 'University Year 3', sesotho: 'Univesithi Selemo 3' },
      age: { english: 'Age 20-21', sesotho: 'Lilemo tse 20-21' },
      icon: '🎓',
      phase: 'mastery',
      modules: [
        {
          id: 'uni3_debt_management',
          title: { english: 'Managing Student Debt', sesotho: 'Ho Laola Likoloto tsa Moithuti' },
          explanation: {
            english: 'Student loans and debt require careful management. Understanding repayment terms, interest rates, and total cost is essential.',
            sesotho: 'Likoloto tsa moithuti li hloka taolo e hlokolosi. Ho utloisisa lipehelo tsa ho khutlisa, phaello le kakaretso ea litšenyehelo ho bohlokoa.',
          },
          example: {
            english: 'M15,000 loan at 10% annual interest over 3 years = total repayment of approximately M18,000.',
            sesotho: 'Kalimo ea M15,000 ka phaello ea 10% ka selemo nakong ea lilemo tse 3 = kakaretso ea tefo e ka bang M18,000.',
          },
          quiz: [
            {
              question: { english: 'What should you understand before taking a loan?', sesotho: 'U lokela ho utloisisa eng pele u alima chelete?' },
              options: {
                english: ['Interest rates and repayment terms', 'Nothing', 'Only the monthly payment'],
                sesotho: ['Phaello le lipehelo tsa ho khutlisa', 'Ha ho letho', 'Tefo ea khoeli feela'],
              },
              correctIndex: 0,
            },
          ],
        },
      ],
    },

    // ═══════════ UNIVERSITY YEAR 4 ═══════════
    uni_4: {
      label: { english: 'University Year 4 & Beyond', sesotho: 'Univesithi Selemo 4 le ho feta' },
      age: { english: 'Age 21+', sesotho: 'Lilemo tse 21+' },
      icon: '🎓',
      phase: 'mastery',
      modules: [
        {
          id: 'uni4_financial_independence',
          title: { english: 'Financial Independence', sesotho: 'Boikemelo ba Lichelete' },
          explanation: {
            english: 'Financial independence means having enough resources to support yourself without relying on others.',
            sesotho: 'Boikemelo ba lichelete bo bolela ho ba le lisebelisoa tse lekaneng tsa ho iphelisa ntle le ho itšetleha ka ba bang.',
          },
          example: {
            english: 'Building an emergency fund (3-6 months of expenses), investing consistently, and avoiding high-interest debt.',
            sesotho: 'Ho haha letlole la tšohanyetso (likhoeli tse 3-6 tsa litšenyehelo), ho kenya matsete khafetsa le ho qoba likoloto tse nang le phaello e phahameng.',
          },
          quiz: [
            {
              question: { english: 'What is financial independence?', sesotho: 'Boikemelo ba lichelete ke eng?' },
              options: {
                english: ['Having enough resources to support yourself', 'Relying on others', 'Having no money'],
                sesotho: ['Ho ba le lisebelisoa tse lekaneng tsa ho iphelisa', 'Ho itšetleha ka ba bang', 'Ho se na chelete'],
              },
              correctIndex: 0,
            },
          ],
        },
      ],
    },
  },

  gradeOptions: [
    { id: 'grade1', label: { english: 'Grade 1', sesotho: 'Kereiti 1' } },
    { id: 'grade2', label: { english: 'Grade 2', sesotho: 'Kereiti 2' } },
    { id: 'grade3', label: { english: 'Grade 3', sesotho: 'Kereiti 3' } },
    { id: 'grade4', label: { english: 'Grade 4', sesotho: 'Kereiti 4' } },
    { id: 'grade5', label: { english: 'Grade 5', sesotho: 'Kereiti 5' } },
    { id: 'grade6', label: { english: 'Grade 6', sesotho: 'Kereiti 6' } },
    { id: 'grade7', label: { english: 'Grade 7', sesotho: 'Kereiti 7' } },
    { id: 'grade8', label: { english: 'Grade 8', sesotho: 'Kereiti 8' } },
    { id: 'grade9', label: { english: 'Grade 9', sesotho: 'Kereiti 9' } },
    { id: 'grade10', label: { english: 'Grade 10', sesotho: 'Kereiti 10' } },
    { id: 'grade11', label: { english: 'Grade 11', sesotho: 'Kereiti 11' } },
    { id: 'grade12', label: { english: 'Grade 12', sesotho: 'Kereiti 12' } },
    { id: 'uni_1', label: { english: 'University Y1', sesotho: 'Uni Selemo 1' } },
    { id: 'uni_2', label: { english: 'University Y2', sesotho: 'Uni Selemo 2' } },
    { id: 'uni_3', label: { english: 'University Y3', sesotho: 'Uni Selemo 3' } },
    { id: 'uni_4', label: { english: 'University Y4+', sesotho: 'Uni Selemo 4+' } },
  ],

  fallbackResponse: {
    english: "I don't have a specific answer for that yet. Try asking about money, saving, budgeting, interest, loans, or investing!",
    sesotho: "Ha ke na karabo e tobileng ea seo hajoale. Leka ho botsa ka chelete, ho boloka, tekanyetso, phaello, likoloto, kapa matsete!",
  },

  ui: {
    english: {
      heroTitle: 'Learn Money. Build Your Future.',
      heroSubtitle: "LeSAH's financial literacy assistant grows with you — from Grade 1 to University and beyond.",
      inDevelopment: 'In Development',
      chooseGrade: 'What grade are you in?',
      languageLabel: 'Language:',
      english: 'English',
      sesotho: 'Sesotho',
      welcomeTitle: 'Ask me anything about money',
      welcomeSubtitle: 'I will explain things at your level. Try one of these questions:',
      inputPlaceholder: 'Ask about saving, budgeting, interest, loans...',
      send: 'Send',
      learnAbout: 'Learn about:',
      phaseLabel: 'Phase:',
      takeQuiz: 'Take Quiz',
      quizTitle: 'Quiz Time!',
      quizQuestion: 'Question',
      quizCorrect: 'Correct! 🎉',
      quizWrong: 'Not quite. The correct answer is:',
      quizNext: 'Next Question',
      quizFinish: 'Finish Quiz',
      quizScore: 'Your Score',
      quizRetry: 'Try Again',
      quizBack: 'Back to Learning',
    },
    sesotho: {
      heroTitle: 'Ithute ka Chelete. Haha Bokamoso ba Hau.',
      heroSubtitle: 'Mothusi oa LeSAH oa tsebo ea lichelete o hola le uena — ho tloha Kereiti 1 ho ea Univesithi le ho feta.',
      inDevelopment: 'E ntse e ntlafatsoa',
      chooseGrade: 'U se kereiting efe?',
      languageLabel: 'Puo:',
      english: 'English',
      sesotho: 'Sesotho',
      welcomeTitle: 'Mpotse eng kapa eng ka chelete',
      welcomeSubtitle: 'Ke tla hlalosa lintho boemong ba hau. Leka e \'ngoe ea lipotso tsena:',
      inputPlaceholder: 'Botsa ka ho boloka, tekanyetso, phaello, likoloto...',
      send: 'Romela',
      learnAbout: 'Ithute ka:',
      phaseLabel: 'Mokhahlelo:',
      takeQuiz: 'Nka Quiz',
      quizTitle: 'Nako ea Quiz!',
      quizQuestion: 'Potso',
      quizCorrect: 'Ho nepahetse! 🎉',
      quizWrong: 'Ha se hantle. Karabo e nepahetseng ke:',
      quizNext: 'Potso e latelang',
      quizFinish: 'Qetella Quiz',
      quizScore: 'Lintlha tsa hau',
      quizRetry: 'Leka Hape',
      quizBack: 'Khutlela Thutong',
    },
  },
};