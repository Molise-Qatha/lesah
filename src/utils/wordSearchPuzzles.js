// src/utils/wordSearchPuzzles.js

// ===================== WORD BANKS =====================
const WORD_BANKS = {
  studentLife: ['STUDENT','LECTURE','EXAM','TEST','LIBRARY','DEGREE','ASSIGNMENT','SEMESTER','CAMPUS','HOSTEL',
                'CLASSROOM','NOTEBOOK','PEN','BOOK','RESEARCH','STUDY','LEARNING','UNIVERSITY','SCHOLARSHIP','DIPLOMA'],
  accommodation: ['ROOM','RENT','LANDLORD','TENANT','SECURITY','BATHROOM','KITCHEN','BED','WINDOW','DOOR',
                  'HOUSE','HOME','GATE','ELECTRICITY','WATER','FURNITURE','WARDROBE','MATTRESS','KEY'],
  technology: ['COMPUTER','LAPTOP','PHONE','TABLET','SOFTWARE','INTERNET','WEBSITE','PROGRAMMING','JAVASCRIPT',
               'REACT','PYTHON','DATABASE','SERVER','NETWORK','EMAIL','PASSWORD','LOGIN','KEYBOARD','MOUSE','MONITOR'],
  lesotho: ['LESOTHO','BASOTHO','ROMA','MASERU','MALOTI','THABA','MOKHOTLONG','QUTHING','LERIBE','BUTHA',
            'BEREA','MOHALE','SENQU','MATEKANE','SESOTHO','KINGDOM','AFRICA','MOUNTAIN','HIGHLANDS','BLANKET'],
  positive: ['SUCCESS','FOCUS','DISCIPLINE','KNOWLEDGE','COURAGE','AMBITION','LEADER','DREAM','VISION','FUTURE',
             'PROGRESS','GROWTH','OPPORTUNITY','CREATIVITY','BUSINESS','ACHIEVEMENT','INNOVATION','MOTIVATION',
             'CONFIDENCE','PERSISTENCE'],
};

const ALL_WORDS = [...new Set(Object.values(WORD_BANKS).flat())].filter(w => w.length <= 10);

// ===================== DIRECTIONS =====================
const DIRECTIONS = [
  { dr: 0, dc: 1, name: 'horizontal' },
  { dr: 1, dc: 0, name: 'vertical' },
  { dr: 1, dc: 1, name: 'diagonal-down-right' },
  { dr: 1, dc: -1, name: 'diagonal-down-left' },
];

// ===================== HELPERS =====================
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ===================== PUZZLE CREATOR =====================
function createPuzzle(words, size = 10, maxAttempts = 100) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // 1. Fresh empty grid
    const grid = Array(size).fill().map(() => Array(size).fill(null));
    const placedWords = [];    // { word, startRow, startCol, endRow, endCol, direction }

    // 2. Shuffle words for random placement order
    const shuffled = shuffleArray(words);

    // 3. Try to place each word
    let allPlaced = true;
    for (const word of shuffled) {
      let placed = false;
      // Try up to 50 positions/directions for this word
      for (let posAttempt = 0; posAttempt < 50; posAttempt++) {
        const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
        const row = randomInt(0, size - 1);
        const col = randomInt(0, size - 1);

        // Check if word fits
        let fits = true;
        const endRow = row + dir.dr * (word.length - 1);
        const endCol = col + dir.dc * (word.length - 1);
        if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) {
          fits = false;
        } else {
          for (let i = 0; i < word.length; i++) {
            const r = row + dir.dr * i;
            const c = col + dir.dc * i;
            if (grid[r][c] !== null && grid[r][c] !== word[i]) {
              fits = false;
              break;
            }
          }
        }

        if (fits) {
          // Place it
          for (let i = 0; i < word.length; i++) {
            const r = row + dir.dr * i;
            const c = col + dir.dc * i;
            grid[r][c] = word[i];
          }
          placedWords.push({
            word,
            startRow: row,
            startCol: col,
            endRow,
            endCol,
            direction: dir.name,
          });
          placed = true;
          break;
        }
      }

      if (!placed) {
        // This word couldn't be placed – start over with a fresh grid
        allPlaced = false;
        break;
      }
    }

    // 4. If all words were placed, fill empty cells and return
    if (allPlaced && placedWords.length === words.length) {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (grid[r][c] === null) {
            grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
          }
        }
      }

      return {
        grid,
        words: placedWords.map(p => p.word),
        placedWords,   // coordinates stored here
      };
    }
  }

  // Fallback: if we can't generate after maxAttempts, return a minimal puzzle
  console.warn('Could not generate puzzle after many attempts. Returning fallback.');
  const grid = Array(size).fill().map(() => Array(size).fill('A'));
  return { grid, words: ['LESOTHO'], placedWords: [{ word: 'LESOTHO', startRow: 0, startCol: 0, endRow: 0, endCol: 6, direction: 'horizontal' }] };
}

// ===================== GENERATE 50 PUZZLES =====================
const PUZZLE_COUNT = 50;
export const puzzles = Array.from({ length: PUZZLE_COUNT }, () => {
  const shuffledAll = shuffleArray(ALL_WORDS);
  const selectedWords = shuffledAll.slice(0, randomInt(6, 8));
  return createPuzzle(selectedWords, 10);
});

// Optional: log generation stats (only in development)
if (process.env.NODE_ENV === 'development') {
  puzzles.forEach((p, i) => {
    const placedCount = p.placedWords.length;
    const missing = p.words.length - placedCount;
    if (missing > 0) {
      console.warn(`Puzzle ${i}: ${missing} words missing!`);
    } else {
      console.log(`Puzzle ${i}: all ${placedCount} words placed successfully.`);
    }
  });
}