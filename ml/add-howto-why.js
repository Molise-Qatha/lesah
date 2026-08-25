const fs = require('fs');
const path = require('path');

// Load existing knowledge
const knowledge = JSON.parse(fs.readFileSync(path.join(__dirname, 'knowledge-rich.json'), 'utf-8'));

function bi(en, st) {
  return { english: en, sesotho: st };
}

// ============ SAVING ============
knowledge.saving.how_to = {
  primary: [
    bi('Put money in a piggy bank every time you get some.', 'Kenya chelete ka piggy bank nako le nako ha o e fumana.'),
    bi('Ask your parents to help you open a savings jar.', 'Kopa batswadi ho o thusa ho bula jar ya poloko.'),
    bi('Start with M1 or M2. Even small amounts count!', 'Qala ka M1 kapa M2. Le tjhelete e nyane e a balwa!')
  ],
  high_school: [
    bi('Set a savings goal, then save a fixed amount each month.', 'Beha pakane ya poloko, ebe o boloka tjhelete e behilweng kgwedi le kgwedi.'),
    bi('Open a bank savings account and deposit regularly.', 'Bula akhaonto ya poloko bankeng mme o kene kgafetsa.'),
    bi('Use the 50/30/20 rule: save 20 percent of income.', 'Sebedisa molao wa 50/30/20: boloka 20% ya moputso.')
  ],
  university: [
    bi('Automate your savings through a standing order.', 'Etsa hore poloko e itsamaele ka standing order.'),
    bi('Build an emergency fund with 3-6 months of expenses.', 'Haha letlole la tshohanyetso ka dikgwedi tse 3-6.'),
    bi('Track expenses and identify areas to reduce spending.', 'Latela ditshenyehelo mme o bone moo o ka fokotsang.')
  ]
};
knowledge.saving.why = {
  primary: [
    bi('Saving helps you buy things you really want later.', 'Ho boloka ho o thusa ho reka dintho tseo o di batlang hamorao.'),
    bi('Saving keeps your money safe for the future.', 'Ho boloka ho boloka chelete e sireletsehile bakeng sa bokamoso.'),
    bi('When you save, you always have money for emergencies.', 'Ha o boloka, o dula o na le chelete ya tshohanyetso.')
  ],
  high_school: [
    bi('Saving builds financial security and peace of mind.', 'Ho boloka ho haha tshireletso ya lichelete le kgotso.'),
    bi('Saving helps you achieve goals like buying a laptop.', 'Ho boloka ho thusa ho fihlela dipakane tse kang ho reka laptop.'),
    bi('Saving prevents debt when unexpected expenses arise.', 'Ho boloka ho thibela sekoloto ha ditshenyehelo tse sa lebellwang di hlaha.')
  ],
  university: [
    bi('Saving provides capital for investments and wealth building.', 'Ho boloka ho fana ka motheo wa matsete le ho haha maruo.'),
    bi('An emergency fund prevents financial crises.', 'Letlole la tshohanyetso le thibela mathata a lichelete.'),
    bi('Saving creates financial independence and options.', 'Ho boloka ho bopa boikemelo ba lichelete le dikgetho.')
  ]
};

// ============ MONEY ============
knowledge.money.how_to = {
  primary: [
    bi('Count your coins and notes to know how much you have.', 'Bala ditjhepe le dipampiri ho tseba hore na o na le bokae.'),
    bi('Learn that M1 equals 100 Lisente.', 'Ithute hore M1 e lekana le Lisente tse 100.'),
    bi('Practice buying small things to understand prices.', 'Ikwetlise ho reka dintho tse nyane ho utlwisisa ditheko.')
  ],
  high_school: [
    bi('Understand that the Loti is pegged to the Rand.', 'Utlwisisa hore Loti e hokahane le Rand.'),
    bi('Track how much money comes in and goes out.', 'Latela chelete e kenang le e tswang.'),
    bi('Learn about inflation and purchasing power.', 'Ithute ka inflation le matla a ho reka.')
  ],
  university: [
    bi('Understand monetary policy and the Common Monetary Area.', 'Utlwisisa leano la lichelete le Common Monetary Area.'),
    bi('Analyze how digital money affects financial inclusion.', 'Hlahloba kamoo chelete ya dijithale e amang ho kenyelletswa.'),
    bi('Study the money multiplier and fractional reserve banking.', 'Ithute ka money multiplier le fractional reserve banking.')
  ]
};
knowledge.money.why = {
  primary: [
    bi('We need money to buy food, clothes, and other things.', 'Re hloka chelete ho reka dijo, diaparo le dintho tse ding.'),
    bi('Money helps us trade fairly.', 'Chelete e re thusa ho rekisana ka toka.'),
    bi('Understanding money helps you make good choices.', 'Ho utlwisisa chelete ho thusa ho etsa dikgetho tse ntle.')
  ],
  high_school: [
    bi('Money makes trade efficient.', 'Chelete e etsa kgwebo e be bonolo.'),
    bi('Understanding money helps you manage finances.', 'Ho utlwisisa chelete ho thusa ho laola lichelete.'),
    bi('The Loti-Rand peg stabilizes the economy.', 'Peg ya Loti le Rand e tsitsisa moruo.')
  ],
  university: [
    bi('Money serves as store of value and unit of account.', 'Chelete e boloka boleng le ho metha boleng.'),
    bi('Monetary policy affects inflation and growth.', 'Leano la lichelete le ama inflation le kgolo.'),
    bi('Digital money is transforming financial services.', 'Chelete ya dijithale e fetola ditshebeletso.')
  ]
};

// ============ BUDGETING ============
knowledge.budgeting.how_to = {
  primary: [
    bi('Divide your money into Spend, Save, and Give.', 'Arola chelete ka Sebedisa, Boloka le Fana.'),
    bi('Use three jars or envelopes for your money.', 'Sebedisa linkho kapa di-enfelopo tse tharo.'),
    bi('Write down what you want to buy and check if you have enough.', 'Ngola seo o batlang ho se reka mme o hlahlobe.')
  ],
  high_school: [
    bi('List all income and expenses for one month.', 'Ngola moputso le ditshenyehelo tsohle tsa kgwedi.'),
    bi('Categorize expenses: needs, wants, savings.', 'Arola ditshenyehelo: ditlhoko, ditakatso, poloko.'),
    bi('Adjust spending to not exceed income.', 'Fetola tshebediso ho se fete moputso.')
  ],
  university: [
    bi('Use zero-based budgeting or the 50/30/20 rule.', 'Sebedisa zero-based kapa molao wa 50/30/20.'),
    bi('Track every Maloti and review monthly.', 'Latela Maloti a mang le a mang kgwedi le kgwedi.'),
    bi('Build an emergency fund into your budget.', 'Kenyelletsa letlole la tshohanyetso tekanyetsong.')
  ]
};
knowledge.budgeting.why = {
  primary: [
    bi('A budget helps you know where your money goes.', 'Tekanyetso e o thusa ho tseba moo chelete e yang.'),
    bi('Budgeting helps you save for things you want.', 'Tekanyetso e thusa ho bolokela dintho tseo o di batlang.'),
    bi('A budget stops you from running out of money.', 'Tekanyetso e thibela ho felloa ke chelete.')
  ],
  high_school: [
    bi('Budgeting prevents overspending and debt.', 'Tekanyetso e thibela ho sebedisa ho feta le sekoloto.'),
    bi('A budget helps you achieve financial goals.', 'Tekanyetso e thusa ho fihlela dipakane.'),
    bi('Budgeting gives you control over your money.', 'Tekanyetso e o fa taolo hodima chelete.')
  ],
  university: [
    bi('Budgeting optimizes resource allocation.', 'Tekanyetso e ntlafatsa ho arola mehlodi.'),
    bi('A budget provides visibility into cash flow.', 'Tekanyetso e fana ka ponahalo ya phallo.'),
    bi('Budgeting is the foundation of financial planning.', 'Tekanyetso ke motheo wa moralo wa lichelete.')
  ]
};

// ============ INTEREST ============
knowledge.interest.how_to = {
  primary: [
    bi('Save money in a bank to earn interest.', 'Boloka chelete bankeng ho fumana phaello.'),
    bi('Ask the bank about interest rates.', 'Botsa banka ka diphaello.'),
    bi('Leave your savings untouched to earn more.', 'Tlohela poloko e sa amehe ho fumana phaello e ngata.')
  ],
  high_school: [
    bi('Compare interest rates from different banks.', 'Bapisa diphaello tsa dibanka.'),
    bi('Understand simple vs compound interest.', 'Utlwisisa phapang ya phaello e bonolo le e kopaneng.'),
    bi('Calculate interest using I = P x r x t.', 'Bala phaello ka I = P x r x t.')
  ],
  university: [
    bi('Use compound interest formula A = P(1+r)^n.', 'Sebedisa A = P(1+r)^n.'),
    bi('Calculate effective annual rate for comparison.', 'Bala effective annual rate.'),
    bi('Use Rule of 72 to estimate doubling time.', 'Sebedisa Molao wa 72.')
  ]
};
knowledge.interest.why = {
  primary: [
    bi('Interest is a reward for saving your money.', 'Phaello ke moputso wa ho boloka.'),
    bi('Interest makes your money grow over time.', 'Phaello e holisa chelete ka nako.'),
    bi('Saving in a bank is better than keeping money at home.', 'Ho boloka bankeng ho molemo ho feta lapeng.')
  ],
  high_school: [
    bi('Compound interest accelerates wealth building.', 'E kopaneng e potlakisa ho haha maruo.'),
    bi('Understanding interest helps borrowing decisions.', 'Ho utlwisisa phaello ho thusa ho alima.'),
    bi('Interest rates affect savings and loans.', 'Diphaello di ama poloko le dikoloto.')
  ],
  university: [
    bi('Interest represents the time value of money.', 'Phaello e emela boleng ba nako.'),
    bi('Real interest rates account for inflation.', 'Phaello ya nnete e balela inflation.'),
    bi('Interest knowledge is essential for investing.', 'Tsebo ya phaello e bohlokwa matseteng.')
  ]
};

// ============ LOANS ============
knowledge.loans.how_to = {
  primary: [
    bi('Always ask a parent or teacher before borrowing.', 'Dula o botsa motswadi pele o alima.'),
    bi('Only borrow what you can pay back.', 'Alima feela seo o ka se kgutlisang.'),
    bi('Pay back loans as soon as you can.', 'Kgutlisa dikoloto kapele.')
  ],
  high_school: [
    bi('Compare loan offers from different lenders.', 'Bapisa dikoloto tsa ba alimang.'),
    bi('Understand total cost including interest and fees.', 'Utlwisisa theko yohle le ditefiso.'),
    bi('Read loan terms carefully before signing.', 'Bala dipehelo ka hloko pele o saena.')
  ],
  university: [
    bi('Calculate debt-to-income ratio before borrowing.', 'Bala debt-to-income ratio pele o alima.'),
    bi('Understand amortization schedules.', 'Utlwisisa amortization.'),
    bi('Explore income-based repayment options.', 'Hlahloba ditefo tse itshetlehileng moputsong.')
  ]
};
knowledge.loans.why = {
  primary: [
    bi('Understanding loans helps you avoid debt problems.', 'Ho utlwisisa ho qoba mathata a molato.'),
    bi('Always repay loans to build trust.', 'Dula o kgutlisa ho haha tshepo.'),
    bi('Borrowing wisely can help you achieve goals.', 'Ho alima ka bohlale ho thusa dipakane.')
  ],
  high_school: [
    bi('Loans can help pay for education.', 'Dikoloto di thusa ho lefella thuto.'),
    bi('Understanding loans prevents mistakes.', 'Ho utlwisisa ho thibela diphoso.'),
    bi('Good debt vs bad debt matters.', 'Molato o motle vs o mobe o bohlokwa.')
  ],
  university: [
    bi('Loans enable education and business investment.', 'Dikoloto di dumella thuto le kgwebo.'),
    bi('Understanding terms prevents predatory lending.', 'Ho utlwisisa ho thibela ho alima ka bomadimabe.'),
    bi('Debt management is key to financial health.', 'Taolo ya molato ke senotlolo.')
  ]
};

// ============ INCOME ============
knowledge.income.how_to = {
  primary: [
    bi('Help with chores to earn pocket money.', 'Thusa ka mesebetsi ya lapeng.'),
    bi('Ask grandparents for small jobs to earn money.', 'Kopa bo-nkhono mesebetsi e menyenyane.'),
    bi('Sell old toys you no longer use.', 'Rekisa dipapadi tsa kgale.')
  ],
  high_school: [
    bi('Find part-time work in your community.', 'Fumana mosebetsi wa nakwana.'),
    bi('Offer tutoring services to younger students.', 'Fana ka ho ruta baithuti ba banyane.'),
    bi('Sell items you make or no longer need.', 'Rekisa dintho tseo o di etsang.')
  ],
  university: [
    bi('Apply for bursaries and scholarships.', 'Kopa dibursary le di-scholarship.'),
    bi('Explore freelance and gig opportunities.', 'Hlahloba freelance le gig economy.'),
    bi('Start a small campus business.', 'Qala kgwebo e nyane khamphaseng.')
  ]
};
knowledge.income.why = {
  primary: [
    bi('Income helps you buy things you need.', 'Moputso o thusa ho reka ditlhoko.'),
    bi('Earning money teaches responsibility.', 'Ho fumana ho ruta boikarabelo.'),
    bi('Saving from income builds good habits.', 'Ho boloka ho tswa moputsong ho haha ditlwaelo.')
  ],
  high_school: [
    bi('Income provides financial independence.', 'Moputso o fana ka boikemelo.'),
    bi('Multiple income sources create stability.', 'Mehlodi e mengata e bopa botsitso.'),
    bi('Earning builds work experience.', 'Ho fumana ho haha boiphihlelo.')
  ],
  university: [
    bi('Income diversification reduces risk.', 'Ho fapanya ho fokotsa kotsi.'),
    bi('Passive income builds wealth over time.', 'O sa sebetseng o haha maruo.'),
    bi('Financial independence requires income management.', 'Boikemelo bo hloka taolo ya moputso.')
  ]
};

// ============ BANKING ============
knowledge.banking.how_to = {
  primary: [
    bi('Ask your parents to open a bank account for you.', 'Kopa batswadi ho o bulela akhaonto.'),
    bi('Deposit money in the bank to keep it safe.', 'Kenya chelete bankeng.'),
    bi('Learn to use an ATM with adult supervision.', 'Ithute ho sebedisa ATM le motho e moholo.')
  ],
  high_school: [
    bi('Compare bank accounts before choosing one.', 'Bapisa diakhaonto pele o kgetha.'),
    bi('Set up mobile banking on your phone.', 'Kenya mobile banking fonong.'),
    bi('Check your balance regularly.', 'Hlahloba balance kgafetsa.')
  ],
  university: [
    bi('Use two-factor authentication for security.', 'Sebedisa two-factor authentication.'),
    bi('Understand fees and minimum balance requirements.', 'Utlwisisa ditefiso le minimum balance.'),
    bi('Explore fixed deposits for higher interest.', 'Hlahloba fixed deposits.')
  ]
};
knowledge.banking.why = {
  primary: [
    bi('Banks keep your money safe from theft.', 'Dibanka di boloka chelete e sireletsehile.'),
    bi('Money in the bank earns interest.', 'Chelete bankeng e fumana phaello.'),
    bi('Bank accounts teach money management.', 'Diakhaonto di ruta taolo ya chelete.')
  ],
  high_school: [
    bi('Banking builds financial credibility.', 'Banka e haha tshepahalo.'),
    bi('Mobile banking makes transactions convenient.', 'Mobile banking e etsa ditransakshene bonolo.'),
    bi('Banks provide secure payment services.', 'Dibanka di fana ka ditshebeletso tse sireletsehileng.')
  ],
  university: [
    bi('Banking enables credit access.', 'Banka e dumella mokitlane.'),
    bi('Digital banking expands financial inclusion.', 'Digital banking e eketsa ho kenyelletswa.'),
    bi('Understanding banking is essential for planning.', 'Ho utlwisisa banka ho bohlokwa.')
  ]
};

// ============ NEEDS_WANTS ============
knowledge.needs_wants.how_to = {
  primary: [
    bi('Before buying, ask: Do I need this or just want it?', 'Pele o reka, ipotse: Na ke a e hloka kapa ke a e batla?'),
    bi('Make a list of needs first, then wants.', 'Etsa lenane la ditlhoko pele.'),
    bi('Wait one day before buying something you want.', 'Ema letsatsi pele o reka.')
  ],
  high_school: [
    bi('Categorize expenses as needs or wants.', 'Arola ditshenyehelo e le ditlhoko kapa ditakatso.'),
    bi('Use the 50/30/20 rule to limit wants spending.', 'Sebedisa 50/30/20 ho lekanyetsa.'),
    bi('Wait 30 days before major want purchases.', 'Ema matsatsi a 30 pele o reka.')
  ],
  university: [
    bi('Conduct a needs audit of monthly expenses.', 'Etsa tlhahlobo ya ditlhoko.'),
    bi('Distinguish lifestyle inflation from genuine needs.', 'Khetholla lifestyle inflation.'),
    bi('Practice mindful spending and delayed gratification.', 'Ikwetlise ho sebedisa ka hloko.')
  ]
};
knowledge.needs_wants.why = {
  primary: [
    bi('Knowing needs vs wants helps you spend wisely.', 'Ho tseba ho thusa ho sebedisa ka bohlale.'),
    bi('Needs come first to keep you safe.', 'Ditlhoko di tla pele.'),
    bi('Wants are fine after needs are met.', 'Ditakatso di lokile kamora ditlhoko.')
  ],
  high_school: [
    bi('Distinguishing needs helps prioritize spending.', 'Ho khetholla ho thusa ho beha pele.'),
    bi('Wants spending control prevents debt.', 'Taolo ya ditakatso e thibela sekoloto.'),
    bi('Understanding needs vs wants builds discipline.', 'Ho utlwisisa ho haha taeo.')
  ],
  university: [
    bi('Needs analysis is foundational to budgeting.', 'Tlhahlobo ya ditlhoko ke motheo.'),
    bi('Lifestyle inflation undermines goals.', 'Lifestyle inflation e senya dipakane.'),
    bi('Intentional spending increases satisfaction.', 'Ho sebedisa ka boomo ho eketsa kgotsofalo.')
  ]
};

// ============ GREETING (how_to and why are suggestions) ============
knowledge.greeting.how_to = {
  primary: [
    bi('Ask me about saving, money, or budgeting!', 'Mpotse ka ho boloka, chelete kapa tekanyetso!'),
    bi('Try asking: What is interest?', 'Leka ho botsa: Phaello ke eng?')
  ],
  high_school: [
    bi('Ask me: How do I create a budget?', 'Mpotse: Ke etsa tekanyetso jwang?'),
    bi('Try: What is compound interest?', 'Leka: Phaello e kopaneng ke eng?')
  ],
  university: [
    bi('Ask me: How do I build an emergency fund?', 'Mpotse: Ke haha letlole la tshohanyetso jwang?'),
    bi('Try: What is the best investment strategy?', 'Leka: Leano le molemohali la matsete ke lefe?')
  ]
};
knowledge.greeting.why = {
  primary: [
    bi('Learning about money now helps you later in life.', 'Ho ithuta ka chelete hona joale ho thusa hamorao.'),
    bi('Financial literacy is a life skill.', 'Tsebo ya lichelete ke bokgoni ba bophelo.')
  ],
  high_school: [
    bi('Financial knowledge builds confidence.', 'Tsebo ya lichelete e haha tshepo.'),
    bi('Understanding money prevents future problems.', 'Ho utlwisisa ho thibela mathata.')
  ],
  university: [
    bi('Financial literacy is essential for independence.', 'Tsebo ya lichelete e bohlokwa bakeng sa boikemelo.'),
    bi('Smart money management creates opportunities.', 'Taolo e bohlale e bopa menyetla.')
  ]
};

// Save
fs.writeFileSync(
  path.join(__dirname, 'knowledge-rich.json'),
  JSON.stringify(knowledge, null, 2)
);

console.log('Added how_to and why to all topics!');
console.log('Topics:', Object.keys(knowledge).join(', '));