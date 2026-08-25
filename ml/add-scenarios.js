const fs = require('fs');
const path = require('path');

const knowledge = JSON.parse(fs.readFileSync(path.join(__dirname, 'knowledge-rich.json'), 'utf-8'));

function bi(en, st) {
  return { english: en, sesotho: st };
}

// ============ SAVING SCENARIOS ============
knowledge.saving.scenarios = {
  primary: [
    {
      situation: bi('Mpho gets M20 pocket money. She wants to buy sweets (M5) and a toy (M15). Should she spend all or save some?', 'Mpho o fumana M20 ya pokotho. O batla ho reka dipompong (M5) le sebapadiswa (M15). Na o lokela ho sebedisa tsohle kapa ho boloka tse ding?'),
      advice: bi('Mpho should save at least M5. She can buy sweets and save the rest for the toy later.', 'Mpho o lokela ho boloka M5. A ka reka dipompong mme a boloke tse setseng bakeng sa sebapadiswa.'),
      lesson: bi('Always save something from what you receive.', 'Dula o boloka ho hong ho tswa ho seo o se fumanang.')
    },
    {
      situation: bi('Thabo wants a bicycle that costs M500. He gets M50 pocket money every week. How can he save for it?', 'Thabo o batla baesekele e bitsang M500. O fumana M50 ka beke. A ka e bolokela jwang?'),
      advice: bi('If Thabo saves M25 per week, he will have M500 in 20 weeks (5 months).', 'Haeba Thabo a boloka M25 ka beke, o tla ba le M500 ka dibeke tse 20 (dikgwedi tse 5).'),
      lesson: bi('Break big goals into smaller weekly savings.', 'Arola dipakane tse kgolo ka dipoloko tse nyane tsa beke.')
    }
  ],
  high_school: [
    {
      situation: bi('Lerato earns M600 monthly from part-time work. She spends everything on entertainment. What should she change?', 'Lerato o fumana M600 ka kgwedi mosebetsing wa nakwana. O sebedisa tsohle boithabisong. O lokela ho fetola eng?'),
      advice: bi('Lerato should save at least M120 (20%). She can still enjoy M480 for other things.', 'Lerato o lokela ho boloka M120 (20%). A ka ntsha M480 bakeng sa dintho tse ding.'),
      lesson: bi('Pay yourself first before spending on wants.', 'Itefe pele pele o sebedisa ditakatso.')
    },
    {
      situation: bi('A student gets a M1,000 gift. They want to buy a new phone (M800) and go out with friends (M200). Is this wise?', 'Moithuti o fumana mpho ya M1,000. O batla ho reka fono (M800) le ho ya le metswalle (M200). Na see se bohlale?'),
      advice: bi('Better plan: Save M300, spend M500 on phone, M200 for friends. Or save M500 and buy a cheaper phone.', 'Leano le betere: Boloka M300, sebedisa M500 fonong, M200 metswalle. Kapa boloka M500 mme o reke fono e theko e tlase.'),
      lesson: bi('Balance saving and spending, even with gift money.', 'Lekalekanya ho boloka le ho sebedisa, le ka chelete ya dimpho.')
    }
  ],
  university: [
    {
      situation: bi('A student receives M2,500 bursary monthly. Rent is M1,000, food M800, transport M300. How much should they save?', 'Moithuti o fumana bursary ya M2,500. Rente M1,000, dijo M800, dipalangwang M300. O lokela ho boloka bokae?'),
      advice: bi('After expenses: M400 remains. Save M300 and keep M100 for emergencies.', 'Kamora ditshenyehelo: M400 e setseng. Boloka M300 mme o boloke M100 bakeng sa tshohanyetso.'),
      lesson: bi('Always allocate surplus to savings before discretionary spending.', 'Dula o arola se setseng polokong pele o sebedisa.')
    },
    {
      situation: bi('A student has no savings and their laptop breaks. They need M3,000 urgently. What went wrong?', 'Moithuti ha a na poloko mme laptop ya hae e senyeha. O hloka M3,000 ka potlako. Ho senyehile eng?'),
      advice: bi('Without an emergency fund, unexpected expenses cause debt. Aim to save 3-6 months of expenses.', 'Ntle le letlole la tshohanyetso, ditshenyehelo tse sa lebellwang di baka sekoloto. Boloka dikgwedi tse 3-6 tsa ditshenyehelo.'),
      lesson: bi('Emergency funds prevent financial crises.', 'Matlole a tshohanyetso a thibela mathata.')
    }
  ]
};

// ============ MONEY SCENARIOS ============
knowledge.money.scenarios = {
  primary: [
    {
      situation: bi('You have M50. A bread costs M10. How many breads can you buy?', 'O na le M50. Bohobe bo bitsa M10. O ka reka mahobe a makae?'),
      advice: bi('M50 divided by M10 = 5 breads. You can buy 5 breads.', 'M50 arolwa ka M10 = mahobe a 5. O ka reka mahobe a 5.'),
      lesson: bi('Division helps you know how many things you can buy.', 'Ho arola ho o thusa ho tseba hore na o ka reka dintho tse kae.')
    },
    {
      situation: bi('A sweet costs M2. You have M10. How many sweets can you buy?', 'Pompong e bitsa M2. O na le M10. O ka reka dipompong tse kae?'),
      advice: bi('M10 divided by M2 = 5 sweets.', 'M10 arolwa ka M2 = dipompong tse 5.'),
      lesson: bi('Understanding prices helps you spend wisely.', 'Ho utlwisisa ditheko ho thusa ho sebedisa ka bohlale.')
    }
  ],
  high_school: [
    {
      situation: bi('You have M200. Transport costs M20 per day. How many days can you travel?', 'O na le M200. Dipalangwang di bitsa M20 ka letsatsi. O ka tsamaya matsatsi a makae?'),
      advice: bi('M200 divided by M20 = 10 days of transport.', 'M200 arolwa ka M20 = matsatsi a 10 a dipalangwang.'),
      lesson: bi('Budgeting daily expenses helps money last longer.', 'Ho rera ditshenyehelo tsa letsatsi ho thusa chelete ho tshwarella.')
    }
  ],
  university: [
    {
      situation: bi('At 6% inflation, M1,000 today will be worth how much in buying power next year?', 'Ka inflation ya 6%, M1,000 kajeno e tla ba le matla a ho reka a bokae selemong se tlang?'),
      advice: bi('M1,000 / 1.06 = approximately M943 purchasing power.', 'M1,000 / 1.06 = M943 matla a ho reka.'),
      lesson: bi('Inflation erodes purchasing power over time.', 'Inflation e fokotsa matla a ho reka ka nako.')
    }
  ]
};

// ============ BUDGETING SCENARIOS ============
knowledge.budgeting.scenarios = {
  primary: [
    {
      situation: bi('Palesa has M30. She needs bread (M10) and wants sweets (M25). Can she buy both?', 'Palesa o na le M30. O hloka bohobe (M10) mme o batla dipompong (M25). A ka reka ka bobeli?'),
      advice: bi('Bread + sweets = M35. She needs M5 more. She should prioritise bread (need) over sweets (want).', 'Bohobe + dipompong = M35. O hloka M5 e nngwe. O lokela ho beha bohobe (tlhoko) pele ho dipompong (takatso).'),
      lesson: bi('Needs come before wants when budgeting.', 'Ditlhoko di tla pele ho ditakatso.')
    }
  ],
  high_school: [
    {
      situation: bi('Tumelo earns M500 monthly. Expenses: transport M150, food M200, airtime M50, entertainment M150. Total = M550. What should change?', 'Tumelo o fumana M500. Ditshenyehelo: dipalangwang M150, dijo M200, airtime M50, boithabiso M150. Kakaretso = M550. Ho lokela ho fetoha eng?'),
      advice: bi('He overspends by M50. Cut entertainment from M150 to M100.', 'O sebedisa M50 ho feta. Fokotsa boithabiso ho tloha M150 ho ya M100.'),
      lesson: bi('When expenses exceed income, reduce wants first.', 'Ha ditshenyehelo di feta moputso, fokotsa ditakatso pele.')
    }
  ],
  university: [
    {
      situation: bi('A student has M3,000 monthly. Fixed: rent M1,200, utilities M300, food M800. Variable: transport M300, entertainment M300. What is the savings potential?', 'Moithuti o na le M3,000. E sa fetoheng: rente M1,200, motlakase M300, dijo M800. E fetohang: dipalangwang M300, boithabiso M300. Poloko e ka ba bokae?'),
      advice: bi('Total expenses = M2,900. Savings potential = M100. Reduce entertainment to M200 to save M200.', 'Kakaretso = M2,900. Poloko = M100. Fokotsa boithabiso ho M200 ho boloka M200.'),
      lesson: bi('Small adjustments in variable expenses increase savings.', 'Diphetoho tse nyane ditshenyehelong di eketsa poloko.')
    }
  ]
};

// ============ INTEREST SCENARIOS ============
knowledge.interest.scenarios = {
  primary: [
    {
      situation: bi('You save M100 at 5% interest. After one year, how much do you have?', 'O boloka M100 ka 5%. Kamora selemo, o na le bokae?'),
      advice: bi('M100 x 5% = M5 interest. Total = M105.', 'M100 x 5% = M5 phaello. Kakaretso = M105.'),
      lesson: bi('Interest is extra money on your savings.', 'Phaello ke chelete e eketsehileng polokong.')
    }
  ],
  high_school: [
    {
      situation: bi('You borrow M1,000 at 10% annual interest for 2 years. What is the total repayment?', 'O alima M1,000 ka 10% ka selemo dilemo tse 2. Kakaretso ya tefo ke bokae?'),
      advice: bi('Interest = M1,000 x 10% x 2 = M200. Total = M1,200.', 'Phaello = M1,000 x 10% x 2 = M200. Kakaretso = M1,200.'),
      lesson: bi('The longer you borrow, the more interest you pay.', 'Ha o alima nako e telele, o lefa phaello e ngata.')
    }
  ],
  university: [
    {
      situation: bi('You have M5,000 to save. Bank A offers 5% simple interest. Bank B offers 4.8% compound interest. Which is better after 5 years?', 'O na le M5,000 ho boloka. Banka A e fana ka 5% simple. Banka B e fana ka 4.8% compound. E feng e betere kamora dilemo tse 5?'),
      advice: bi('Bank A: M5,000 + (M5,000 x 5% x 5) = M6,250. Bank B: M5,000 x (1.048)^5 = M6,317. Bank B is better.', 'Banka A: M6,250. Banka B: M6,317. Banka B e betere.'),
      lesson: bi('Compound interest beats simple interest over time.', 'E kopaneng e feta e bonolo ka nako.')
    }
  ]
};

// ============ LOANS SCENARIOS ============
knowledge.loans.scenarios = {
  primary: [
    {
      situation: bi('Your friend borrows M20 and promises to pay back M25 next week. Is this a good deal for you?', 'Motswalle o alima M20 mme o tshepisa ho kgutlisa M25 bekeng e tlang. Na ke ntho e ntle?'),
      advice: bi('Yes, M5 extra is interest. But always be careful lending to friends.', 'E, M5 e eketsehileng ke phaello. Empa dula o hlokolosi ha o alima metswalle.'),
      lesson: bi('Interest is earned when you lend money too.', 'Phaello e fumanwa le ha o alima chelete.')
    }
  ],
  high_school: [
    {
      situation: bi('You need M5,000 for school fees. Two options: Borrow from bank at 8% for 1 year, or from a loan shark at 30% for 6 months. Which is safer?', 'O hloka M5,000 bakeng sa ditefello. Banka 8% selemo, kapa loan shark 30% dikgwedi tse 6. E feng e bolokehileng?'),
      advice: bi('Bank: M5,400 total. Loan shark: M5,750 total. Bank is cheaper and safer.', 'Banka: M5,400. Loan shark: M5,750. Banka e theko e tlase le e bolokehileng.'),
      lesson: bi('Avoid loan sharks with extremely high interest rates.', 'Qoba loan sharks tse nang le diphaello tse phahameng haholo.')
    }
  ],
  university: [
    {
      situation: bi('You graduate with M20,000 student loan at 10% over 5 years. Monthly payment is M425. Is this manageable on a M4,000 salary?', 'O qeta ka kalimo ya M20,000 ka 10% dilemo tse 5. Tefo ya kgwedi M425. Na see se a kgoneha ka moputso wa M4,000?'),
      advice: bi('M425 is about 10.6% of income — manageable. But reduce other expenses.', 'M425 ke 10.6% ya moputso — ea kgoneha. Empa fokotsa ditshenyehelo tse ding.'),
      lesson: bi('Keep debt payments under 15% of monthly income.', 'Boloka ditefo tsa molato ka tlasa 15% ya moputso.')
    }
  ]
};

// ============ INCOME SCENARIOS ============
knowledge.income.scenarios = {
  primary: [
    {
      situation: bi('You earn M10 helping a neighbour. Should you spend it all or save some?', 'O fumana M10 ka ho thusa moahelani. O sebedise tsohle kapa o boloke tse ding?'),
      advice: bi('Save M3 and spend M7. Always save something from what you earn.', 'Boloka M3 mme o sebedise M7. Dula o boloka ho tswa ho seo o se fumanang.'),
      lesson: bi('Saving from income builds good habits.', 'Ho boloka ho tswa moputsong ho haha ditlwaelo.')
    }
  ],
  high_school: [
    {
      situation: bi('You can tutor for M50/hour (5 hours/week) or work at a shop for M25/hour (10 hours/week). Which earns more?', 'O ka ruta ka M50/ka hora (dihora tse 5) kapa lebenkeleng ka M25/ka hora (dihora tse 10). Ke efe e fumanang ho feta?'),
      advice: bi('Tutoring: M250/week. Shop: M250/week. Same! But tutoring uses less time.', 'Ho ruta: M250/ka beke. Lebenkele: M250/ka beke. Hoa tshwana! Empa ho ruta ho sebedisa nako e nyane.'),
      lesson: bi('Higher hourly rate means more free time.', 'Phaello e phahameng ka hora e bolela nako e ngata ya phomolo.')
    }
  ],
  university: [
    {
      situation: bi('You have two income options: Fixed job M2,000/month or freelance averaging M2,500/month but irregular. Which is safer?', 'O na le dikgetho tse pedi: Mosebetsi o tsitsitseng M2,000/kgwedi kapa freelance M2,500/kgwedi empa e sa tshwarahala. E feng e bolokehileng?'),
      advice: bi('Fixed job is more stable for budgeting. Freelance offers more but riskier.', 'Mosebetsi o tsitsitseng o bolokehile bakeng sa tekanyetso. Freelance e fana ka ho feta empa e kotsi.'),
      lesson: bi('Stable income makes budgeting easier.', 'Moputso o tsitsitseng o etsa tekanyetso e be bonolo.')
    }
  ]
};

// ============ BANKING SCENARIOS ============
knowledge.banking.scenarios = {
  primary: [
    {
      situation: bi('You have M100. Should you keep it under your mattress or in a bank?', 'O na le M100. O e boloke kapa bankeng?'),
      advice: bi('Bank! Money in a bank is safer and earns interest.', 'Banka! Chelete bankeng e bolokehile le ho fumana phaello.'),
      lesson: bi('Banks are safer than keeping money at home.', 'Dibanka di bolokehile ho feta ho boloka chelete lapeng.')
    }
  ],
  high_school: [
    {
      situation: bi('Bank A: no monthly fee, 1% interest. Bank B: M10 monthly fee, 4% interest. You have M500. Which is better after 1 year?', 'Banka A: ha e lefise, 1% phaello. Banka B: M10 kgwedi, 4% phaello. O na le M500. E feng e betere kamora selemo?'),
      advice: bi('Bank A: M505. Bank B: M520 - M120 fees = M400. Bank A is better for M500.', 'Banka A: M505. Banka B: M520 - M120 = M400. Banka A e betere.'),
      lesson: bi('Fees can eat your interest. Always calculate total cost.', 'Ditefiso di ka ja phaello. Dula o bala kakaretso.')
    }
  ],
  university: [
    {
      situation: bi('You receive M1,000 via mobile money. Transfer to bank costs M20. Is this worth it to earn 5% annual interest?', 'O fumana M1,000 ka mobile money. Ho romella bankeng M20. Na ho bohlokwa ho fumana 5% phaello?'),
      advice: bi('5% on M1,000 = M50 interest. Transfer M20. Net = M30. Yes, worth it if held for a year.', '5% ho M1,000 = M50. Transfer M20. Net = M30. E, ho bohlokwa haeba e bolokilwe selemo.'),
      lesson: bi('Calculate net returns after fees.', 'Bala phaello kamora ditefiso.')
    }
  ]
};

// ============ NEEDS_WANTS SCENARIOS ============
knowledge.needs_wants.scenarios = {
  primary: [
    {
      situation: bi('You have M50. School shoes (M40) are worn out. You also want a new toy (M45). Which do you buy?', 'O na le M50. Dieta tsa sekolo (M40) di senyehile. O batla le sebapadiswa (M45). O reka sefe?'),
      advice: bi('School shoes are a NEED. The toy is a WANT. Buy the shoes.', 'Dieta tsa sekolo ke TLHOKO. Sebapadiswa ke TAKATSO. Reka dieta.'),
      lesson: bi('Needs always come before wants.', 'Ditlhoko di tla pele ho ditakatso kamehla.')
    }
  ],
  high_school: [
    {
      situation: bi('Your phone breaks and you need it for school communication. A basic phone costs M300. A smartphone costs M1,000. Which?', 'Fono ya hao e senyehile mme o e hloka bakeng sa sekolo. E bonolo M300. Smartphone M1,000. E feng?'),
      advice: bi('Basic phone meets the need. Smartphone is a want unless you have extra money.', 'Fono e bonolo e fihlella tlhoko. Smartphone ke takatso ntle le chelete e eketsehileng.'),
      lesson: bi('Meeting needs does not require the most expensive option.', 'Ho fihlella ditlhoko ha ho hloke ntho e turang haholo.')
    }
  ],
  university: [
    {
      situation: bi('You need a laptop for studies. Options: New MacBook M15,000 or used laptop M4,000 that meets requirements. Which?', 'O hloka laptop bakeng sa dithuto. MacBook M15,000 kapa e sebedisitsweng M4,000. E feng?'),
      advice: bi('Used laptop meets the need at 73% less cost. Invest the M11,000 difference.', 'E sebedisitsweng e fihlella tlhoko ka 73% e theko e tlase. Boloka M11,000 e setseng.'),
      lesson: bi('Meeting needs smartly frees money for savings and investments.', 'Ho fihlella ditlhoko ka bohlale ho lokolla chelete bakeng sa poloko.')
    }
  ]
};

// ============ GREETING SCENARIOS ============
knowledge.greeting.scenarios = {
  primary: [
    {
      situation: bi('You want to learn about money. What should you ask LeSAH first?', 'O batla ho ithuta ka chelete. O botse LeSAH eng pele?'),
      advice: bi('Try asking: What is saving?', 'Leka ho botsa: Ho boloka ke eng?'),
      lesson: bi('Asking questions is the first step to learning.', 'Ho botsa ke mohato wa pele wa ho ithuta.')
    }
  ],
  high_school: [
    {
      situation: bi('You have questions about managing your M500 monthly allowance. What should you ask?', 'O na le dipotso ka ho laola M500 ya kgwedi. O botse eng?'),
      advice: bi('Ask: How do I create a budget for M500?', 'Botsa: Ke etsa tekanyetso ya M500 jwang?'),
      lesson: bi('Specific questions get better answers.', 'Dipotso tse hlakileng di fumana dikarabo tse betere.')
    }
  ],
  university: [
    {
      situation: bi('You want to start investing but do not know where to begin. What should you ask?', 'O batla ho qala matsete empa ha o tsebe moo o qalang. O botse eng?'),
      advice: bi('Ask: What is the best investment strategy for beginners?', 'Botsa: Leano le molemohali la matsete ke lefe?'),
      lesson: bi('Start with education before investing money.', 'Qala ka thuto pele o kenya chelete.')
    }
  ]
};

// Save
fs.writeFileSync(
  path.join(__dirname, 'knowledge-rich.json'),
  JSON.stringify(knowledge, null, 2)
);

console.log('Added scenarios to all topics!');
console.log('Topics:', Object.keys(knowledge).join(', '));