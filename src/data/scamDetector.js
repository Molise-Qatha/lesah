// ============================================================
//  LeSAH · Scam Detector
//  Offline-first scam pattern detection for Lesotho context
//  Runs entirely in the browser — no network required
// ============================================================

const URL_RE = /https?:\/\/|www\./i;

// ---------- Patterns ----------
// Each rule has an id, weight, and one or more regex patterns.
// Weights add up to a risk score 0–100.

const SCAM_PATTERNS = [
  // --- Pyramid / Ponzi / investment scheme ---
  { id: 'pyramid_invite', weight: 30, patterns: [
    /invite\s+\d+\s+(people|friends|members)/i,
    /refer\s+\d+\s+(people|friends)/i,
    /downline/i,
    /ho\s+kenyelletsa\s+\d+\s+batho/i,
  ]},
  { id: 'pyramid_double', weight: 30, patterns: [
    /double\s+your\s+(money|investment|cash)/i,
    /guaranteed\s+(returns?|profit)/i,
    /ho\s+eketsa\s+chelete\s+ea\s+hao/i,
    /chelete\s+e\s+tiisitsoeng/i,
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

  // --- Fee-to-claim ---
  { id: 'fee_to_receive', weight: 35, patterns: [
    /send\s+(M|R)?\s*\d+.{0,30}(receive|get|claim|win)/i,
    /pay\s+(M|R)?\s*\d+.{0,30}(receive|get|claim)/i,
    /(M|R)\s*\d+\s*(to|→|-)\s*(M|R)\s*\d{3,}/i,
    /romela\s+(M|R)?\s*\d+.{0,30}(fumana|hlola)/i,
  ]},
  { id: 'registration_fee', weight: 25, patterns: [
    /registration\s+fee/i,
    /activation\s+fee/i,
    /processing\s+fee/i,
    /joining\s+fee/i,
    /tefiso\s+ea\s+ho\s+ingolisa/i,
    /tefiso\s+ea\s+ho\s+qala/i,
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
  ]},

  // --- Unexpected prize ---
  { id: 'you_won', weight: 25, patterns: [
    /you('ve| have)\s+won/i,
    /you\s+are\s+(the\s+)?(lucky\s+)?(winner|selected)/i,
    /congratulations.{0,40}(M|R)\s*\d+/i,
    /claim\s+your\s+(prize|reward|money)/i,
    /\bo\s+hlotse\b/i,
  ]},

  // --- Job scam ---
  { id: 'job_scam', weight: 25, patterns: [
    /work\s+from\s+home.{0,40}(M|R)\s*\d+/i,
    /(M|R)\s*\d+.{0,20}per\s+day.{0,30}no\s+experience/i,
    /no\s+experience\s+needed.{0,40}(M|R)\s*\d+/i,
    /pay.{0,20}(registration|training).{0,30}job/i,
  ]},

  // --- Fake accommodation (NUL students) ---
  { id: 'accom_scam', weight: 35, patterns: [
    /deposit\s+(before|without).{0,20}(view|see|visit)/i,
    /landlord.{0,30}(overseas|abroad|out\s+of\s+(the\s+)?country)/i,
    /pay.{0,30}only.{0,30}(ecocash|e-?cash|m-?pesa|e-?wallet)/i,
    /send\s+deposit.{0,20}hold/i,
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
    /netefatsa\s+(pin|password)/i,
  ]},

  // --- Urgency (small weight alone) ---
  { id: 'urgency', weight: 10, patterns: [
    /\burgent(ly)?\b/i,
    /act\s+(now|fast|immediately)/i,
    /limited\s+(time|spots|slots)/i,
    /expires?\s+(in|today|soon|tonight)/i,
    /\bhanghang\b/i,
    /ka\s+potlako/i,
  ]},
];

// ---------- Red-flag labels (shown to the user) ----------

const FLAG_LABELS = {
  pyramid_invite:    { en: 'Promises money for recruiting other people',              st: 'E tshepisa chelete ha u kenyelletsa batho ba bang' },
  pyramid_double:    { en: 'Promises to double your money or guaranteed returns',     st: 'E tshepisa ho eketsa chelete ea hao kapa phaello' },
  pyramid_percent:   { en: 'Promises unrealistically high daily returns',             st: 'E tshepisa phaello e phahameng haholo letsatsi le letsatsi' },
  pyramid_recruit:   { en: 'Uses referral or top-up language typical of pyramid schemes', st: 'E sebelisa mantsoe a referral kapa top-up' },
  fee_to_receive:    { en: 'Asks you to send money to receive more money',            st: 'E kopa hore u romelle chelete ho fumana e ngata' },
  registration_fee:  { en: 'Charges a registration or activation fee',                st: 'E lefisa tefiso ea ho ingolisa kapa ho qala' },
  short_link:        { en: 'Uses a shortened link that hides the real website',       st: 'E sebelisa link e khutsufalitsoeng e patang webosaete ea nnete' },
  suspicious_host:   { en: 'Link points to a free or suspicious hosting site',        st: 'Link e lebisa ho webosaete ea mahala kapa e belaetsang' },
  inst_url_combo:    { en: 'Mentions a bank or company but uses an unofficial link',  st: 'E bua ka banka kapa khamphani empa e sebelisa link e seng ea molao' },
  click_now:         { en: 'Urges you to click a link',                               st: 'E u qobella ho penya link' },
  you_won:           { en: 'Claims you won something you did not enter for',          st: 'E re u hlotse ntho eo u sa e kenang' },
  job_scam:          { en: 'Job offer that sounds too good and asks for money',       st: 'Mosebetsi o utloahalang o le motle haholo empa o kopa chelete pele' },
  accom_scam:        { en: 'Asks for a deposit before you can view the place',        st: 'E kopa u romelle chelete pele u ka bona sebaka' },
  loan_scam:         { en: 'Loan offer with unrealistic terms',                       st: 'Kalimo e nang le liprhelo tse sa utloahaleng' },
  impersonation:     { en: 'Asks for your PIN, OTP, or password',                     st: 'E kopa PIN, OTP kapa password ea hao' },
  urgency:           { en: 'Urges you to act fast',                                   st: 'E u qobella ho etsa kapele' },
};

// ---------- Sesotho detection hint ----------

const SESOTHO_HINT = /\b(ke|eng|ho|chelete|mali|romela|fumana|penya|link|netefatsa|lefisa|tefiso|bankeng|moputso|hlotse|kalimo|ntlo|bolulo|joang|hobaneng)\b/i;

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
  if (hasUrl && /(money|chelete|account|akhaonto|loan|kalimo|invest|matsete|prize|moputso)/i.test(text)) {
    score += 15;
    if (!flags.includes('inst_url_combo')) flags.push('inst_url_combo');
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

  const intro = isSesotho ? 'Matshoao a boqhekanyetsi ao re a hlokometseng:' : 'Red flags:';

  const ending = isSesotho
    ? 'Haeba u se u rometse chelete kapa u pentse link, ikopanye le banka ea hao kapa Econet hanghang.'
    : 'If you already sent money or clicked the link, contact your bank or Econet immediately.';

  return [header, '', intro, flagList, '', actions.join('\n'), '', ending].join('\n');
}

export function buildScamCaution(isSesotho) {
  return isSesotho
    ? '\n\n⚠️ Tlhokomeliso: Molaetsa ona o ka ba le matshao a boqhekanyetsi. Netefatsa pele u romela chelete kapa ho penya link.'
    : '\n\n⚠️ Caution: This message has some scam-like signals. Verify before sending money or clicking any link.';
}