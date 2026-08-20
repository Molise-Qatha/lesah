export const detectFinancialIntent = (question, language = 'english') => {
  const q = question.toLowerCase().trim();
  const lang = language === 'sesotho' ? 'sesotho' : 'english';
  
  // DIRECT TOPIC MATCHING — check if the question contains ANY topic keyword
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
      
      // Skip empty keywords
      if (!kw) continue;
      
      // DIRECT MATCH: "interest rate" in "what is interest rate"
      if (q.includes(kw)) {
        score += kw.length * 3;
      }
      
      // WORD-BY-WORD: "interest" in "what is interest rate"
      const kwWords = kw.split(' ');
      const qWords = q.split(' ');
      
      for (const kwWord of kwWords) {
        if (kwWord.length < 3) continue;
        for (const qWord of qWords) {
          // Exact word match
          if (qWord === kwWord) {
            score += kwWord.length * 2;
          }
          // Partial match (startswith)
          if (qWord.startsWith(kwWord) || kwWord.startsWith(qWord)) {
            if (qWord.length > 3 && kwWord.length > 3) {
              score += 2;
            }
          }
        }
      }
    }
    
    // Also check the topic ID itself
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

  // Determine intent
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