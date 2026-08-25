const fs = require('fs');
const path = require('path');

const knowledge = JSON.parse(fs.readFileSync(path.join(__dirname, 'knowledge-rich.json'), 'utf-8'));

function bi(en, st) {
  return { english: en, sesotho: st };
}

// ============ COMPARISONS ============
// These answer "what's the difference between X and Y?"

knowledge.comparisons = {
  saving_vs_investing: {
    primary: bi(
      'Saving is keeping money safe. Investing is using money to try to make more money.',
      'Ho boloka ke ho boloka chelete e sireletsehile. Matsete ke ho sebedisa chelete ho leka ho etsa e ngata.'
    ),
    high_school: bi(
      'Saving has low risk but low returns. Investing has higher risk but potentially higher returns.',
      'Ho boloka ho na le kotsi e tlase empa phaello e tlase. Matsete a na le kotsi e kgolo empa phaello e ka ba kgolo.'
    ),
    university: bi(
      'Saving preserves capital with minimal risk (e.g., 3-5% interest). Investing deploys capital for growth (e.g., 7-12% returns) with market risk.',
      'Ho boloka ho boloka chelete ka kotsi e nyane (3-5%). Matsete a sebedisa chelete bakeng sa kgolo (7-12%) ka kotsi ya mmaraka.'
    )
  },
  needs_vs_wants: {
    primary: bi(
      'Needs are things you MUST have to live. Wants are things you would LIKE but can live without.',
      'Ditlhoko ke tseo o T LAMEHANG ho ba le tsona. Ditakatso ke tseo o ka phelang ntle le tsona.'
    ),
    high_school: bi(
      'Needs are essential for survival and wellbeing. Wants improve quality of life but are optional.',
      'Ditlhoko di bohlokwa bakeng sa ho phela. Ditakatso di ntlafatsa bophelo empa ke tsa boikgethelo.'
    ),
    university: bi(
      'Needs are non-discretionary (rent, food, healthcare). Wants are discretionary (entertainment, luxury items).',
      'Ditlhoko ha di qojwe (rente, dijo). Ditakatso ke tsa boikgethelo (boithabiso).'
    )
  },
  simple_vs_compound_interest: {
    primary: bi(
      'Simple interest is calculated once on your starting money. Compound interest is calculated on your money PLUS the interest you earned.',
      'E bonolo e balwa hanngwe hodima chelete ya hao. E kopaneng e balwa hodima chelete LE phaello e fumanweng.'
    ),
    high_school: bi(
      'Simple interest: I = P x r x t (principal only). Compound interest: A = P(1+r)^n (principal + accumulated interest).',
      'E bonolo: I = P x r x t. E kopaneng: A = P(1+r)^n.'
    ),
    university: bi(
      'Simple interest grows linearly. Compound interest grows exponentially — this is why it accelerates wealth building.',
      'E bonolo e hola ka mokgwa o otlolohileng. E kopaneng e hola ka exponentially.'
    )
  },
  loan_vs_gift: {
    primary: bi(
      'A loan must be paid back. A gift is free and does not need to be returned.',
      'Kalimo e tlameha ho kgutliswa. Mpho ke ya mahala mme ha e kgutliswe.'
    ),
    high_school: bi(
      'A loan is borrowed money with repayment obligation. A gift has no repayment requirement.',
      'Kalimo ke chelete e alimilweng e hlokang ho kgutliswa. Mpho ha e hloke ho kgutliswa.'
    ),
    university: bi(
      'Loans create debt obligations with interest. Gifts are transfers without reciprocal obligation.',
      'Dikoloto di bopa boitlamo le phaello. Dimpho ke phetiso ntle le boitlamo.'
    )
  },
  bank_vs_mobile_money: {
    primary: bi(
      'A bank is a building where you keep money. Mobile money is on your phone.',
      'Banka ke moaho moo o bolokang chelete. Mobile money e fonong ya hao.'
    ),
    high_school: bi(
      'Banks offer more services (loans, interest) but may have fees. Mobile money is convenient but has transfer fees.',
      'Dibanka di fana ka ditshebeletso tse ngata empa di lefisa. Mobile money e bonolo empa e na le ditefiso.'
    ),
    university: bi(
      'Banks are regulated financial institutions with deposit insurance. Mobile money operators are telecom-based with different regulations.',
      'Dibanka di laolwa ka molao. Mobile money e itshetlehile ho telecom.'
    )
  },
  income_vs_profit: {
    primary: bi(
      'Income is money you receive. Profit is money left after paying costs.',
      'Moputso ke chelete eo o e fumanang. Phaello ke chelete e setseng kamora ho lefa ditshenyehelo.'
    ),
    high_school: bi(
      'Income is total money received. Profit = Income - Expenses.',
      'Moputso ke kakaretso e fumanweng. Phaello = Moputso - Ditshenyehelo.'
    ),
    university: bi(
      'Income (revenue) is the top line. Profit is the bottom line after all costs, taxes, and expenses.',
      'Moputso ke top line. Phaello ke bottom line kamora ditshenyehelo tsohle.'
    )
  }
};

// ============ LEARNING PATHS ============
// This defines what to learn next after mastering each topic

knowledge.learning_paths = {
  saving: [
    bi('Budgeting', 'Tekanyetso'),
    bi('Interest', 'Phaello'),
    bi('Investing', 'Matsete')
  ],
  money: [
    bi('Saving', 'Ho boloka'),
    bi('Budgeting', 'Tekanyetso'),
    bi('Banking', 'Banka')
  ],
  budgeting: [
    bi('Saving', 'Ho boloka'),
    bi('Needs & Wants', 'Ditlhoko le Ditakatso'),
    bi('Income', 'Moputso')
  ],
  interest: [
    bi('Loans', 'Dikoloto'),
    bi('Investing', 'Matsete'),
    bi('Saving', 'Ho boloka')
  ],
  loans: [
    bi('Interest', 'Phaello'),
    bi('Budgeting', 'Tekanyetso'),
    bi('Income', 'Moputso')
  ],
  income: [
    bi('Budgeting', 'Tekanyetso'),
    bi('Saving', 'Ho boloka'),
    bi('Investing', 'Matsete')
  ],
  banking: [
    bi('Saving', 'Ho boloka'),
    bi('Interest', 'Phaello'),
    bi('Loans', 'Dikoloto')
  ],
  needs_wants: [
    bi('Budgeting', 'Tekanyetso'),
    bi('Saving', 'Ho boloka'),
    bi('Income', 'Moputso')
  ]
};

// ============ EMERGENCY SCENARIOS ============
// Real concerns students have

knowledge.emergency_scenarios = {
  lost_bursary: {
    situation: bi(
      'A student loses their bursary due to academic performance. They have M1,000 saved and monthly expenses of M1,500. What should they do?',
      'Moithuti o lahlehetswe ke bursary. O na le M1,000 e bolokilweng le ditshenyehelo tsa M1,500 ka kgwedi. O etse eng?'
    ),
    advice: bi(
      'First, cut all non-essential spending. Find part-time work quickly. Apply for other funding. The M1,000 is a buffer for 2-3 weeks.',
      'Pele, fokotsa tshebediso e sa hlokahaleng. Fumana mosebetsi wa nakwana. Kopa dithuso tse ding. M1,000 ke buffer ya dibeke tse 2-3.'
    ),
    lesson: bi('Emergency funds buy you time during crises.', 'Matlole a tshohanyetso a o reka nako mathateng.')
  },
  friend_borrowing: {
    situation: bi(
      'A friend asks to borrow M200 and promises to repay next month. You know they already owe others money. What should you do?',
      'Motswalle o kopa M200 mme o tshepisa ho kgutlisa kgwedi e tlang. O tseba hore o se a kolota batho ba bang. O etse eng?'
    ),
    advice: bi(
      'Politely decline or lend only what you can afford to lose. Never lend money you need for your own expenses.',
      'Hana ka mosa kapa alima feela seo o ka se lahlehelwang. O se ke wa alima chelete eo o e hlokang.'
    ),
    lesson: bi('Protect your financial wellbeing, even with friends.', 'Sireletsa bophelo ba hao ba lichelete, le ho metswalle.')
  },
  overspending: {
    situation: bi(
      'You spent M400 on entertainment and now have only M100 for food for two weeks. What went wrong and how do you fix it?',
      'O sebedisitse M400 boithabisong mme o setse le M100 bakeng sa dijo dibeke tse pedi. Ho senyehile eng?'
    ),
    advice: bi(
      'You prioritized wants over needs. Fix: Buy basic food (rice, mealie meal). Avoid entertainment until next month.',
      'O behile ditakatso pele ho ditlhoko. Fix: Reka dijo tsa motheo. Qoba boithabiso ho fihlela kgwedi e tlang.'
    ),
    lesson: bi('Always budget for needs before spending on wants.', 'Dula o rera ditlhoko pele o sebedisa ditakatso.')
  },
  unexpected_expense: {
    situation: bi(
      'Your phone breaks and you need it for school. Repairs cost M500 but you only have M200 saved.',
      'Fono ya hao e senyehile mme o e hloka bakeng sa sekolo. Ho lokisa M500 empa o bolokile M200 feela.'
    ),
    advice: bi(
      'This is why emergency funds matter. Borrow M300 from family (interest-free) or find temporary work. Next time, save more.',
      'Ke ka hona matlole a tshohanyetso a le bohlokwa. Alima M300 lelapeng kapa fumana mosebetsi wa nakwana.'
    ),
    lesson: bi('Emergency funds should cover unexpected repairs.', 'Matlole a tshohanyetso a lokela ho akaretsa ditokiso tse sa lebellwang.')
  }
};

// Save
fs.writeFileSync(
  path.join(__dirname, 'knowledge-rich.json'),
  JSON.stringify(knowledge, null, 2)
);

console.log('Added comparisons, learning paths, and emergency scenarios!');
console.log('Knowledge base now includes:');
console.log('- 9 topics with full definitions, examples, misconceptions');
console.log('- how_to and why for each topic');
console.log('- Scenarios for real student situations');
console.log('- Comparisons for "what is the difference" questions');
console.log('- Learning paths for guided progression');
console.log('- Emergency scenarios for crisis management');