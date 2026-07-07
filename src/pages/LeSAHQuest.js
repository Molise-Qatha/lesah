import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './LeSAHQuest.css';

/* ---------- CONSTANTS ---------- */
const BOARD_SIZE = 20; // total spaces
const LILOTHO_REWARDS = [0, 10, 5, 15, 0, 20, 10, 0, 25, 5, 0, 30, 15, 0, 20, 10, 0, 40, 25, 50]; // points per space
const SPACE_TYPES = ['start', 'study', 'challenge', 'leSAH', 'bonus', 'study', 'challenge', 'leSAH', 'bonus', 'study',
                     'challenge', 'leSAH', 'bonus', 'study', 'challenge', 'leSAH', 'bonus', 'study', 'challenge', 'finish'];

const CHALLENGES = [
  { question: "What is the capital of Lesotho?", answer: "maseru" },
  { question: "How many districts does Lesotho have?", answer: "10" },
  { question: "What does NUL stand for?", answer: "national university of lesotho" },
  { question: "Name one service LeSAH provides.", answer: "accommodation" },
  { question: "What is the currency of Lesotho?", answer: "maloti" },
  { question: "In which town is NUL located?", answer: "roma" },
  { question: "What is the Sesotho word for 'mountain'?", answer: "thaba" },
  { question: "How many players are on a soccer team?", answer: "11" },
  { question: "What is 15 + 27?", answer: "42" },
  { question: "Name a Basotho traditional food.", answer: "papa" },
];

const STUDY_GOALS = [
  "Study for 30 minutes",
  "Complete one past paper",
  "Read a chapter of a textbook",
  "Write a summary of today's lecture",
  "Teach a concept to a friend",
  "Review your notes for 20 minutes",
  "Create flashcards for a subject",
  "Watch an educational video",
];

const LESAH_ACTIONS = [
  "Browse accommodation listings",
  "Apply for a student loan",
  "Request a delivery service",
  "Order food via LeSAH Eats",
  "Check tech support options",
  "Play Lilotho game",
  "Play Word Scramble",
  "Share LeSAH with a friend",
];

/* ---------- HELPER ---------- */
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ---------- COMPONENT ---------- */
export default function LeSAHQuest() {
  const [playerPosition, setPlayerPosition] = useState(0);
  const [lilothoPoints, setLilothoPoints] = useState(0);
  const [showActionModal, setShowActionModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [challengeResult, setChallengeResult] = useState(null);
  const [studyGoal, setStudyGoal] = useState('');
  const [leSAHTask, setLeSAHTask] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
    const saved = localStorage.getItem('lesah_quest_progress');
    if (saved) {
      const data = JSON.parse(saved);
      setPlayerPosition(data.position || 0);
      setLilothoPoints(data.points || 0);
      setPlayerName(data.name || '');
      if (data.name) setGameStarted(true);
    }
    // Load leaderboard
    const lb = localStorage.getItem('lesah_quest_leaderboard');
    if (lb) setLeaderboard(JSON.parse(lb));
  }, []);

  // Save progress
  const saveProgress = useCallback(() => {
    localStorage.setItem('lesah_quest_progress', JSON.stringify({
      position: playerPosition,
      points: lilothoPoints,
      name: playerName,
    }));
  }, [playerPosition, lilothoPoints, playerName]);

  useEffect(() => {
    if (gameStarted) saveProgress();
  }, [playerPosition, lilothoPoints, gameStarted, saveProgress]);

  // Award Lilotho Points to backend (if logged in)
  const awardBackendPoints = async (pts) => {
    if (!isLoggedIn || pts <= 0) return;
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`${process.env.REACT_APP_API_URL}/api/v1/game/lilotho/points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ points: pts }),
      });
    } catch (e) { /* ignore */ }
  };

  // Start game
  const handleStart = () => {
    if (!playerName.trim()) return;
    setGameStarted(true);
    saveProgress();
  };

  // Roll the dice (advance 1-3 spaces)
  const handleRoll = () => {
    if (rolling || playerPosition >= BOARD_SIZE - 1) return;
    setRolling(true);
    const steps = Math.floor(Math.random() * 3) + 1;
    const newPos = Math.min(playerPosition + steps, BOARD_SIZE - 1);

    setTimeout(() => {
      setPlayerPosition(newPos);
      setRolling(false);

      // Check space type and trigger action
      const spaceType = SPACE_TYPES[newPos];
      if (spaceType === 'challenge') {
        const challenge = getRandomItem(CHALLENGES);
        setCurrentAction({ type: 'challenge', data: challenge });
        setChallengeAnswer('');
        setChallengeResult(null);
        setShowActionModal(true);
      } else if (spaceType === 'study') {
        const goal = getRandomItem(STUDY_GOALS);
        setStudyGoal(goal);
        setCurrentAction({ type: 'study', data: goal });
        setShowActionModal(true);
      } else if (spaceType === 'leSAH') {
        const task = getRandomItem(LESAH_ACTIONS);
        setLeSAHTask(task);
        setCurrentAction({ type: 'leSAH', data: task });
        setShowActionModal(true);
      } else if (spaceType === 'bonus') {
        const pts = LILOTHO_REWARDS[newPos];
        setLilothoPoints(prev => prev + pts);
        awardBackendPoints(pts);
      } else if (spaceType === 'finish') {
        setShowConfetti(true);
        // Save to leaderboard
        const entry = { name: playerName, points: lilothoPoints + LILOTHO_REWARDS[newPos], date: new Date().toISOString() };
        const newLb = [...leaderboard, entry].sort((a, b) => b.points - a.points).slice(0, 10);
        setLeaderboard(newLb);
        localStorage.setItem('lesah_quest_leaderboard', JSON.stringify(newLb));
        setLilothoPoints(prev => prev + LILOTHO_REWARDS[newPos]);
        awardBackendPoints(LILOTHO_REWARDS[newPos]);
      }

      // Award standard space points
      if (spaceType !== 'bonus' && spaceType !== 'finish') {
        const pts = LILOTHO_REWARDS[newPos] || 0;
        if (pts > 0) {
          setLilothoPoints(prev => prev + pts);
          awardBackendPoints(pts);
        }
      }
    }, 600);
  };

  // Submit challenge answer
  const handleChallengeSubmit = (e) => {
    e.preventDefault();
    if (!currentAction?.data) return;
    const correct = challengeAnswer.trim().toLowerCase() === currentAction.data.answer.toLowerCase();
    setChallengeResult(correct ? 'correct' : 'wrong');
    if (correct) {
      const bonus = 15;
      setLilothoPoints(prev => prev + bonus);
      awardBackendPoints(bonus);
    }
    setTimeout(() => {
      setShowActionModal(false);
      setCurrentAction(null);
      setChallengeResult(null);
    }, 2000);
  };

  // Complete study goal
  const handleStudyComplete = () => {
    const bonus = 10;
    setLilothoPoints(prev => prev + bonus);
    awardBackendPoints(bonus);
    setShowActionModal(false);
    setCurrentAction(null);
  };

  // Complete LeSAH action
  const handleLeSAHComplete = () => {
    const bonus = 10;
    setLilothoPoints(prev => prev + bonus);
    awardBackendPoints(bonus);
    setShowActionModal(false);
    setCurrentAction(null);
  };

  // Restart game
  const handleRestart = () => {
    setPlayerPosition(0);
    setLilothoPoints(0);
    setGameStarted(false);
    setPlayerName('');
    setShowConfetti(false);
    localStorage.removeItem('lesah_quest_progress');
  };

  // Render the board
  const renderBoard = () => {
    const rows = [];
    const spacesPerRow = 5;
    const totalRows = Math.ceil(BOARD_SIZE / spacesPerRow);

    for (let row = 0; row < totalRows; row++) {
      const cols = [];
      for (let col = 0; col < spacesPerRow; col++) {
        const idx = row * spacesPerRow + col;
        if (idx >= BOARD_SIZE) break;

        // For zigzag: even rows go left-to-right, odd rows go right-to-left
        const displayIdx = row % 2 === 0 ? idx : (row * spacesPerRow) + (spacesPerRow - 1 - col);
        if (displayIdx >= BOARD_SIZE) continue;

        const spaceType = SPACE_TYPES[displayIdx];
        const isPlayer = playerPosition === displayIdx;
        const isSpecial = ['bonus', 'challenge', 'leSAH', 'study', 'finish', 'start'].includes(spaceType);

        cols.push(
          <div
            key={displayIdx}
            className={`board-space ${spaceType} ${isPlayer ? 'player-here' : ''} ${isSpecial ? 'special' : ''}`}
            title={`Space ${displayIdx + 1}: ${spaceType}`}
          >
            <span className="space-number">{displayIdx + 1}</span>
            {isPlayer && <div className="player-token">🧑🏾‍🎓</div>}
            {spaceType === 'bonus' && <span className="space-icon">🎁</span>}
            {spaceType === 'challenge' && <span className="space-icon">❓</span>}
            {spaceType === 'leSAH' && <span className="space-icon">🏠</span>}
            {spaceType === 'study' && <span className="space-icon">📚</span>}
            {spaceType === 'finish' && <span className="space-icon">🏁</span>}
            {spaceType === 'start' && <span className="space-icon">🚩</span>}
          </div>
        );
      }
      rows.push(
        <div key={row} className="board-row" style={{ flexDirection: row % 2 === 0 ? 'row' : 'row-reverse' }}>
          {cols}
        </div>
      );
    }
    return rows;
  };

  // ---- START SCREEN ----
  if (!gameStarted) {
    return (
      <div className="lesah-quest-page">
        <div className="quest-container">
          <Link to="/student-zone" className="back-link">← Back to Student Zone</Link>
          <div className="quest-card">
            <h1>🎲 LeSAH Quest</h1>
            <p className="quest-subtitle">Advance by studying and using LeSAH services. Earn Lilotho Points for real rewards!</p>
            <div className="quest-input-group">
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="quest-input"
              />
              <button onClick={handleStart} className="quest-btn primary" disabled={!playerName.trim()}>
                Start Quest
              </button>
            </div>
            {leaderboard.length > 0 && (
              <div className="quest-leaderboard">
                <h3>🏆 Top Adventurers</h3>
                {leaderboard.slice(0, 5).map((entry, i) => (
                  <div key={i} className="leaderboard-row">
                    <span>{i + 1}. {entry.name}</span>
                    <span>{entry.points} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---- GAME BOARD ----
  return (
    <div className="lesah-quest-page">
      {showConfetti && <Confetti />}
      <div className="quest-container">
        <Link to="/student-zone" className="back-link">← Back to Student Zone</Link>

        <div className="quest-header">
          <div className="quest-stats">
            <span>🧑🏾‍🎓 {playerName}</span>
            <span>⭐ {lilothoPoints} pts</span>
            <span>📍 Space {playerPosition + 1} of {BOARD_SIZE}</span>
          </div>
          <button onClick={handleRestart} className="quest-btn small">🔄 Restart</button>
        </div>

        <div className="quest-board">
          {renderBoard()}
        </div>

        <div className="quest-controls">
          <button
            onClick={handleRoll}
            className="quest-btn primary roll-btn"
            disabled={rolling || playerPosition >= BOARD_SIZE - 1}
          >
            {rolling ? '🎲 Rolling...' : playerPosition >= BOARD_SIZE - 1 ? '🏁 Finished!' : '🎲 Roll Dice'}
          </button>
          <p className="roll-hint">Roll to advance 1‑3 spaces. Land on special spaces to earn bonus points!</p>
        </div>

        {/* ---- ACTION MODAL ---- */}
        {showActionModal && (
          <div className="quest-modal-overlay" onClick={() => setShowActionModal(false)}>
            <div className="quest-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setShowActionModal(false)}>✕</button>

              {currentAction?.type === 'challenge' && (
                <div className="quest-action">
                  <h2>❓ Challenge!</h2>
                  <p className="challenge-question">{currentAction.data.question}</p>
                  <form onSubmit={handleChallengeSubmit}>
                    <input
                      type="text"
                      placeholder="Your answer"
                      value={challengeAnswer}
                      onChange={(e) => setChallengeAnswer(e.target.value)}
                      className="quest-input"
                      disabled={challengeResult !== null}
                      autoFocus
                    />
                    <button type="submit" className="quest-btn primary" disabled={challengeResult !== null}>
                      Submit
                    </button>
                  </form>
                  {challengeResult === 'correct' && <p className="result-msg correct">✅ Correct! +15 bonus points</p>}
                  {challengeResult === 'wrong' && <p className="result-msg wrong">❌ Wrong! The answer is: {currentAction.data.answer}</p>}
                </div>
              )}

              {currentAction?.type === 'study' && (
                <div className="quest-action">
                  <h2>📚 Study Goal</h2>
                  <p className="study-goal">{studyGoal}</p>
                  <p className="study-hint">Complete this goal in real life, then press Done!</p>
                  <button onClick={handleStudyComplete} className="quest-btn primary">✅ Done! (+10 pts)</button>
                </div>
              )}

              {currentAction?.type === 'leSAH' && (
                <div className="quest-action">
                  <h2>🏠 LeSAH Action</h2>
                  <p className="lesah-task">{leSAHTask}</p>
                  <p className="lesah-hint">Use LeSAH to complete this task, then come back and press Done!</p>
                  <button onClick={handleLeSAHComplete} className="quest-btn primary">✅ Done! (+10 pts)</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---- REDEEM INFO ---- */}
        <div className="quest-redeem-card">
          <h3>💡 Redeem Your Points</h3>
          <p>Lilotho Points can be used for:</p>
          <ul>
            <li>🎁 <strong>50 pts</strong> – Free delivery</li>
            <li>🎁 <strong>100 pts</strong> – 10% off accommodation booking</li>
            <li>🎁 <strong>150 pts</strong> – Loan interest discount</li>
            <li>🎁 <strong>200 pts</strong> – Free LeSAH Eats meal</li>
          </ul>
          <p className="redeem-note">Visit any LeSAH service to apply your points!</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- CONFETTI (reused) ---------- */
function Confetti() {
  const colors = ['#f43f5e','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ec4899'];
  return (
    <div className="confetti-container">
      {Array.from({length: 60}).map((_, i) => (
        <div key={i} className="confetti-piece" style={{
          left: Math.random()*100+'%',
          animationDelay: Math.random()*2+'s',
          backgroundColor: colors[Math.floor(Math.random()*colors.length)],
          width: Math.random()*10+6+'px',
          height: Math.random()*10+6+'px',
        }} />
      ))}
    </div>
  );
}