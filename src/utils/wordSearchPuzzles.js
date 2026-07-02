// src/utils/wordSearchPuzzles.js

// Word banks as provided
const WORD_BANKS = {
  studentLife: ['STUDENT','LECTURE','EXAM','TEST','LIBRARY','DEGREE','ASSIGNMENT','SEMESTER','CAMPUS','HOSTEL','CLASSROOM','NOTEBOOK','PEN','BOOK','RESEARCH','STUDY','LEARNING','UNIVERSITY','SCHOLARSHIP','DIPLOMA'],
  accommodation: ['ROOM','RENT','LANDLORD','TENANT','HOSTEL','SECURITY','BATHROOM','KITCHEN','BED','WINDOW','DOOR','HOUSE','HOME','GATE','ELECTRICITY','WATER','FURNITURE','WARDROBE','MATTRESS','KEY'],
  technology: ['COMPUTER','LAPTOP','PHONE','TABLET','SOFTWARE','INTERNET','WEBSITE','PROGRAMMING','JAVASCRIPT','REACT','PYTHON','DATABASE','SERVER','NETWORK','EMAIL','PASSWORD','LOGIN','KEYBOARD','MOUSE','MONITOR'],
  lesotho: ['LESOTHO','BASOTHO','ROMA','MASERU','MALOTI','THABA','MOKHOTLONG','QUTHING','LERIBE','BUTHA','BEREA','MOHALE','SENQU','MATEKANE','SESOTHO','KINGDOM','AFRICA','MOUNTAIN','HIGHLANDS','BLANKET'],
  positive: ['SUCCESS','FOCUS','DISCIPLINE','KNOWLEDGE','COURAGE','AMBITION','LEADER','DREAM','VISION','FUTURE','PROGRESS','GROWTH','OPPORTUNITY','CREATIVITY','BUSINESS','ACHIEVEMENT','INNOVATION','MOTIVATION','CONFIDENCE','PERSISTENCE']
};

// All words flattened (unique)
const ALL_WORDS = [...new Set(Object.values(WORD_BANKS).flat())].filter(w => w.length <= 10);

// Directions: right, down, down-right, down-left
const DIRECTIONS = [
  [0, 1],  // horizontal
  [1, 0],  // vertical
  [1, 1],  // diagonal down-right
  [1, -1]  // diagonal down-left
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createPuzzle(words, size = 10) {
  // Initialize grid with nulls
  const grid = Array(size).fill().map(() => Array(size).fill(null));
  const placedWords = [];

  // Random order of words
  const shuffledWords = shuffleArray(words);

  for (const word of shuffledWords) {
    if (word.length > size) continue;
    let placed = false;
    for (let attempt = 0; attempt < 20; attempt++) {
      const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const row = getRandomInt(0, size - 1);
      const col = getRandomInt(0, size - 1);

      // Check if word fits
      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const r = row + dir[0] * i;
        const c = col + dir[1] * i;
        if (r < 0 || r >= size || c < 0 || c >= size || (grid[r][c] !== null && grid[r][c] !== word[i])) {
          fits = false;
          break;
        }
      }
      if (fits) {
        for (let i = 0; i < word.length; i++) {
          const r = row + dir[0] * i;
          const c = col + dir[1] * i;
          grid[r][c] = word[i];
        }
        placedWords.push(word);
        placed = true;
        break;
      }
    }
    // If not placed, skip (it's okay; we'll have fewer words)
  }

  // Fill empty cells with random letters
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
    words: placedWords
  };
}

// Generate 50 puzzles
const PUZZLE_COUNT = 50;
export const puzzles = Array.from({ length: PUZZLE_COUNT }, () => {
  // Pick 6–8 random words from the combined list
  const shuffledAll = shuffleArray(ALL_WORDS);
  const selectedWords = shuffledAll.slice(0, getRandomInt(6, 8));
  return createPuzzle(selectedWords, 10);
});