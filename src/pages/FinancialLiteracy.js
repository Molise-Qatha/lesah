// Add this import at the top:
import { detectFinancialIntent, getTopicAnswer } from '../data/financialTopics';

// Update getResponse function:
const getResponse = (question) => {
  // 1. Calculation Engine FIRST
  const calculation = calculationEngine.solve(question, language);
  if (calculation) {
    return {
      type: 'assistant',
      text: calculation.explanation[language] || calculation.explanation.english,
      time: 'Now',
      related: null,
    };
  }

  // 2. Conversational layer
  const conversational = getConversationalResponse(question, language);
  if (conversational) {
    return { type: 'assistant', text: conversational, time: 'Now', related: null };
  }

  // 3. Intent-based topic detection
  const intent = detectFinancialIntent(question, language);
  if (intent.confidence > 0.4 && intent.topic) {
    const answer = getTopicAnswer(intent.topic, intent.intent, getCurrentLevel(), language);
    if (answer) {
      let text = `**${answer.title}**\n\n`;
      if (intent.intent === 'definition' && answer.definition) {
        text += answer.definition;
      } else if (answer.intentResponse) {
        text += answer.intentResponse;
      } else if (answer.definition) {
        text += answer.definition;
      }
      if (answer.example && intent.intent !== 'definition') {
        text += `\n\n${language === 'sesotho' ? 'Mohlala' : 'Example'}: ${answer.example}`;
      }
      return { type: 'assistant', text, time: 'Now', related: null };
    }
  }

  // 4. Fallback with intelligent suggestions
  if (intent.topic && intent.confidence > 0.2) {
    return {
      type: 'assistant',
      text: language === 'sesotho'
        ? `Ke nahana hore u botsa ka ${intent.topic.replace(/_/g, ' ')}. Na u batla ho tseba hore na ke eng, hobaneng e le bohlokoa, kapa mokhoa oa ho e etsa?`
        : `I think you're asking about ${intent.topic.replace(/_/g, ' ')}. Would you like to know what it is, why it matters, or how to do it?`,
      time: 'Now',
      related: null,
    };
  }

  return {
    type: 'assistant',
    text: getRandomResponse(
      language === 'sesotho'
        ? ["Ha ke utloisise potso ea hau hantle. Na u botsa ka ho boloka, tekanyetso, phaello, likoloto, kapa chelete?"]
        : ["I want to make sure I understand. Are you asking about saving, budgeting, interest, loans, money, or something else?"]
    ),
    time: 'Now',
    related: null,
  };
};