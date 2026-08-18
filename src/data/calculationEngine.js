// ── CALCULATION ENGINE ─────────────────────────────────────

export const calculationEngine = {
  // Try to detect if the question involves a calculation
  detectCalculation: (question) => {
    const q = question.toLowerCase();
    
    // Check for money amounts
    const amounts = q.match(/m(\d+)/g) || [];
    const numbers = q.match(/\d+/g) || [];
    
    // Check for operation keywords
    const hasSave = /save|saving|boloka|poloko/.test(q);
    const hasInterest = /interest|phaello|tswala/.test(q);
    const hasBudget = /budget|tekanyetso|plan|spend|sebelisa/.test(q);
    const hasProfit = /profit|phaello|earn|fumana/.test(q);
    const hasTotal = /total|kakaretso|how much|bokae|all together/.test(q);
    const hasMultiply = /times|multiply|×|per month|per week|ka khoeli|ka beke/.test(q);
    const hasPercent = /percent|peresente|%/.test(q);
    const hasMonths = /month|months|khoeli|khoeling|likhoeli/.test(q);
    const hasWeeks = /week|weeks|beke|libeke/.test(q);
    const hasYears = /year|years|selemo|lilemo/.test(q);
    
    return {
      isCalculation: numbers.length >= 2 && (hasSave || hasInterest || hasBudget || hasProfit || hasTotal || hasMultiply),
      amounts,
      numbers: numbers.map(Number),
      hasInterest,
      hasBudget,
      hasProfit,
      hasTotal,
      hasMultiply,
      hasPercent,
      hasMonths,
      hasWeeks,
      hasYears,
    };
  },

  // Calculate simple interest
  calculateSimpleInterest: (principal, rate, time) => {
    const interest = principal * (rate / 100) * time;
    const total = principal + interest;
    return { principal, rate, time, interest, total };
  },

  // Calculate compound interest
  calculateCompoundInterest: (principal, rate, time) => {
    const total = principal * Math.pow(1 + rate / 100, time);
    const interest = total - principal;
    return { principal, rate, time, interest, total };
  },

  // Calculate savings over time
  calculateSavings: (monthlyAmount, months) => {
    return monthlyAmount * months;
  },

  // Calculate weekly savings
  calculateWeeklySavings: (weeklyAmount, weeks) => {
    return weeklyAmount * weeks;
  },

  // Calculate profit
  calculateProfit: (revenue, cost) => {
    return revenue - cost;
  },

  // Calculate percentage
  calculatePercentage: (value, percent) => {
    return value * (percent / 100);
  },

  // Calculate budget allocation
  calculateBudget: (total, allocations) => {
    const sum = allocations.reduce((a, b) => a + b, 0);
    return { total, allocated: sum, remaining: total - sum };
  },

  // Main function to solve a calculation question
  solve: (question, language = 'english') => {
    const detection = calculationEngine.detectCalculation(question);
    if (!detection.isCalculation) return null;

    const nums = detection.numbers;
    const lang = language === 'sesotho' ? 'sesotho' : 'english';

    // Case 1: "If I save M50 every month for 12 months, how much will I have?"
    if (detection.hasSave && detection.hasMonths && nums.length >= 2) {
      const monthly = nums[0];
      const months = nums[1];
      const total = calculationEngine.calculateSavings(monthly, months);
      return {
        type: 'savings',
        explanation: {
          english: `If you save M${monthly} every month for ${months} months:\n\nM${monthly} × ${months} = M${total}\n\nYou will have M${total} saved.`,
          sesotho: `Haeba u boloka M${monthly} khoeli le khoeli ka likhoeli tse ${months}:\n\nM${monthly} × ${months} = M${total}\n\nU tla be u bolokile M${total}.`,
        },
        result: total,
      };
    }

    // Case 2: "If I save M50 every week for 12 weeks, how much?"
    if (detection.hasSave && detection.hasWeeks && nums.length >= 2) {
      const weekly = nums[0];
      const weeks = nums[1];
      const total = calculationEngine.calculateWeeklySavings(weekly, weeks);
      return {
        type: 'weekly_savings',
        explanation: {
          english: `If you save M${weekly} every week for ${weeks} weeks:\n\nM${weekly} × ${weeks} = M${total}\n\nYou will have M${total} saved.`,
          sesotho: `Haeba u boloka M${weekly} beke le beke ka libeke tse ${weeks}:\n\nM${weekly} × ${weeks} = M${total}\n\nU tla be u bolokile M${total}.`,
        },
        result: total,
      };
    }

    // Case 3: Simple interest
    if (detection.hasInterest && nums.length >= 3) {
      const principal = nums[0];
      const rate = nums[1];
      const time = nums[2];
      const result = calculationEngine.calculateSimpleInterest(principal, rate, time);
      return {
        type: 'simple_interest',
        explanation: {
          english: `Simple Interest Calculation:\n\nPrincipal: M${principal}\nRate: ${rate}%\nTime: ${time} year(s)\n\nInterest = M${principal} × ${rate}% × ${time} = M${result.interest.toFixed(2)}\nTotal = M${principal} + M${result.interest.toFixed(2)} = M${result.total.toFixed(2)}`,
          sesotho: `Palo ea Phaello e Bonolo:\n\nChelete: M${principal}\nPhaello: ${rate}%\nNako: ${time} selemo(s)\n\nPhaello = M${principal} × ${rate}% × ${time} = M${result.interest.toFixed(2)}\nKakaretso = M${principal} + M${result.interest.toFixed(2)} = M${result.total.toFixed(2)}`,
        },
        result: result.total,
      };
    }

    // Case 4: Percentage
    if (detection.hasPercent && nums.length >= 2) {
      const value = nums[0];
      const percent = nums[1];
      const result = calculationEngine.calculatePercentage(value, percent);
      return {
        type: 'percentage',
        explanation: {
          english: `${percent}% of M${value}:\n\nM${value} × ${percent}% = M${result.toFixed(2)}`,
          sesotho: `${percent}% ea M${value}:\n\nM${value} × ${percent}% = M${result.toFixed(2)}`,
        },
        result,
      };
    }

    // Case 5: Budget
    if (detection.hasBudget && nums.length >= 2) {
      const total = nums[0];
      const spent = nums.slice(1).reduce((a, b) => a + b, 0);
      const remaining = total - spent;
      return {
        type: 'budget',
        explanation: {
          english: `Budget: M${total}\nSpent: M${spent}\nRemaining: M${remaining}`,
          sesotho: `Tekanyetso: M${total}\nE sebelisitsoeng: M${spent}\nE setseng: M${remaining}`,
        },
        result: remaining,
      };
    }

    // Case 6: Profit
    if (detection.hasProfit && nums.length >= 2) {
      const revenue = nums[0];
      const cost = nums[1];
      const profit = calculationEngine.calculateProfit(revenue, cost);
      return {
        type: 'profit',
        explanation: {
          english: `Revenue: M${revenue}\nCost: M${cost}\nProfit = M${revenue} - M${cost} = M${profit}`,
          sesotho: `Chelete e kenang: M${revenue}\nLitšenyehelo: M${cost}\nPhaello = M${revenue} - M${cost} = M${profit}`,
        },
        result: profit,
      };
    }

    return null;
  },
};