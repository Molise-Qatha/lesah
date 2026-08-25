const fs = require('fs');
const path = require('path');

// Helper to create bilingual entries
function bi(english, sesotho) {
  return { english: english, sesotho: sesotho };
}

// Build the knowledge base programmatically
const knowledge = {};

// ==========================================
// SAVING
// ==========================================
knowledge.saving = {
  definitions: {
    primary: [
      bi('Saving means keeping some money for later instead of spending it all now.', 'Ho boloka ho bolela ho boloka chelete bakeng sa hamorao.'),
      bi('When you save, you put money away so you can use it another day.', 'Ha u boloka, u beha chelete ka thoko hore u e sebelise ka letsatsi le leng.'),
      bi('Saving is like keeping a seed instead of eating it — you keep it for the future.', 'Ho boloka ho tshwana le ho boloka peo ho e-na le ho e ja.'),
      bi('Saving means you do not spend all your money today.', 'Ho boloka ho bolela hore ha o sebedise chelete yohle kajeno.'),
      bi('Saving is when you put money in a safe place and do not touch it.', 'Ho boloka ke ha o beha chelete sebakeng se sireletsehileng.')
    ],
    high_school: [
      bi('Saving is setting aside a portion of your income for future use.', 'Ho boloka ke ho behella karolo ya moputso wa hao ka thoko.'),
      bi('Saving means deliberately keeping some money for later needs.', 'Ho boloka ho bolela ho boloka chelete ka boomo bakeng sa ditlhoko tsa hamorao.'),
      bi('Saving is the habit of putting money aside regularly.', 'Ho boloka ke tlwaelo ya ho behella chelete ka thoko kgafetsa.'),
      bi('When you save, you delay spending today so you have money tomorrow.', 'Ha o boloka, o liehisa tshebediso kajeno hore o be le chelete hosane.'),
      bi('Saving is the foundation of financial health.', 'Ho boloka ke motheo wa bophelo bo botle ba lichelete.')
    ],
    university: [
      bi('Saving is the deliberate allocation of income toward future goals.', 'Ho boloka ke ho arola moputso ka boomo ho ya dipakaneng tsa bokamoso.'),
      bi('Saving means prioritizing financial security over immediate spending.', 'Ho boloka ho bolela ho beha tshireletso ya lichelete pele.'),
      bi('Saving is a financial discipline providing liquidity for emergencies.', 'Ho boloka ke taeo ya lichelete e fanang ka chelete ya tshohanyetso.'),
      bi('Saving involves allocating a percentage of income to build reserves.', 'Ho boloka ho kenyelletsa ho arola peresente ya moputso ho haha pokello.'),
      bi('Saving builds financial assets through regular contributions.', 'Ho boloka ho haha matlotlo a lichelete ka ho kenya chelete kgafetsa.')
    ]
  },
  examples: {
    primary: [
      bi('If you get M10 and keep M3 for later, you saved M3.', 'Haeba o fumana M10 mme o boloka M3, o bolokile M3.'),
      bi('Your grandmother gives you M5. You put M2 in your piggy bank.', 'Nkhono o fa M5. O kenya M2 ka piggy bank.'),
      bi('A toy costs M50. Saving M10 per week means you will have it in 5 weeks.', 'Sebapadiswa se bitsa M50. Ho boloka M10 ka beke ho bolela hore o tla ba le sona ka dibeke tse 5.'),
      bi('Instead of spending all your M20, you keep M5.', 'Ho e-na le ho sebedisa M20 yohle, o boloka M5.'),
      bi('You have M100 and keep M30 for later.', 'O na le M100 mme o boloka M30 bakeng sa hamorao.')
    ],
    high_school: [
      bi('You earn M500 and save M100 monthly. After one year, you have M1,200.', 'O fumana M500 mme o boloka M100 ka kgwedi. Kamora selemo, o na le M1,200.'),
      bi('Your allowance is M300. Set aside M50 before spending anything.', 'Chelete ya hao ke M300. Behella M50 ka thoko pele o sebedisa letho.'),
      bi('You need M2,000 for a laptop. Saving M200 monthly means 10 months.', 'O hloka M2,000 bakeng sa laptop. Ho boloka M200 ka kgwedi ho bolela dikgwedi tse 10.'),
      bi('Keep M50 from M200 instead of spending it all.', 'Boloka M50 ho tswa ho M200 ho e-na le ho e sebedisa yohle.'),
      bi('A M1,000 gift: save 30 percent (M300) and spend the rest.', 'Mpho ya M1,000: boloka 30% (M300) mme o sebedise tse setseng.')
    ],
    university: [
      bi('Bursary M2,500: follow 50/30/20 rule, save M500 monthly.', 'Bursary ya M2,500: latela molao wa 50/30/20, boloka M500 ka kgwedi.'),
      bi('Freelance income M1,500: allocate M300 to savings first.', 'Moputso wa freelance M1,500: arola M300 polokong pele.'),
      bi('Save M200 monthly for emergency fund = M2,400 per year.', 'Boloka M200 ka kgwedi bakeng sa tshohanyetso = M2,400 ka selemo.'),
      bi('Invest M500 monthly at 7 percent = approximately M87,000 in 10 years.', 'Kenya M500 ka kgwedi ka 7% = M87,000 ka dilemo tse 10.'),
      bi('Income M3,500: M2,000 fixed, M500 savings, M1,000 variable.', 'Moputso M3,500: M2,000 e sa fetoheng, M500 poloko, M1,000 e fetohang.')
    ]
  },
  misconceptions: {
    primary: [
      bi('You need lots of money to save — FALSE! Even M1 counts.', 'O hloka chelete e ngata ho boloka — HA SE NNETE! Le M1 e a balwa.'),
      bi('Saving is only for rich people — FALSE! Everyone can save.', 'Ho boloka ke ha barui feela — HA SE NNETE! Bohle ba ka boloka.'),
      bi('Saving means no fun — FALSE! You can save and spend wisely.', 'Ho boloka ho bolela ho se thabe — HA SE NNETE! O ka boloka le ho sebedisa ka bohlale.')
    ],
    high_school: [
      bi('Only people with jobs can save — FALSE! Students can too.', 'Ke batho ba nang le mesebetsi feela ba ka bolokang — HA SE NNETE! Baithuti le bona ba ka boloka.'),
      bi('You need M100+ to start — FALSE! M10 regularly adds up.', 'O hloka M100+ ho qala — HA SE NNETE! M10 kgafetsa ea eketswa.'),
      bi('Saving means never spending on yourself — FALSE! It means balance.', 'Ho boloka ho bolela ho se ithekele letho — HA SE NNETE! Ho bolela ho lekalekanya.')
    ],
    university: [
      bi('Saving equals investing — FALSE! Different risk levels.', 'Ho boloka ho tshwana le matsete — HA SE NNETE! Di na le dikotsi tse fapaneng.'),
      bi('Save what is left after spending — FALSE! Pay yourself first.', 'Boloka se setseng kamora ho sebedisa — HA SE NNETE! Itefe pele.'),
      bi('Inflation makes saving pointless — FALSE! Interest offsets it.', 'Inflation e etsa hore ho boloka ho se thuse — HA SE NNETE! Phaello ea e lekanya.')
    ]
  },
  follow_up_suggestions: [
    bi('Would you like to learn how to start saving?', 'Na o ka rata ho ithuta ho qala ho boloka?'),
    bi('Do you know what a piggy bank is?', 'Na o tseba hore na piggy bank ke eng?'),
    bi('Want to learn about saving goals?', 'Na o batla ho ithuta ka dipakane tsa poloko?'),
    bi('Would you like to know where to keep savings?', 'Na o ka rata ho tseba moo o bolokang poloko?'),
    bi('Should we talk about budgeting too?', 'Na re bue le ka tekanyetso?')
  ]
};

// ==========================================
// MONEY
// ==========================================
knowledge.money = {
  definitions: {
    primary: [
      bi('Money is what we use to buy things. In Lesotho, we use Maloti and Lisente.', 'Chelete ke seo re se sebedisang ho reka dintho. Lesotho re sebedisa Maloti le Lisente.'),
      bi('Money is special paper and coins that people use to pay for things.', 'Chelete ke pampiri le ditjhepe tse kgethehileng tseo batho ba di sebedisang ho lefa.'),
      bi('Money helps us buy food, clothes, and other things we need.', 'Chelete e re thusa ho reka dijo, diaparo le dintho tse ding tseo re di hlokang.'),
      bi('In Lesotho, our money is called the Loti.', 'Lesotho, chelete ya rona e bitswa Loti.'),
      bi('Money is a tool for buying and selling things.', 'Chelete ke sesebediswa sa ho reka le ho rekisa.')
    ],
    high_school: [
      bi('Money is a medium of exchange used to buy goods and services.', 'Chelete ke mokgwa wa ho fapanyetsana o sebediswang ho reka thepa le ditshebeletso.'),
      bi('The Loti is divided into 100 Lisente.', 'Loti e arotswe ka Lisente tse 100.'),
      bi('Money has three functions: medium of exchange, unit of account, store of value.', 'Chelete e na le mesebetsi e meraro: ho fapanyetsana, ho metha boleng le ho boloka boleng.'),
      bi('The Loti is pegged to the South African Rand.', 'Loti e hokahane le Rand ya Afrika Borwa.'),
      bi('Money represents purchasing power.', 'Chelete e emela matla a ho reka.')
    ],
    university: [
      bi('Money serves as medium of exchange, store of value, and unit of account.', 'Chelete e sebetsa e le mokgwa wa ho fapanyetsana, ho boloka boleng le ho metha boleng.'),
      bi('The Lesotho Loti (LSL) is pegged 1:1 to the Rand (ZAR).', 'Loti ya Lesotho (LSL) e hokahane 1:1 le Rand (ZAR).'),
      bi('Money encompasses M0 through M3 with implications for liquidity.', 'Chelete e kenyelletsa M0 ho ya M3 ka ditlamorao tsa liquidity.'),
      bi('Understanding money requires analyzing banking and monetary policy.', 'Ho utlwisisa chelete ho hloka ho hlahloba dibanka le leano la lichelete.'),
      bi('Digital money represents a new form of financial inclusion.', 'Chelete ya dijithale e emela mokgwa o motjha wa ho kenyelletsa batho ditabeng tsa lichelete.')
    ]
  },
  examples: {
    primary: [
      bi('A bread costs M10. You give M10 and get bread.', 'Bohobe bo bitsa M10. O fana ka M10 mme o fumana bohobe.'),
      bi('M1 is the same as 100 Lisente.', 'M1 e tshwana le Lisente tse 100.'),
      bi('A sweet costs M5. A packet of chips costs M10.', 'Pompong e bitsa M5. Pakete ya chips e bitsa M10.'),
      bi('M50 can buy five breads that cost M10 each.', 'M50 e ka reka mahobe a mahlano a bitsang M10 ka bonngwe.'),
      bi('You have M20 and want to buy something that costs M15. You have M5 left.', 'O na le M20 mme o batla ho reka ntho e bitsang M15. O setse le M5.')
    ],
    high_school: [
      bi('M50 can be exchanged for goods worth M50.', 'M50 e ka fapanyetswa ka thepa ya boleng ba M50.'),
      bi('At 5 percent inflation, M100 today buys only M95 worth next year.', 'Ka inflation ya 5%, M100 kajeno e reka feela M95 selemong se tlang.'),
      bi('M1 equals R1 because of the peg.', 'M1 e lekana le R1 ka lebaka la peg.'),
      bi('Counting money: M20 + M10 + M5 = M35.', 'Ho bala chelete: M20 + M10 + M5 = M35.'),
      bi('You receive M500 and can spend or save it.', 'O fumana M500 mme o ka e sebedisa kapa ho e boloka.')
    ],
    university: [
      bi('The Loti-Rand peg means shared monetary policy with South Africa.', 'Peg ya Loti le Rand e bolela leano le kopaneng la lichelete le Afrika Borwa.'),
      bi('M1,000 in cash has different implications than M1,000 in savings.', 'M1,000 ya cash e na le moelelo o fapaneng le M1,000 polokong.'),
      bi('Depositing M500 enters the broader money supply.', 'Ho kenya M500 ho kena ka hara pokello e pharaletseng ya chelete.'),
      bi('Purchasing power parity compares prices between Maseru and Bloemfontein.', 'Purchasing power parity e bapisa ditheko pakeng tsa Maseru le Bloemfontein.'),
      bi('Mobile money like M-Pesa affects financial inclusion.', 'Mobile money e kang M-Pesa e ama ho kenyelletswa ditabeng tsa lichelete.')
    ]
  },
  misconceptions: {
    primary: [
      bi('Money grows on trees — FALSE! People earn money by working.', 'Chelete e mela difateng — HA SE NNETE! Batho ba fumana chelete ka ho sebetsa.'),
      bi('More money means more happiness — FALSE! Money helps but is not everything.', 'Chelete e ngata e bolela thabo e ngata — HA SE NNETE! Chelete ea thusa empa ha se yohle.'),
      bi('Only adults use money — FALSE! Children can learn to use money too.', 'Ke batho ba baholo feela ba sebedisang chelete — HA SE NNETE! Bana le bona ba ka ithuta.')
    ],
    high_school: [
      bi('Debit cards are unlimited money — FALSE! They only access your account.', 'Dikarete tsa debit ke chelete e sa feleng — HA SE NNETE! Di fihlella feela akhaonto ya hao.'),
      bi('The Loti and Rand are the same currency — FALSE! Different but pegged.', 'Loti le Rand ke chelete e le nngwe — HA SE NNETE! Di fapane empa di hokahane.'),
      bi('Banks print money — FALSE! The Central Bank controls money supply.', 'Dibanka di hatisa chelete — HA SE NNETE! Banka e Kgolo e laola tlhahiso ya chelete.')
    ],
    university: [
      bi('Cryptocurrency is legal tender in Lesotho — FALSE!', 'Cryptocurrency ke chelete ya molao Lesotho — HA SE NNETE!'),
      bi('Money has intrinsic value — FALSE! Fiat money has value by decree.', 'Chelete e na le boleng ba tlhaho — HA SE NNETE! Fiat money e na le boleng ka molao.'),
      bi('Inflation always hurts everyone — FALSE! Borrowers with fixed rates benefit.', 'Inflation e utlwisa bohle bohloko — HA SE NNETE! Ba alimang ka fixed rates ba a rua molemo.')
    ]
  },
  follow_up_suggestions: [
    bi('Want to learn how to count Maloti?', 'Na o batla ho ithuta ho bala Maloti?'),
    bi('Would you like to know where money comes from?', 'Na o ka rata ho tseba moo chelete e tswang teng?'),
    bi('Should we talk about saving money?', 'Na re bue ka ho boloka chelete?'),
    bi('Want to understand what banks do with money?', 'Na o batla ho utlwisisa hore na dibanka di etsa eng ka chelete?'),
    bi('Would you like to learn about earning money?', 'Na o ka rata ho ithuta ka ho fumana chelete?')
  ]
};

// ==========================================
// BUDGETING
// ==========================================
knowledge.budgeting = {
  definitions: {
    primary: [
      bi('A budget is a plan for your money.', 'Tekanyetso ke moralo wa chelete ya hao.'),
      bi('Budgeting means deciding where your money will go.', 'Ho etsa tekanyetso ho bolela ho etsa qeto ya hore na chelete e ya kae.'),
      bi('A budget is like a map for your money.', 'Tekanyetso e tshwana le mmapa wa chelete ya hao.'),
      bi('When you budget, you divide your money into different purposes.', 'Ha o etsa tekanyetso, o arola chelete ka merero e fapaneng.'),
      bi('A budget helps you know how much to spend, save, and give.', 'Tekanyetso e o thusa ho tseba hore na o sebedisa, o boloka le ho fana bokae.')
    ],
    high_school: [
      bi('Budgeting is creating a structured plan for income and expenses.', 'Tekanyetso ke ho theha moralo o hlophisitsweng wa moputso le ditshenyehelo.'),
      bi('A budget tracks money coming in and going out.', 'Tekanyetso e latela chelete e kenang le e tswang.'),
      bi('Budgeting means allocating income to different categories.', 'Ho etsa tekanyetso ho bolela ho arola moputso ka dikarolo tse fapaneng.'),
      bi('A budget helps you live within your means.', 'Tekanyetso e o thusa ho phela ka hara seo o nang le sona.'),
      bi('Budgeting involves comparing income to expenses.', 'Tekanyetso e kenyelletsa ho bapisa moputso le ditshenyehelo.')
    ],
    university: [
      bi('Budgeting is the systematic allocation of financial resources.', 'Tekanyetso ke ho arola mehlodi ya lichelete ka mokgwa o hlophisitsweng.'),
      bi('A budget matches income against fixed and variable expenses.', 'Tekanyetso e bapisa moputso le ditshenyehelo tse sa fetoheng le tse fetohang.'),
      bi('Budgeting encompasses zero-based and 50/30/20 approaches.', 'Tekanyetso e kenyelletsa mekgwa ya zero-based le 50/30/20.'),
      bi('Effective budgeting requires understanding cash flow.', 'Tekanyetso e atlehileng e hloka ho utlwisisa phallo ya chelete.'),
      bi('Budgeting provides visibility and control over every Maloti.', 'Tekanyetso e fana ka ponahalo le taolo hodima Maloti a mang le a mang.')
    ]
  },
  examples: {
    primary: [
      bi('You get M50: M20 snacks, M20 savings, M10 giving.', 'O fumana M50: M20 dipompong, M20 poloko, M10 ho fana.'),
      bi('Your budget shows M30. A toy costs M40. You need M10 more.', 'Tekanyetso e bontsha M30. Sebapadiswa se bitsa M40. O hloka M10 e nngwe.'),
      bi('Divide M100 into three envelopes: Spend, Save, Give.', 'Arola M100 ka di-enfelopo tse tharo: Sebedisa, Boloka, Fana.'),
      bi('Check your budget before buying anything.', 'Hlahloba tekanyetso ya hao pele o reka letho.'),
      bi('Weekly budget: M15 transport, M10 food, M5 saving.', 'Tekanyetso ya beke: M15 dipalangwang, M10 dijo, M5 poloko.')
    ],
    high_school: [
      bi('Monthly M600: M200 transport, M150 food, M100 airtime, M100 savings, M50 fun.', 'Ka kgwedi M600: M200 dipalangwang, M150 dijo, M100 airtime, M100 poloko, M50 boithabiso.'),
      bi('Earn M500, expenses M450, M50 left to save.', 'Fumana M500, ditshenyehelo M450, M50 e setseng ho boloka.'),
      bi('Use envelopes: M200 food, M100 transport, M50 savings.', 'Sebedisa di-enfelopo: M200 dijo, M100 dipalangwang, M50 poloko.'),
      bi('Cut entertainment from M150 to M50 to balance budget.', 'Fokotsa boithabiso ho tloha M150 ho ya M50 ho lekalekanya tekanyetso.'),
      bi('Track spending for one month to understand patterns.', 'Latela tshebediso kgwedi e le nngwe ho utlwisisa mekgwa.')
    ],
    university: [
      bi('Bursary M2,500: M1,000 rent, M800 food, M300 transport, M200 books, M200 savings.', 'Bursary M2,500: M1,000 rente, M800 dijo, M300 dipalangwang, M200 dibuka, M200 poloko.'),
      bi('Zero-based: every Maloti of M3,000 has a job.', 'Zero-based: Maloti a mang le a mang a M3,000 a na le mosebetsi.'),
      bi('50/30/20 on M4,000: M2,000 needs, M1,200 wants, M800 savings.', '50/30/20 ho M4,000: M2,000 ditlhoko, M1,200 ditakatso, M800 poloko.'),
      bi('Reduce eating out from M600 to M300 to save M300 more.', 'Fokotsa ho jella kantle ho tloha M600 ho ya M300 ho boloka M300 e nngwe.'),
      bi('Allocate 10 percent of income to emergency fund.', 'Arola 10% ya moputso ho letlole la tshohanyetso.')
    ]
  },
  misconceptions: {
    primary: [
      bi('Budgets are boring — FALSE! Budgets help you get what you want.', 'Ditekanyetso di a tena — HA SE NNETE! Di o thusa ho fumana seo o se batlang.'),
      bi('Only adults need budgets — FALSE! Children can plan money too.', 'Ke batho ba baholo feela ba hlokang ditekanyetso — HA SE NNETE! Bana le bona ba ka rera.'),
      bi('A budget means you cannot buy anything — FALSE! It means buying what matters.', 'Tekanyetso e bolela hore o ke ke wa reka letho — HA SE NNETE! E bolela ho reka se bohlokwa.')
    ],
    high_school: [
      bi('Budgeting is only for people struggling — FALSE! Everyone benefits.', 'Tekanyetso ke ya batho ba nang le mathata feela — HA SE NNETE! Bohle ba a rua molemo.'),
      bi('Budgets are too restrictive — FALSE! They give freedom within limits.', 'Ditekanyetso di a thibela — HA SE NNETE! Di fana ka tokoloho ka hara meedi.'),
      bi('You need lots of money to budget — FALSE! Works with any amount.', 'O hloka chelete e ngata ho etsa tekanyetso — HA SE NNETE! E sebetsa ka chelete efe kapa efe.')
    ],
    university: [
      bi('Budgeting means cutting all fun — FALSE! It means intentional spending.', 'Tekanyetso e bolela ho kgaola boithabiso bohle — HA SE NNETE! E bolela ho sebedisa ka boomo.'),
      bi('No need to budget if you do not overspend — FALSE! Budgets optimize savings.', 'Ha ho hlokahale tekanyetso haeba o sa sebedise ho feta — HA SE NNETE! Tekanyetso e ntlafatsa poloko.'),
      bi('Budgeting apps are necessary — FALSE! A notebook works fine.', 'Di-app tsa tekanyetso di a hlokahala — HA SE NNETE! Buka ya ho ngola e sebetsa hantle.')
    ]
  },
  follow_up_suggestions: [
    bi('Want to create your first budget?', 'Na o batla ho etsa tekanyetso ya hao ya pele?'),
    bi('Should we practice dividing M100 into categories?', 'Na re ikwetlise ho arola M100 ka dikarolo?'),
    bi('Would you like to learn about tracking expenses?', 'Na o ka rata ho ithuta ho latela ditshenyehelo?'),
    bi('Want to know the 50/30/20 rule?', 'Na o batla ho tseba molao wa 50/30/20?'),
    bi('Should we talk about saving money too?', 'Na re bue le ka ho boloka chelete?')
  ]
};

// ==========================================
// INTEREST
// ==========================================
knowledge.interest = {
  definitions: {
    primary: [
      bi('Interest is extra money you get when you keep money in a bank.', 'Phaello ke chelete e eketsehileng eo o e fumanang ha o boloka chelete bankeng.'),
      bi('When you save, the bank gives you a little extra money. That is interest.', 'Ha o boloka, banka e o fa chelete e nyane e eketsehileng. Ke phaello.'),
      bi('Interest is like a reward for saving your money.', 'Phaello e tshwana le moputso wa ho boloka chelete ya hao.'),
      bi('If you put M100 in the bank and get M5 extra, that M5 is interest.', 'Haeba o kenya M100 bankeng mme o fumana M5 e eketsehileng, M5 eo ke phaello.'),
      bi('Interest is money that grows on your saved money.', 'Phaello ke chelete e holang hodima chelete e bolokilweng.')
    ],
    high_school: [
      bi('Interest is the cost of borrowing or the reward for saving.', 'Phaello ke theko ya ho alima kapa moputso wa ho boloka.'),
      bi('Interest is money paid for the use of borrowed money.', 'Phaello ke chelete e lefuwang bakeng sa tshebediso ya chelete e alimilweng.'),
      bi('Simple interest is calculated on principal only. Compound interest includes accumulated interest.', 'Phaello e bonolo e balwa hodima chelete feela. Phaello e kopaneng e kenyelletsa phaello e bokelletsweng.'),
      bi('Interest rate is expressed as a percentage.', 'Phaello e hlaloswa e le peresente.'),
      bi('When you save, interest works for you. When you borrow, it works against you.', 'Ha o boloka, phaello e o sebeletsa. Ha o alima, e o lwantsha.')
    ],
    university: [
      bi('Interest represents the time value of money.', 'Phaello e emela boleng ba nako ba chelete.'),
      bi('Simple interest: I = P x r x t. Compound interest: A = P(1+r)^n.', 'Phaello e bonolo: I = P x r x t. Phaello e kopaneng: A = P(1+r)^n.'),
      bi('Real interest rate equals nominal rate minus inflation.', 'Phaello ya nnete e lekana le phaello ya lebitso ho tlosa inflation.'),
      bi('Central bank policy and inflation influence interest rates.', 'Leano la banka e kgolo le inflation di ama phaello.'),
      bi('Effective annual rate accounts for compounding frequency.', 'Phaello e sebetsang ea selemo e balela makgetlo a ho kopanya.')
    ]
  },
  examples: {
    primary: [
      bi('Save M100 at 5 percent. After one year, you have M105.', 'Boloka M100 ka 5%. Kamora selemo, o na le M105.'),
      bi('Borrow M50 and repay M55. The extra M5 is interest.', 'Alima M50 mme o kgutlise M55. M5 e eketsehileng ke phaello.'),
      bi('A bank account gives interest, but a piggy bank does not.', 'Akhaonto ya banka e fana ka phaello, empa piggy bank ha e fane.'),
      bi('Save M200 and get M10 extra. That is your interest.', 'Boloka M200 mme o fumane M10 e eketsehileng. Ke phaello ya hao.'),
      bi('Interest makes your money grow while you sleep.', 'Phaello e etsa hore chelete ya hao e hole ha o robetse.')
    ],
    high_school: [
      bi('M1,000 at 10 percent = repay M1,100 after one year.', 'M1,000 ka 10% = kgutlisa M1,100 kamora selemo.'),
      bi('Simple interest on M5,000 at 8 percent for 3 years = M1,200.', 'Phaello e bonolo ho M5,000 ka 8% dilemo tse 3 = M1,200.'),
      bi('Compound: M1,000 at 10 percent — Year 1: M1,100, Year 2: M1,210, Year 3: M1,331.', 'E kopaneng: M1,000 ka 10% — Selemo 1: M1,100, Selemo 2: M1,210, Selemo 3: M1,331.'),
      bi('Save M100 monthly at 6 percent for 10 years = M16,470.', 'Boloka M100 ka kgwedi ka 6% dilemo tse 10 = M16,470.'),
      bi('Credit card at 24 percent doubles debt every 3 years.', 'Karete ya mokitlane ka 24% e imena sekoloto ka dilemo tse 3.')
    ],
    university: [
      bi('M10,000 at 7 percent for 10 years grows to M19,672.', 'M10,000 ka 7% dilemo tse 10 e hola ho fihlela M19,672.'),
      bi('Rule of 72: divide 72 by rate to estimate doubling time.', 'Molao wa 72: arola 72 ka phaello ho hakanya nako ya ho imena.'),
      bi('12 percent monthly compounding = 12.68 percent effective annual.', '12% e kopanwang kgwedi le kgwedi = 12.68% e sebetsang ka selemo.'),
      bi('M15,000 loan at 10 percent over 3 years = M4,500 interest.', 'Kalimo ya M15,000 ka 10% dilemo tse 3 = M4,500 phaello.'),
      bi('At 6 percent inflation and 3 percent savings, real return is negative.', 'Ka inflation ya 6% le poloko ya 3%, phaello ya nnete e negative.')
    ]
  },
  misconceptions: {
    primary: [
      bi('Interest is only for rich people — FALSE! Anyone earns interest on savings.', 'Phaello ke ya barui feela — HA SE NNETE! Motho e mong le e mong o fumana phaello polokong.'),
      bi('All interest is bad — FALSE! Interest on savings is good!', 'Phaello yohle e mpe — HA SE NNETE! Phaello polokong e ntle!'),
      bi('Interest grows money instantly — FALSE! It grows slowly over time.', 'Phaello e holisa chelete hanghang — HA SE NNETE! E hola butle ka nako.')
    ],
    high_school: [
      bi('Interest only applies to loans — FALSE! Savings earn interest too.', 'Phaello e sebetsa feela dikolong — HA SE NNETE! Poloko le yona e fumana phaello.'),
      bi('All banks offer same rates — FALSE! Rates vary significantly.', 'Dibanka tsohle di fana ka diphaello tse tshwanang — HA SE NNETE! Di fapana haholo.'),
      bi('Compound equals simple interest — FALSE! Compound grows faster.', 'E kopaneng e tshwana le e bonolo — HA SE NNETE! E kopaneng e hola ka potlako.')
    ],
    university: [
      bi('Low rates always help borrowers — FALSE! They hurt savers too.', 'Diphaello tse tlase di thusa ba alimang — HA SE NNETE! Di utlwisa ba bolokang bohloko.'),
      bi('Rule of 72 is exact — FALSE! It is an approximation.', 'Molao wa 72 o nepahetse — HA SE NNETE! Ke tekanyo feela.'),
      bi('Higher rates always mean better investments — FALSE! Risk matters.', 'Diphaello tse phahameng di bolela matsete a matle — HA SE NNETE! Kotsi le yona e bohlokwa.')
    ]
  },
  follow_up_suggestions: [
    bi('Want to learn how to calculate interest?', 'Na o batla ho ithuta ho bala phaello?'),
    bi('Should we talk about compound interest?', 'Na re bue ka phaello e kopaneng?'),
    bi('Want to know what interest rate to expect?', 'Na o batla ho tseba phaello e lebeletsweng?'),
    bi('Should we compare savings accounts?', 'Na re bapise diakhaonto tsa poloko?'),
    bi('Want to understand loan interest?', 'Na o batla ho utlwisisa phaello ya dikoloto?')
  ]
};

// ==========================================
// LOANS
// ==========================================
knowledge.loans = {
  definitions: {
    primary: [
      bi('A loan is money you borrow and agree to pay back later.', 'Kalimo ke chelete eo o e alimang mme o dumela ho e kgutlisa hamorao.'),
      bi('When you borrow money, that is called a loan.', 'Ha o alima chelete, seo se bitswa kalimo.'),
      bi('A loan is money someone gives you that you must return.', 'Kalimo ke chelete eo motho a o fang yona eo o tlamehang ho e kgutlisa.'),
      bi('Borrowing M50 from a friend is a loan.', 'Ho alima M50 ho motswalle ke kalimo.'),
      bi('A loan is like borrowing a book — you give it back.', 'Kalimo e tshwana le ho alima buka — o a e kgutlisa.')
    ],
    high_school: [
      bi('A loan is borrowed money repaid with interest over time.', 'Kalimo ke chelete e alimilweng e kgutliswang le phaello.'),
      bi('Loans can be secured or unsecured.', 'Dikoloto di ka ba tse sireleditsweng kapa tse sa sireleditsweng.'),
      bi('Student loans help pay for education.', 'Dikoloto tsa baithuti di thusa ho lefella thuto.'),
      bi('The cost of a loan includes interest and fees.', 'Theko ya kalimo e kenyelletsa phaello le ditefiso.'),
      bi('Repayment terms define how long you have to repay.', 'Dipehelo tsa tefo di hlalosa hore na o na le nako e kae ya ho kgutlisa.')
    ],
    university: [
      bi('Loans are debt instruments requiring repayment with interest.', 'Dikoloto ke disebediswa tsa molato tse hlokang ho kgutlisa le phaello.'),
      bi('Key metrics include APR and debt-to-income ratio.', 'Ditekanyo tsa bohlokwa di kenyelletsa APR le debt-to-income ratio.'),
      bi('Amortization schedules split payments between principal and interest.', 'Mananeo a amortization a arola ditefo pakeng tsa chelete le phaello.'),
      bi('Credit risk determines loan eligibility and rates.', 'Kotsi ya mokitlane e etsa qeto ya ho tshwaneleha le diphaello.'),
      bi('Student loans may offer deferment and income-based repayment.', 'Dikoloto tsa baithuti di ka fana ka deferment le ditefo tse itshetlehileng moputsong.')
    ]
  },
  examples: {
    primary: [
      bi('Borrow M50 from a friend. You must give back M50.', 'Alima M50 ho motswalle. O tlameha ho kgutlisa M50.'),
      bi('Borrow M20 and repay M22. The extra M2 is interest.', 'Alima M20 mme o kgutlise M22. M2 e eketsehileng ke phaello.'),
      bi('A bank loan of M100 means you owe the bank M100 plus interest.', 'Kalimo ya banka ya M100 e bolela hore o kolota banka M100 le phaello.'),
      bi('A toy costs M60. You borrow M60 and repay from allowance.', 'Sebapadiswa se bitsa M60. O alima M60 mme o kgutlisa ho tswa cheleteng ya pokotho.'),
      bi('Borrowing is a promise to return something. Always keep your promise!', 'Ho alima ke tshepiso ya ho kgutlisa. Dula o phethahatsa tshepiso!')
    ],
    high_school: [
      bi('Student loan of M10,000 at 8 percent over 2 years = M450 monthly.', 'Kalimo ya moithuti ya M10,000 ka 8% dilemo tse 2 = M450 ka kgwedi.'),
      bi('Borrow M5,000 for business at 12 percent = repay M5,600.', 'Alima M5,000 bakeng sa kgwebo ka 12% = kgutlisa M5,600.'),
      bi('Phone on credit M3,000 at 15 percent over 12 months = M3,450 total.', 'Fono ka mokitlane M3,000 ka 15% dikgwedi tse 12 = M3,450 yohle.'),
      bi('Personal loan M2,000 for school fees at 10 percent over 6 months.', 'Kalimo ya botho M2,000 bakeng sa ditefello tsa sekolo ka 10% dikgwedi tse 6.'),
      bi('Family loans may have no interest but are still commitments.', 'Dikoloto tsa lelapa di ka se be le phaello empa e ntse e le boitlamo.')
    ],
    university: [
      bi('M15,000 loan at 10 percent over 3 years = M19,500 total.', 'Kalimo ya M15,000 ka 10% dilemo tse 3 = M19,500 yohle.'),
      bi('Bank A: 8% for 2 years is cheaper than Bank B: 6% for 3 years.', 'Banka A: 8% dilemo tse 2 e theko e tlase ho feta Banka B: 6% dilemo tse 3.'),
      bi('Debt-to-income of 30 percent on M3,000 income = M900 debt payments.', 'Debt-to-income ya 30% ho moputso wa M3,000 = M900 ditefo tsa molato.'),
      bi('M20,000 loan at 12 percent over 5 years = M445 monthly.', 'Kalimo ya M20,000 ka 12% dilemo tse 5 = M445 ka kgwedi.'),
      bi('Interest-free periods avoid interest if paid within 30 days.', 'Dinako tse se nang phaello di qoba phaello haeba o lefa ka hara matsatsi a 30.')
    ]
  },
  misconceptions: {
    primary: [
      bi('You do not have to pay back loans — FALSE! Always repay.', 'Ha o tlamehe ho kgutlisa dikoloto — HA SE NNETE! Dula o kgutlisa.'),
      bi('Borrowing is always bad — FALSE! Sometimes it helps.', 'Ho alima ho mpe kamehla — HA SE NNETE! Ka nako e nngwe ho a thusa.'),
      bi('Only adults can borrow — FALSE! But always ask parents first.', 'Ke batho ba baholo feela ba ka alimang — HA SE NNETE! Empa dula o botsa batswadi pele.')
    ],
    high_school: [
      bi('Student loans are free money — FALSE! They must be repaid.', 'Dikoloto tsa baithuti ke chelete ya mahala — HA SE NNETE! Di tlameha ho kgutliswa.'),
      bi('No need to read loan terms — FALSE! Always understand full cost.', 'Ha ho hlokahale ho bala dipehelo tsa kalimo — HA SE NNETE! Dula o utlwisisa theko yohle.'),
      bi('All debt is bad — FALSE! Education loans can be good.', 'Molato wohle o mobe — HA SE NNETE! Dikoloto tsa thuto di ka ba ntle.')
    ],
    university: [
      bi('Lower rate always means cheaper loan — FALSE! Consider fees.', 'Phaello e tlase e bolela kalimo e theko e tlase — HA SE NNETE! Nahana ka ditefiso.'),
      bi('Defaulting has no consequences — FALSE! It damages credit.', 'Ho se lefe ha ho na ditlamorao — HA SE NNETE! Ho senya mokitlane.'),
      bi('Perfect credit needed for any loan — FALSE! Options exist.', 'Ho hlokahala mokitlane o phethahetseng — HA SE NNETE! Ho na le dikgetho.')
    ]
  },
  follow_up_suggestions: [
    bi('Want to know if you should borrow money?', 'Na o batla ho tseba hore na o lokela ho alima?'),
    bi('Should we talk about student loans?', 'Na re bue ka dikoloto tsa baithuti?'),
    bi('Want to understand interest on loans?', 'Na o batla ho utlwisisa phaello ya dikoloto?'),
    bi('Should we learn how to repay loans?', 'Na re ithute ho kgutlisa dikoloto?'),
    bi('Want to know the risks of borrowing?', 'Na o batla ho tseba dikotsi tsa ho alima?')
  ]
};

// ==========================================
// INCOME
// ==========================================
knowledge.income = {
  definitions: {
    primary: [
      bi('Income is the money you receive from allowance, gifts, or small jobs.', 'Moputso ke chelete eo o e fumanang ho tswa ho chelete ya pokotho, dimpho kapa mesebetsi e menyenyane.'),
      bi('When someone gives you money, that is income.', 'Ha motho a o fa chelete, ke moputso.'),
      bi('Your pocket money is income.', 'Chelete ya pokotho ya hao ke moputso.'),
      bi('Income is money coming in. Expenses are money going out.', 'Moputso ke chelete e kenang. Ditshenyehelo ke chelete e tswang.'),
      bi('If your parents give you M30 per week, that is weekly income.', 'Haeba batswadi ba o fa M30 ka beke, ke moputso wa beke.')
    ],
    high_school: [
      bi('Income is money received regularly from work or other sources.', 'Moputso ke chelete e fumanwang kgafetsa ho tswa mosebetsing kapa mehloding e meng.'),
      bi('Income is the flow of money into your possession.', 'Moputso ke phallo ya chelete e kenang matsohong a hao.'),
      bi('Sources include wages, allowances, business profits, and investment returns.', 'Mehlodi e kenyelletsa meputso, dipokotho, phaello ya kgwebo le matsete.'),
      bi('Gross income is before deductions. Net income is what you receive.', 'Moputso o felletseng ke pele ho ditefello. Moputso o hlwekileng ke seo o se fumanang.'),
      bi('Regular income helps you plan and budget.', 'Moputso o tloaelehileng o o thusa ho rera le ho etsa tekanyetso.')
    ],
    university: [
      bi('Income includes earned income, unearned income, and transfer payments.', 'Moputso o kenyelletsa moputso o sebetswang, o sa sebetsweng le ditefello tsa phetiso.'),
      bi('Disposable income equals gross income minus taxes.', 'Moputso o sebediswang o lekana le moputso o felletseng ho tlosa makgetho.'),
      bi('Income streams can be active or passive.', 'Mehlodi ya moputso e ka ba e sebetsang kapa e sa sebetseng.'),
      bi('Income diversification is key to financial resilience.', 'Ho fapanya mehlodi ya moputso ke senotlolo sa botsitso ba lichelete.'),
      bi('Student income includes bursaries, part-time work, and entrepreneurship.', 'Moputso wa moithuti o kenyelletsa dibursary, mosebetsi wa nakwana le kgwebo.')
    ]
  },
  examples: {
    primary: [
      bi('Your grandmother gives you M10. That is income!', 'Nkhono o o fa M10. Ke moputso!'),
      bi('You help wash dishes and get M5. That is income.', 'O thusa ho hlatswa dijana mme o fumana M5. Ke moputso.'),
      bi('Your parents give you M20 pocket money every week.', 'Batswadi ba o fa M20 ya pokotho beke le beke.'),
      bi('You sell old toys and get M15.', 'O rekisa dipapadi tsa kgale mme o fumana M15.'),
      bi('You receive M50 for your birthday. That is special income.', 'O fumana M50 ka letsatsi la hao la tswalo. Ke moputso o kgethehileng.')
    ],
    high_school: [
      bi('Part-time job at M25/hour for 20 hours = M500 weekly.', 'Mosebetsi wa nakwana ka M25/ka hora dihora tse 20 = M500 ka beke.'),
      bi('Sell 10 items at M15 each = M150 business income.', 'Rekisa dintho tse 10 ka M15 ka bonngwe = M150 moputso wa kgwebo.'),
      bi('Monthly allowance of M300 is regular income.', 'Chelete ya kgwedi ya M300 ke moputso o tloaelehileng.'),
      bi('Earn M200 helping a neighbour.', 'Fumana M200 ka ho thusa moahelani.'),
      bi('Interest from savings = M20. That is investment income.', 'Phaello ho tswa polokong = M20. Ke moputso wa matsete.')
    ],
    university: [
      bi('Bursary M2,500 plus part-time M1,000 = M3,500 monthly.', 'Bursary M2,500 le mosebetsi wa nakwana M1,000 = M3,500 ka kgwedi.'),
      bi('Freelance: 5 projects at M400 = M2,000 monthly.', 'Freelance: diprojeke tse 5 ka M400 = M2,000 ka kgwedi.'),
      bi('M50,000 invested at 6 percent = M3,000 annual interest.', 'M50,000 e kentsweng ka 6% = M3,000 phaello ka selemo.'),
      bi('Tutoring: 10 students at M200 = M2,000 monthly.', 'Ho ruta: baithuti ba 10 ka M200 = M2,000 ka kgwedi.'),
      bi('Mixed income streams create financial stability.', 'Mehlodi e fapaneng ya moputso e bopa botsitso ba lichelete.')
    ]
  },
  misconceptions: {
    primary: [
      bi('Income is only from jobs — FALSE! Gifts count too.', 'Moputso o tswa mesebetsing feela — HA SE NNETE! Dimpho le tsona di balwa.'),
      bi('More income means more problems — FALSE! More opportunities.', 'Moputso o mongata o bolela mathata — HA SE NNETE! Menyetla e mengata.'),
      bi('Only adults have income — FALSE! Children can earn.', 'Ke batho ba baholo feela ba nang le moputso — HA SE NNETE! Bana le bona ba ka fumana.')
    ],
    high_school: [
      bi('You need a full-time job for income — FALSE! Part-time counts.', 'O hloka mosebetsi wa nako yohle — HA SE NNETE! Wa nakwana le wona o balwa.'),
      bi('Income is always money — FALSE! Goods can be income.', 'Moputso ke chelete kamehla — HA SE NNETE! Thepa le yona e ka ba moputso.'),
      bi('All income should be spent — FALSE! Save a portion.', 'Moputso wohle o lokela ho sebediswa — HA SE NNETE! Boloka karolo.')
    ],
    university: [
      bi('Bursary money needs no management — FALSE! It requires budgeting.', 'Chelete ya bursary ha e hloke taolo — HA SE NNETE! E hloka tekanyetso.'),
      bi('Side income need not be reported — FALSE! Tax may apply.', 'Moputso wa lehlakoreng ha o hloke ho tlalehwa — HA SE NNETE! Makgetho a ka sebetsa.'),
      bi('Passive income means no work — FALSE! Requires upfront effort.', 'Moputso o sa sebetseng o bolela ho se sebetse — HA SE NNETE! O hloka boikitlaetso pele.')
    ]
  },
  follow_up_suggestions: [
    bi('Want to learn how to earn more money?', 'Na o batla ho ithuta ho fumana chelete e ngata?'),
    bi('Should we talk about budgeting your income?', 'Na re bue ka tekanyetso ya moputso?'),
    bi('Want to know how to save from income?', 'Na o batla ho tseba ho boloka ho tswa moputsong?'),
    bi('Should we explore student business ideas?', 'Na re hlahlobe mehopolo ya dikgwebo tsa baithuti?'),
    bi('Want to understand gross vs net income?', 'Na o batla ho utlwisisa phapang ya gross le net?')
  ]
};

// ==========================================
// BANKING
// ==========================================
knowledge.banking = {
  definitions: {
    primary: [
      bi('A bank is a safe place to keep your money.', 'Banka ke sebaka se sireletsehileng sa ho boloka chelete.'),
      bi('Banks help you store, get, and send money.', 'Dibanka di o thusa ho boloka, ho fumana le ho romella chelete.'),
      bi('A bank account is like a special box at the bank for your money.', 'Akhaonto ya banka e tshwana le lebokose le kgethehileng bankeng bakeng sa chelete ya hao.'),
      bi('Money in a bank is safe from getting lost.', 'Chelete bankeng e sireletsehile hore e se lahlehe.'),
      bi('Banks are buildings where people keep money safe.', 'Dibanka ke meaho eo batho ba bolokang chelete ho yona.')
    ],
    high_school: [
      bi('Banks accept deposits, provide loans, and offer payment services.', 'Dibanka di amohela depositi, di fana ka dikoloto le ditshebeletso tsa ditefo.'),
      bi('A bank account stores money securely and earns interest.', 'Akhaonto ya banka e boloka chelete ka mokgwa o sireletsehileng le ho fumana phaello.'),
      bi('Banking services include savings, mobile banking, and ATMs.', 'Ditshebeletso tsa banka di kenyelletsa poloko, mobile banking le di-ATM.'),
      bi('Banks act as intermediaries between savers and borrowers.', 'Dibanka di sebetsa e le mokenna-dipakeng pakeng tsa ba bolokang le ba alimang.'),
      bi('Mobile banking enables transactions through your phone.', 'Mobile banking e dumella ditransakshene ka fono ya hao.')
    ],
    university: [
      bi('Banks operate under fractional reserve banking.', 'Dibanka di sebetsa tlasa fractional reserve banking.'),
      bi('The Central Bank of Lesotho regulates commercial banks.', 'Banka e Kgolo ya Lesotho e laola dibanka tsa kgwebo.'),
      bi('Banking services include deposits, credit, payments, and wealth management.', 'Ditshebeletso tsa banka di kenyelletsa depositi, mokitlane, ditefo le taolo ya maruo.'),
      bi('Digital banking and mobile money expand financial inclusion.', 'Digital banking le mobile money di eketsa ho kenyelletswa ditabeng tsa lichelete.'),
      bi('Understanding fees and rates is essential for personal finance.', 'Ho utlwisisa ditefiso le diphaello ho bohlokwa bakeng sa lichelete tsa botho.')
    ]
  },
  examples: {
    primary: [
      bi('Put M50 in the bank. It stays safe.', 'Kenya M50 bankeng. E dula e sireletsehile.'),
      bi('Your parents have a bank account.', 'Batswadi ba hao ba na le akhaonto ya banka.'),
      bi('When you take money from the bank, it is a withdrawal.', 'Ha o nka chelete bankeng, ke withdrawal.'),
      bi('A piggy bank at home is like a mini bank!', 'Piggy bank lapeng e tshwana le banka e nyane!'),
      bi('Banks give you a card to get your money.', 'Dibanka di o fa karete ya ho fumana chelete ya hao.')
    ],
    high_school: [
      bi('Open a savings account with M100. Deposit M50 monthly.', 'Bula akhaonto ya poloko ka M100. Kenya M50 ka kgwedi.'),
      bi('Use mobile banking to check balance and transfer money.', 'Sebedisa mobile banking ho hlahloba balance le ho romella chelete.'),
      bi('Withdraw M200 from ATM using your card and PIN.', 'Ntsha M200 ho ATM ka karete le PIN ya hao.'),
      bi('Student accounts may offer lower fees.', 'Diakhaonto tsa baithuti di ka fana ka ditefiso tse tlase.'),
      bi('Deposit part-time earnings into your bank account.', 'Kenya moputso wa mosebetsi wa nakwana akhaontong ya hao ya banka.')
    ],
    university: [
      bi('Bank A charges M20 monthly with 3 percent interest. Bank B has no fee but 1.5 percent.', 'Banka A e lefisa M20 ka kgwedi ka 3%. Banka B ha e lefise empa 1.5%.'),
      bi('M-Pesa offers convenience but may have higher transfer fees.', 'M-Pesa e fana ka bonolo empa e ka ba le ditefiso tse phahameng tsa ho romella.'),
      bi('Fixed deposit M10,000 at 7 percent for 12 months = M700 interest.', 'Fixed deposit ya M10,000 ka 7% dikgwedi tse 12 = M700 phaello.'),
      bi('Overdraft M500 at 15 percent for 30 days = approximately M6.25 interest.', 'Overdraft ya M500 ka 15% matsatsi a 30 = M6.25 phaello.'),
      bi('Two-factor authentication protects your account.', 'Two-factor authentication e sireletsa akhaonto ya hao.')
    ]
  },
  misconceptions: {
    primary: [
      bi('Banks keep your money in a special box — FALSE! They track it digitally.', 'Dibanka di boloka chelete ka lebokoseng — HA SE NNETE! Di e latela ka dijithale.'),
      bi('Only rich people use banks — FALSE! Anyone can open an account.', 'Ke barui feela ba sebedisang dibanka — HA SE NNETE! Motho e mong le e mong a ka bula akhaonto.'),
      bi('Banks are dangerous — FALSE! They are very safe.', 'Dibanka di kotsi — HA SE NNETE! Di sireletsehile haholo.')
    ],
    high_school: [
      bi('You need lots of money to open an account — FALSE! Many start with M50.', 'O hloka chelete e ngata ho bula akhaonto — HA SE NNETE! Tse ngata di qala ka M50.'),
      bi('ATMs give free money — FALSE! You withdraw what is yours.', 'Di-ATM di fana ka chelete ya mahala — HA SE NNETE! O ntsha seo e leng sa hao.'),
      bi('Bank cards equal credit cards — FALSE! Debit uses your money.', 'Dikarete tsa banka di tshwana le tsa mokitlane — HA SE NNETE! Debit e sebedisa chelete ya hao.')
    ],
    university: [
      bi('All bank accounts are the same — FALSE! Fees and rates vary.', 'Diakhaonto tsohle tsa banka di a tshwana — HA SE NNETE! Ditefiso le diphaello di a fapana.'),
      bi('Banks do not charge for accounts — FALSE! Many charge monthly fees.', 'Dibanka ha di lefise diakhaonto — HA SE NNETE! Tse ngata di lefisa kgwedi le kgwedi.'),
      bi('Money in bank is 100 percent risk-free — FALSE! Very safe but not absolute.', 'Chelete bankeng ha e na kotsi — HA SE NNETE! E sireletsehile empa eseng ka ho phethahala.')
    ]
  },
  follow_up_suggestions: [
    bi('Want to know how to open a bank account?', 'Na o batla ho tseba ho bula akhaonto ya banka?'),
    bi('Should we talk about keeping money safe?', 'Na re bue ka ho boloka chelete e sireletsehile?'),
    bi('Want to understand mobile banking?', 'Na o batla ho utlwisisa mobile banking?'),
    bi('Should we compare bank accounts?', 'Na re bapise diakhaonto tsa banka?'),
    bi('Want to learn about saving in a bank?', 'Na o batla ho ithuta ka ho boloka bankeng?')
  ]
};

// ==========================================
// NEEDS_WANTS
// ==========================================
knowledge.needs_wants = {
  definitions: {
    primary: [
      bi('Needs are things you must have. Wants are things that are nice to have.', 'Ditlhoko ke dintho tseo o tlamehang ho ba le tsona. Ditakatso ke tse monate feela.'),
      bi('A need is something you cannot do without. A want is nice to have.', 'Tlhoko ke ntho eo o ke keng wa phela ntle le yona. Takatso e monate feela.'),
      bi('Needs keep you alive and safe. Wants make life fun.', 'Ditlhoko di o boloka o phela mme o sireletsehile. Ditakatso di etsa bophelo bo monate.'),
      bi('Food, water, clothes, and a home are needs. Toys and sweets are wants.', 'Dijo, metsi, diaparo le lehae ke ditlhoko. Dipapadi le dipompong ke ditakatso.'),
      bi('Needs come first. Wants come after needs.', 'Ditlhoko di tla pele. Ditakatso di tla kamora ditlhoko.')
    ],
    high_school: [
      bi('Needs are essential expenses. Wants are discretionary purchases.', 'Ditlhoko ke ditshenyehelo tsa bohlokwa. Ditakatso ke ditheko tsa boikgethelo.'),
      bi('Distinguishing needs from wants helps prioritize spending.', 'Ho khetholla ditlhoko le ditakatso ho thusa ho beha tshebediso pele.'),
      bi('Needs include food, shelter, education, and transport.', 'Ditlhoko di kenyelletsa dijo, bolulo, thuto le dipalangwang.'),
      bi('The difference is subjective but essential for budgeting.', 'Phapang e itshetlehile boemong empa e bohlokwa bakeng sa tekanyetso.'),
      bi('Understanding needs vs wants enables wise resource allocation.', 'Ho utlwisisa ditlhoko le ditakatso ho dumella ho arola mehlodi ka bohlale.')
    ],
    university: [
      bi('Needs are non-discretionary expenses. Wants reflect lifestyle choices.', 'Ditlhoko ke ditshenyehelo tse sa qojoeng. Ditakatso di bontsha dikgetho tsa bophelo.'),
      bi('The 50/30/20 rule allocates 50 percent to needs.', 'Molao wa 50/30/20 o arola 50% ho ditlhoko.'),
      bi('Distinguishing needs from wants requires self-awareness.', 'Ho khetholla ditlhoko le ditakatso ho hloka ho itseba.'),
      bi('Needs are inelastic; wants are elastic.', 'Ditlhoko ha di fetohe habonolo; ditakatso di a feto-fetoha.'),
      bi('Maslow hierarchy frames needs as physiological and safety requirements.', 'Maslow o hlalosa ditlhoko e le tsa mmele le tshireletso.')
    ]
  },
  examples: {
    primary: [
      bi('Food = need. Sweets = want.', 'Dijo = tlhoko. Dipompong = takatso.'),
      bi('School uniform = need. New toy = want.', 'Yunifomo ya sekolo = tlhoko. Sebapadiswa se setjha = takatso.'),
      bi('Water = need. Juice = want.', 'Metsi = tlhoko. Jusi = takatso.'),
      bi('A warm blanket = need. A new phone = want.', 'Kobo e futhumetseng = tlhoko. Fono e ntjha = takatso.'),
      bi('School books = need. Comic books = want.', 'Dibuka tsa sekolo = tlhoko. Dibuka tsa metlae = takatso.')
    ],
    high_school: [
      bi('Transport to school = need. Netflix = want.', 'Dipalangwang ho ya sekolong = tlhoko. Netflix = takatso.'),
      bi('School supplies = need. Designer shoes = want.', 'Disebediswa tsa sekolo = tlhoko. Dieta tsa designer = takatso.'),
      bi('Basic phone = need. Latest smartphone = want.', 'Fono ya motheo = tlhoko. Smartphone ya morao-rao = takatso.'),
      bi('Nutritious food = need. Eating out = want.', 'Dijo tse nang le phepo = tlhoko. Ho jella kantle = takatso.'),
      bi('Basic clothing = need. Brand fashion = want.', 'Diaparo tsa motheo = tlhoko. Feshene ya mabitso = takatso.')
    ],
    university: [
      bi('Rent = need. Bigger apartment = want.', 'Rente = tlhoko. Folete e kgolo = takatso.'),
      bi('Textbooks = need. Coffee shop spending = want.', 'Dibuka = tlhoko. Ho reka kofi = takatso.'),
      bi('Data for classes = need. Streaming = want.', 'Data bakeng sa dithuto = tlhoko. Streaming = takatso.'),
      bi('Basic groceries = need. Restaurant meals = want.', 'Dijo tsa motheo = tlhoko. Dijo tsa resturante = takatso.'),
      bi('Laptop for studies = need. Gaming console = want.', 'Laptop bakeng sa dithuto = tlhoko. Gaming console = takatso.')
    ]
  },
  misconceptions: {
    primary: [
      bi('Everything you want is a need — FALSE! Wants are optional.', 'Ntho e nngwe le e nngwe eo o e batlang ke tlhoko — HA SE NNETE! Ditakatso ke tsa boikgethelo.'),
      bi('Wants are bad — FALSE! They are fine after needs.', 'Ditakatso di mpe — HA SE NNETE! Di lokile kamora ditlhoko.'),
      bi('Needs are boring — FALSE! Meeting needs feels good.', 'Ditlhoko di a tena — HA SE NNETE! Ho fihlela ditlhoko ho monate.')
    ],
    high_school: [
      bi('If I really want it, it becomes a need — FALSE!', 'Haeba ke e batla haholo, e fetoha tlhoko — HA SE NNETE!'),
      bi('Expensive things are always wants — FALSE! Some needs cost a lot.', 'Dintho tse turang ke ditakatso kamehla — HA SE NNETE! Ditlhoko tse ding di a tura.'),
      bi('Cheap things are always needs — FALSE! Price does not determine.', 'Dintho tse theko e tlase ke ditlhoko — HA SE NNETE! Theko ha e etse qeto.')
    ],
    university: [
      bi('Lifestyle inflation is normal — FALSE! It undermines goals.', 'Ho nyoloha ha bophelo ke ntho e tlwaelehileng — HA SE NNETE! Ho senya dipakane.'),
      bi('All discretionary spending is bad — FALSE! Wants provide quality of life.', 'Tshebediso yohle ya boikgethelo e mpe — HA SE NNETE! Ditakatso di ntlafatsa bophelo.'),
      bi('The line is always clear — FALSE! Context matters.', 'Phapang e hlakile kamehla — HA SE NNETE! Boemo bo a bohlokwa.')
    ]
  },
  follow_up_suggestions: [
    bi('Want to practice sorting needs from wants?', 'Na o batla ho ikwetlisa ho arola ditlhoko le ditakatso?'),
    bi('Should we talk about budgeting for needs?', 'Na re bue ka tekanyetso ya ditlhoko?'),
    bi('Want to learn to balance needs and wants?', 'Na o batla ho ithuta ho lekalekanya ditlhoko le ditakatso?'),
    bi('Should we explore the 50/30/20 rule?', 'Na re hlahlobe molao wa 50/30/20?'),
    bi('Want to know how to resist impulse wants?', 'Na o batla ho tseba ho hanela ditakatso tsa tshohanyetso?')
  ]
};

// ==========================================
// GREETING
// ==========================================
knowledge.greeting = {
  definitions: {
    primary: [
      bi("Hello! I am LeSAH, your financial literacy assistant. How can I help you?", 'Lumela! Ke LeSAH, mothusi wa hao wa tsebo ya lichelete. Nka o thusa jwang?'),
      bi('Hi there! I am LeSAH. I can teach you about money!', 'Lumela! Ke LeSAH. Nka o ruta ka chelete!'),
      bi('Welcome! I am LeSAH. What would you like to learn?', 'Re a o amohela! Ke LeSAH. O batla ho ithuta eng?')
    ],
    high_school: [
      bi("Hello! I am LeSAH, your financial literacy tutor. Ask me about money.", 'Lumela! Ke LeSAH, morupelli wa hao wa tsebo ya lichelete. Mpotse ka chelete.'),
      bi("Hi! I am LeSAH. I am here to help you understand money.", 'Lumela! Ke LeSAH. Ke mona ho o thusa ho utlwisisa chelete.'),
      bi("Hey there! I am LeSAH. What financial topic interests you?", 'Lumela! Ke LeSAH. Ke taba efe ya lichelete e o kgahlang?')
    ],
    university: [
      bi("Hello! I am LeSAH, your financial literacy assistant. I can help with budgeting, investing, and debt.", 'Lumela! Ke LeSAH, mothusi wa hao wa tsebo ya lichelete. Nka thusa ka tekanyetso, matsete le dikoloto.'),
      bi("Welcome! I am LeSAH. Let us discuss personal finance.", 'Re a o amohela! Ke LeSAH. Ha re buisaneng ka lichelete tsa botho.'),
      bi("Greetings! I am LeSAH. What aspect of finance would you like to explore?", 'Lumela! Ke LeSAH. Ke karolo efe ya lichelete eo o batlang ho e hlahloba?')
    ]
  },
  examples: {
    primary: [
      bi("Ask me: What is saving?", 'Mpotse: Ho boloka ke eng?'),
      bi("Try asking: How do I count money?", 'Leka ho botsa: Ke bala chelete jwang?'),
      bi("Ask me: What is a budget?", 'Mpotse: Tekanyetso ke eng?'),
      bi("Try: What are needs and wants?", 'Leka: Ditlhoko le ditakatso ke eng?')
    ],
    high_school: [
      bi("Ask me: How do I create a budget?", 'Mpotse: Ke etsa tekanyetso jwang?'),
      bi("Try: What is compound interest?", 'Leka: Phaello e kopaneng ke eng?'),
      bi("Ask: Should I get a student loan?", 'Botsa: Na ke lokela ho alima kalimo ya moithuti?')
    ],
    university: [
      bi("Ask me: How do I build an emergency fund?", 'Mpotse: Ke haha letlole la tshohanyetso jwang?'),
      bi("Try: What is the best investment strategy?", 'Leka: Leano le molemohali la matsete ke lefe?'),
      bi("Ask: How do I manage student debt?", 'Botsa: Ke laola sekoloto sa moithuti jwang?')
    ]
  },
  misconceptions: {
    primary: [
      bi('I only teach boring money stuff — FALSE! Learning can be fun!', 'Ke ruta feela dintho tse tenang tsa chelete — HA SE NNETE! Ho ithuta ho ka ba monate!'),
      bi('I only speak English — FALSE! I speak Sesotho too!', 'Ke bua Senyesemane feela — HA SE NNETE! Ke bua le Sesotho!'),
      bi('I am only for adults — FALSE! I help all students!', 'Ke ya batho ba baholo feela — HA SE NNETE! Ke thusa baithuti bohle!')
    ],
    high_school: [
      bi('I am only for finance students — FALSE! Everyone benefits.', 'Ke ya baithuti ba lichelete feela — HA SE NNETE! Bohle ba a rua molemo.'),
      bi('I only answer simple questions — FALSE! I adapt to your level.', 'Ke araba dipotso tse bonolo feela — HA SE NNETE! Ke ikamahanya le boemo ba hao.')
    ],
    university: [
      bi('I replace financial advisors — FALSE! I provide education.', 'Ke nka sebaka sa baeletsi ba lichelete — HA SE NNETE! Ke fana ka thuto.'),
      bi('I am only for beginners — FALSE! I explain advanced concepts.', 'Ke ya ba qalang feela — HA SE NNETE! Ke hlalosa le dikgopolo tse tsoetseng pele.')
    ]
  },
  follow_up_suggestions: [
    bi('What would you like to learn about?', 'O batla ho ithuta ka eng?'),
    bi('Should we start with saving or budgeting?', 'Na re qale ka poloko kapa tekanyetso?'),
    bi('Want to test your knowledge with a quiz?', 'Na o batla ho hlahloba tsebo ya hao ka quiz?'),
    bi('Would you like to try an interactive activity?', 'Na o ka rata ho leka ketsahalo e kopanetsweng?'),
    bi('What financial topic interests you most?', 'Ke taba efe ya lichelete e o kgahlang haholo?')
  ]
};

// ==========================================
// SAVE TO FILE
// ==========================================
fs.writeFileSync(
  path.join(__dirname, 'knowledge-rich.json'),
  JSON.stringify(knowledge, null, 2)
);

console.log('Knowledge base generated successfully!');
console.log('Topics:', Object.keys(knowledge).join(', '));
console.log('Total topics:', Object.keys(knowledge).length);