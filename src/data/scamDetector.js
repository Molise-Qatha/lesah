// ============================================================
//  LeSAH · Scam Detector
//  Offline-first scam pattern detection for Lesotho context
//  Sesotho-first patterns — most real scams arrive in Sesotho
//  Runs entirely in the browser — no network required
// ============================================================

const URL_RE = /https?:\/\/|www\./i;

// ---------- Patterns ----------
// Each rule has an id, weight, and regex patterns.
// Weights add up to a risk score 0–100.

const SCAM_PATTERNS = [
  // --- "Pay first, get later" pattern (very common in Lesotho) ---
  { id: 'pay_first', weight: 35, patterns: [
    /ntshepisang\s+litshebeletso/i,
    /romella\s+chelete.{0,30}pele\s+a\s+ka\s+mpha/i,
    /romella\s+chelete.{0,30}(pele|kapele)/i,
    /lefa\s+(pele|kapele).{0,30}(fumana|thola|hlola)/i,
    /pay\s+(first|upfront|before).{0,30}(get|receive)/i,
    /upfront\s+payment/i,
    /pay\s+before\s+you\s+receive/i,
  ]},

  // --- Leave property as "proof" (car, phone, valuables) ---
  { id: 'leave_property', weight: 40, patterns: [
    /sie\s+(koloi|fono|thepa|ntho).{0,40}(khutla|fumana)/i,
    /tlohela\s+(koloi|fono|thepa)/i,
    /leave\s+(your\s+)?(car|phone|property|belongings)/i,
    /hand\s+over\s+(your\s+)?(car|phone|property)/i,
    /as\s+proof\s+you\s+will\s+(return|come\s+back)/i,
  ]},

  // --- Monthly-payout scheme (pyramid disguised as organisation) ---
  { id: 'monthly_scheme', weight: 35, patterns: [
    /lefa\s+(M|R)?\s*\d+.{0,30}(selemo|hanngoe).{0,60}(fumana|thola).{0,30}(khoeli|monthly)/i,
    /pay.{0,30}(M|R)?\s*\d+.{0,30}(once|year|annually).{0,60}(receive|earn).{0,30}(monthly|per\s+month)/i,
    /be\s+karolo\s+ea\s+mokhatlo\s+o\s+fang/i,
    /fumana\s+chelete\s+khoeli\s+le\s+khoeli/i,
    /join\s+(our\s+)?(group|organisation|society).{0,60}receive.{0,30}(monthly|per\s+month)/i,
  ]},

  // --- Pyramid / Ponzi / investment scheme ---
  { id: 'pyramid_invite', weight: 30, patterns: [
    /invite\s+\d+\s+(people|friends|members)/i,
    /refer\s+\d+\s+(people|friends)/i,
    /downline/i,
    /ho\s+kenyelletsa\s+\d+\s+batho/i,
    /kenyelletsa\s+batho\s+ba\s+\d+/i,
    /bitsa\s+batho\s+ba\s+\d+/i,
  ]},
  { id: 'pyramid_double', weight: 30, patterns: [
    /double\s+your\s+(money|investment|cash)/i,
    /guaranteed\s+(returns?|profit)/i,
    /ho\s+eketsa\s+chelete\s+ea\s+hao/i,
    /chelete\s+e\s+tiisitsoeng/i,
    /eketsa\s+chelete\s+ea\s+hao\s+ka\s+potlako/i,
  ]},
  { id: 'pyramid_percent', weight: 25, patterns: [
    /\d{2,3}\s*%\s*(daily|per\s+day|ka\s+letsatsi)/i,
    /daily\s+(returns?|profits?|payouts?)/i,
    /ho\s+fumana\s+\d+%.{0,15}(ka\s+letsatsi|daily)/i,
  ]},
  { id: 'pyramid_recruit', weight: 20, patterns: [
    /referral\s+(bonus|link|code)/i,
    /recruit\s+(people|friends|members)/i,
    /top\s+up\s+(wallet|account|balance)/i,
  ]},

  // --- Sesotho scam phrasing ---
  { id: 'promise_returns', weight: 30, patterns: [
    /ntshepa\s+(ho\s+)?(fumana|thola|hlola|eketsa|rua)/i,
    /ho\s+thola\s+phaello/i,
    /phaello\s+e\s+ngata/i,
    /phaello\s+e\s+phahameng/i,
    /phaello\s+e\s+tiisitsoeng/i,
    /tla\s+fumana\s+chelete/i,
    /tla\s+thola\s+chelete/i,
    /o\s+tla\s+(fumana|thola|rua|hlola)/i,
    /promise[sd]?\s+(me\s+)?(high\s+)?returns?/i,
    /promise[sd]?\s+(me\s+)?(money|profit|cash)/i,
    /high\s+returns?/i,
    /quick\s+returns?/i,
    /easy\s+money/i,
  ]},
  { id: 'link_mention', weight: 20, patterns: [
    /penya\s+(link|mona|sebaka)/i,
    /penye\s+(link|mona|sebaka)/i,
    /penyang\s+(link|mona)/i,
    /tobetsa\s+(link|mona|sebaka)/i,
    /kena\s+(link|mona)/i,
    /kopa\s+ho\s+penya/i,
    /click\s+(this|the)?\s*link/i,
    /open\s+(this|the)?\s*link/i,
    /follow\s+this\s+link/i,
    /\blink\s+mona\b/i,
    /\blink\s+e\s+latelang\b/i,
  ]},
  { id: 'someone_promising', weight: 25, patterns: [
    /motho\s+(e\s+)?mong\s+a\s+re(ng)?/i,
    /ho\s+na\s+le\s+motho\s+a\s+re(ng)?/i,
    /ba\s+re(ng)?\s+(ho|ke|u|o)/i,
    /they\s+(say|said|promise)/i,
    /someone\s+(say|said|promise|told\s+me)/i,
    /i\s+was\s+told/i,
    /a\s+friend\s+(told|said)/i,
  ]},
  { id: 'investment_opportunity', weight: 20, patterns: [
    /investment\s+opportunit/i,
    /business\s+opportunit/i,
    /money\s+making\s+opportunit/i,
    /monyetla\s+wa\s+(kgwebo|matsete|chelete)/i,
    /monyetla\s+oa\s+(khoebo|matsete|chelete)/i,
  ]},

  // --- Fee-to-claim ---
  { id: 'fee_to_receive', weight: 35, patterns: [
    /send\s+(M|R)?\s*\d+.{0,30}(receive|get|claim|win)/i,
    /pay\s+(M|R)?\s*\d+.{0,30}(receive|get|claim)/i,
    /(M|R)\s*\d+\s*(to|→|-)\s*(M|R)\s*\d{3,}/i,
    /romela\s+(M|R)?\s*\d+.{0,30}(fumana|hlola|thola)/i,
    /lefa\s+(M|R)?\s*\d+.{0,30}(fumana|hlola)/i,
  ]},
  { id: 'registration_fee', weight: 25, patterns: [
    /registration\s+fee/i,
    /activation\s+fee/i,
    /processing\s+fee/i,
    /joining\s+fee/i,
    /tefiso\s+ea\s+ho\s+ingolisa/i,
    /tefiso\s+ea\s+ho\s+qala/i,
    /tefiso\s+ea\s+ho\s+kena/i,
  ]},

  // --- Phishing / suspicious link ---
  { id: 'short_link', weight: 25, patterns: [
    /(bit\.ly|tinyurl\.com|t\.co|shorturl|is\.gd|cutt\.ly|rebrand\.ly)/i,
  ]},
  { id: 'suspicious_host', weight: 30, patterns: [
    /(onrender\.com|vercel\.app|netlify\.app|glitch\.me|herokuapp\.com)/i,
    /\.(xyz|top|tk|ml|ga|cf|gq)(\/|\b)/i,
  ]},
  { id: 'inst_url_combo', weight: 40, requireUrl: true, patterns: [
    /(econet|vodacom|m-?pesa|mpesa|ecocash|e-?cash|standard\s+lesotho|nedbank|fnb|postbank|central\s+bank|space\s?x)/i,
  ]},
  { id: 'click_now', weight: 15, patterns: [
    /click\s+(here|this|below|the link)/i,
    /penya\s+(link|mona)/i,
    /penya\s+hang/i,
  ]},

  // --- Unexpected prize ---
  { id: 'you_won', weight: 25, patterns: [
    /you('ve| have)\s+won/i,
    /you\s+are\s+(the\s+)?(lucky\s+)?(winner|selected)/i,
    /congratulations.{0,40}(M|R)\s*\d+/i,
    /claim\s+your\s+(prize|reward|money)/i,
    /\bo\s+hlotse\b/i,
    /u\s+hlotse/i,
    /o\s+thopile/i,
    /u\s+thopile/i,
    /u\s+hapile/i,
    /o\s+hapile/i,
  ]},

  // --- Job scam ---
  { id: 'job_scam', weight: 25, patterns: [
    /work\s+from\s+home.{0,40}(M|R)\s*\d+/i,
    /(M|R)\s*\d+.{0,20}per\s+day.{0,30}no\s+experience/i,
    /no\s+experience\s+needed.{0,40}(M|R)\s*\d+/i,
    /pay.{0,20}(registration|training).{0,30}job/i,
    /hanka\s+patala/i,
    /ha\s+ke\s+patala/i,
    /ke\s+tshepisitswe\s+mosebetsi/i,
  ]},

  // --- Fake accommodation (NUL students) ---
  { id: 'accom_scam', weight: 35, patterns: [
    /deposit\s+(before|without).{0,20}(view|see|visit)/i,
    /landlord.{0,30}(overseas|abroad|out\s+of\s+(the\s+)?country)/i,
    /pay.{0,30}only.{0,30}(ecocash|e-?cash|m-?pesa|e-?wallet)/i,
    /send\s+deposit.{0,20}hold/i,
    /romela\s+deposit/i,
    /romela\s+chelete.{0,30}(ntlo|kamore|bolulo)/i,
  ]},

  // --- Loan app ---
  { id: 'loan_scam', weight: 20, patterns: [
    /instant\s+loan/i,
    /no\s+(paperwork|credit\s+check|papers)/i,
    /(M|R)\s*\d+.{0,30}in\s+\d+\s+minutes/i,
    /\d{2,3}\s*%.{0,10}(interest|monthly).{0,20}no\s+(papers|paperwork)/i,
    /kalimo.{0,20}potlako/i,
  ]},

  // --- Impersonation ---
  { id: 'impersonation', weight: 40, patterns: [
    /verify\s+your\s+(pin|otp|password|account)/i,
    /confirm\s+your\s+(pin|otp|password|account)/i,
    /your\s+account.{0,30}(suspended|blocked|locked|closed)/i,
    /netefatsa\s+(pin|password|otp)/i,
    /akhaonto\s+ea\s+hao\s+e\s+(koetsoe|notletsoe)/i,
  ]},

  // --- Urgency (small weight alone) ---
  { id: 'urgency', weight: 10, patterns: [
    /\burgent(ly)?\b/i,
    /act\s+(now|fast|immediately)/i,
    /limited\s+(time|spots|slots)/i,
    /expires?\s+(in|today|soon|tonight)/i,
    /\bhanghang\b/i,
    /ka\s+potlako/i,
    /kapele\s+ka\s+potlako/i,
  ]},
];

// ---------- Red-flag labels (shown to the user) ----------

const FLAG_LABELS = {
  pay_first:              { en: 'Asks you to pay before you receive anything',                st: 'E kopa hore u lefe pele u fumana letho' },
  leave_property:         { en: 'Asks you to leave property as "proof"',                      st: 'E kopa hore u sie thepa ea hao e le "bopaki"' },
  monthly_scheme:         { en: 'Pay once, receive monthly — classic pyramid signal',         st: 'Lefa hang, fumana khoeli le khoeli — letshwao la pyramid' },
  pyramid_invite:         { en: 'Promises money for recruiting other people',                 st: 'E tshepisa chelete ha u kenyelletsa batho ba bang' },
  pyramid_double:         { en: 'Promises to double your money or guaranteed returns',        st: 'E tshepisa ho eketsa chelete ea hao kapa phaello e tiisitsoeng' },
  pyramid_percent:        { en: 'Promises unrealistically high daily returns',                st: 'E tshepisa phaello e phahameng haholo letsatsi le letsatsi' },
  pyramid_recruit:        { en: 'Uses referral or top-up language typical of pyramid schemes', st: 'E sebelisa mantsoe a referral kapa top-up' },
  promise_returns:        { en: 'Promises high or guaranteed returns',                        st: 'E tshepisa phaello e phahameng kapa e tiisitsoeng' },
  link_mention:           { en: 'Asks you to click a link',                                   st: 'E kopa hore u penye link' },
  someone_promising:      { en: 'Someone is promising you money or returns',                  st: 'Motho e mong o u tshepisa chelete kapa phaello' },
  investment_opportunity: { en: 'Framed as an investment or business opportunity',            st: 'E hlalosoa e le monyetla oa khoebo kapa matsete' },
  fee_to_receive:         { en: 'Asks you to send money to receive more money',               st: 'E kopa hore u romelle chelete ho fumana e ngata' },
  registration_fee:       { en: 'Charges a registration or activation fee',                   st: 'E lefisa tefiso ea ho ingolisa kapa ho qala' },
  short_link:             { en: 'Uses a shortened link that hides the real website',          st: 'E sebelisa link e khutsufalitsoeng e patang webosaete ea nnete' },
  suspicious_host:        { en: 'Link points to a free or suspicious hosting site',           st: 'Link e lebisa ho webosaete ea mahala kapa e belaetsang' },
  inst_url_combo:         { en: 'Mentions a bank or company but uses an unofficial link',     st: 'E bua ka banka kapa khamphani empa e sebelisa link e seng ea molao' },
  click_now:              { en: 'Urges you to click a link',                                  st: 'E u qobella ho penya link' },
  you_won:                { en: 'Claims you won something you did not enter for',             st: 'E re u hlotse ntho eo u sa e kenang' },
  job_scam:               { en: 'Job offer that sounds too good and asks for money',          st: 'Mosebetsi o utlwahalang o le motle haholo mme o kopa chelete' },
  accom_scam:             { en: 'Asks for a deposit before you can view the place',           st: 'E kopa deposit pele u ka bona sebaka' },
  loan_scam:              { en: 'Loan offer with unrealistic terms',                          st: 'Kalimo e nang le maemo a sa utlwahaleng' },
  impersonation:          { en: 'Asks for your PIN, OTP, or password',                        st: 'E kopa PIN, OTP kapa password ea hao' },
  urgency:                { en: 'Urges you to act fast',                                      st: 'E u potlakisa ho etsa kapele' },
};

// ---------- Sesotho detection hint ----------

const SESOTHO_HINT = /\b(ke|eng|ho|chelete|mali|romela|fumana|penya|penye|link|netefatsa|lefisa|tefiso|bankeng|moputso|hlotse|hapile|kalimo|ntlo|bolulo|joang|hobaneng|motho|reng|ntshepa|thola|phaello|ngata|hona|sie|koloi|fono|thepa|patala|tshepisa)\b/i;

// ---------- Detection ----------

export function detectScam(text) {
  if (!text || typeof text !== 'string') {
    return { risk: 0, level: 'safe', flags: [], isSesotho: false };
  }

  const hasUrl = URL_RE.test(text);
  const flags = [];
  let score = 0;

  for (const rule of SCAM_PATTERNS) {
    if (rule.requireUrl && !hasUrl) continue;
    for (const p of rule.patterns) {
      if (p.test(text)) {
        score += rule.weight;
        if (!flags.includes(rule.id)) flags.push(rule.id);
        break;
      }
    }
  }

  // Bonus: URL present AND financial language → very likely phishing
  if (hasUrl && /(money|chelete|account|akhaonto|loan|kalimo|invest|matsete|prize|moputso|phaello)/i.test(text)) {
    score += 15;
    if (!flags.includes('inst_url_combo')) flags.push('inst_url_combo');
  }

  // Bonus: link mentioned but no actual URL + financial language
  if (!hasUrl && /(link|penya|penye|penyang|tobetsa|click)/i.test(text) && /(money|chelete|phaello|returns?|profit|fumana|thola|hlola|ntshepa)/i.test(text)) {
    score += 20;
    if (!flags.includes('link_mention')) flags.push('link_mention');
  }

  if (score > 100) score = 100;

  let level = 'safe';
  if (score >= 60) level = 'high';
  else if (score >= 35) level = 'suspicious';

  return {
    risk: score,
    level,
    flags,
    isSesotho: SESOTHO_HINT.test(text),
  };
}

// ---------- Response builder ----------

export function buildScamResponse(detection) {
  const { flags, isSesotho } = detection;

  const header = isSesotho
    ? '⚠️ Hona ho shebahala joalo ka boqhekanyetsi (scam).'
    : '⚠️ This looks like a scam.';

  const flagList = flags
    .map((f) => FLAG_LABELS[f])
    .filter(Boolean)
    .slice(0, 5)
    .map((l) => '• ' + (isSesotho ? l.st : l.en))
    .join('\n');

  const actions = isSesotho
    ? [
        'Seke oa romela chelete.',
        'Seke oa penya link.',
        'Netefatsa le banka ea hao.',
        'E tlalehe ho mapolesa.',
      ]
    : [
        'Do not send money.',
        'Do not click the link.',
        'Verify with your bank.',
        'Report it to the police.',
      ];

  const intro = isSesotho ? 'Lintlha tseo re li hlokometseng:' : 'Red flags:';

  const ending = isSesotho
    ? 'Haeba u se u rometse chelete kapa u penye link, ikopanye le banka ea hao kapa Econet hanghang.'
    : 'If you already sent money or clicked the link, contact your bank or Econet immediately.';

  return [header, '', intro, flagList, '', actions.join('\n'), '', ending].join('\n');
}

export function buildScamCaution(isSesotho) {
  return isSesotho
    ? '\n\n⚠️ Tlhokomeliso: Molaetsa ona o ka ba le matshwao a boqhekanyetsi. Netefatsa pele u romela chelete kapa ho penya link.'
    : '\n\n⚠️ Caution: This message has some scam-like signals. Verify before sending money or clicking any link.';
}