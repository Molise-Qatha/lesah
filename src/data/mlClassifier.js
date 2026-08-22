// Extract amount from question
function extractAmount(question) {
  const matches = question.match(/m(\d+)/i) || question.match(/(\d+)/);
  if (matches) {
    return parseInt(matches[1]);
  }
  return null;
}

// Personalize saving advice based on amount
function personalizeSavingAdvice(amount, lang, level) {
  if (!amount) return null;
  
  const saveAmount = Math.round(amount * 0.2);
  const spendAmount = amount - saveAmount;
  
  if (lang === 'sesotho') {
    if (level === 'primary') {
      return `U na le M${amount}. Boloka M${saveAmount} 'me u sebelise M${spendAmount}.`;
    } else if (level === 'high_school') {
      return `U na le M${amount}. Ka molao oa 50/30/20, boloka M${saveAmount} (20%) 'me u sebelise M${spendAmount}.`;
    } else {
      return `U na le M${amount}. Boloka M${saveAmount} (20%) bakeng sa poloko, 'me u sebelise M${spendAmount}.`;
    }
  } else {
    if (level === 'primary') {
      return `You have M${amount}. Save M${saveAmount} and use M${spendAmount}.`;
    } else if (level === 'high_school') {
      return `You have M${amount}. Following the 50/30/20 rule, save M${saveAmount} (20%) and use M${spendAmount}.`;
    } else {
      return `You have M${amount}. Save M${saveAmount} (20%) and allocate M${spendAmount} for spending.`;
    }
  }
}

export function getAIResponse(question, gradeId, language) {
  if (!trainedModel || !knowledgeBase) {
    return language === 'sesotho' 
      ? 'AI e ntse e qala. Ka kopo leka hape.' 
      : 'AI is still loading. Please try again.';
  }

  const result = classifyTopic(question);
  const level = getLevel(gradeId);
  const lang = detectLanguage(question, language);
  const amount = extractAmount(question);

  // Fallback topic detection from keywords
  let topicId = result.topic;
  if (topicId === 'unknown' || result.confidence < 0.1) {
    const q = question.toLowerCase();
    if (/bolok|save|saving|poloko/.test(q)) topicId = 'saving';
    else if (/chelete|money|maloti|lisente/.test(q)) topicId = 'money';
    else if (/tekanyetso|budget|moralo/.test(q)) topicId = 'budgeting';
    else if (/phaello|interest|tswala/.test(q)) topicId = 'interest';
    else if (/kalimo|loan|sekoloto|alima|borrow/.test(q)) topicId = 'loans';
    else if (/moputso|income|fumana|earn/.test(q)) topicId = 'income';
    else if (/banka|bank|akhaonto|deposit|withdraw/.test(q)) topicId = 'banking';
    else if (/tlhoko|takatso|need|want/.test(q)) topicId = 'needs_wants';
    else if (/lumela|hello|hi|dumela/.test(q)) topicId = 'greeting';
  }

  const topicData = knowledgeBase[topicId];
  if (!topicData) {
    return lang === 'sesotho' 
      ? 'Ke utloisisa potso ea hau. Na u botsa ka ho boloka, tekanyetso, kapa chelete?' 
      : 'I understand your question. Are you asking about saving, budgeting, or money?';
  }

  // Detect intent
  let intent = 'definition';
  if (/how do|how can|how to|how should|how does|joang|kamoo|jwang/i.test(question)) intent = 'how_to';
  else if (/why|hobaneng|ke hobane/i.test(question)) intent = 'why';
  else if (/should|advice|recommend|keletso|nka etsa eng/i.test(question)) intent = 'advice';
  else if (/scenario|what if|haeba|ha kere/i.test(question)) intent = 'scenarios';

  let answer = '';

  // PERSONALIZATION: If amount exists AND saving topic AND how_to intent
  if (amount && topicId === 'saving' && (intent === 'how_to' || intent === 'advice')) {
    const personalized = personalizeSavingAdvice(amount, lang, level);
    if (personalized) {
      answer = personalized;
    }
  }

  // If no personalized answer, use standard responses
  if (!answer && intent === 'how_to' && topicData.how_to && topicData.how_to[level]) {
    const item = getRandom(topicData.how_to[level]);
    const text = getText(item, lang);
    if (text) answer = text;
  }

  if (!answer && intent === 'why' && topicData.why && topicData.why[level]) {
    const item = getRandom(topicData.why[level]);
    const text = getText(item, lang);
    if (text) answer = text;
  }

  if (!answer && intent === 'advice' && topicData.scenarios && topicData.scenarios[level]) {
    const scenario = getRandom(topicData.scenarios[level]);
    if (scenario) {
      const advice = getText(scenario.advice, lang);
      if (advice) answer = advice;
    }
  }

  if (!answer && topicData.definitions && topicData.definitions[level]) {
    const item = getRandom(topicData.definitions[level]);
    const text = getText(item, lang);
    if (text) answer = text;
  }

  // Add example with 50% probability (skip if already personalized)
  if (!amount && topicData.examples && topicData.examples[level] && Math.random() < 0.5) {
    const item = getRandom(topicData.examples[level]);
    const text = getText(item, lang);
    if (text) {
      answer += '\n\n' + (lang === 'sesotho' ? 'Mohlala: ' : 'Example: ') + text;
    }
  }

  // Add misconception with 30% probability
  if (topicData.misconceptions && topicData.misconceptions[level] && Math.random() < 0.3) {
    const item = getRandom(topicData.misconceptions[level]);
    const text = getText(item, lang);
    if (text) {
      answer += '\n\n' + (lang === 'sesotho' ? 'Ntlha ea bohlokoa: ' : 'Important: ') + text;
    }
  }

  // Add follow-up with 40% probability
  if (topicData.follow_up_suggestions && Math.random() < 0.4) {
    const item = getRandom(topicData.follow_up_suggestions);
    const text = getText(item, lang);
    if (text) {
      answer += '\n\n' + text;
    }
  }

  return answer || (lang === 'sesotho' ? 'Ke utloisisa potso ea hau.' : 'I understand your question.');
}