import React, { useState } from "react";
import { GameProvider, useGame } from "../context/GameContext";
import Sidebar from "../components/SemesterSurvival/Sidebar";
import StatusBar from "../components/SemesterSurvival/StatusBar";
import WelcomeBanner from "../components/SemesterSurvival/WelcomeBanner";
import StatsCard from "../components/SemesterSurvival/StatsCard";
import ActionGrid from "../components/SemesterSurvival/ActionGrid";
import MoneyTip from "../components/SemesterSurvival/MoneyTip";
import EventModal from "../components/SemesterSurvival/EventModal";
import FeedbackOverlay from "../components/SemesterSurvival/FeedbackOverlay";
import AchievementPopup from "../components/SemesterSurvival/AchievementPopup";
import "../components/SemesterSurvival/LesahLife.css";

function LesahLifeContent() {
  const { state, dispatch } = useGame();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);

  // Game over / graduation modals
  if (state.gameOver) {
    return (
      <div className="game-over-screen">
        <h2>💀 Game Over</h2>
        <p>{state.gameOverMessage}</p>
        <button onClick={() => dispatch({ type: 'RESTART' })}>🔄 Restart Semester</button>
      </div>
    );
  }

  if (state.graduated) {
    return (
      <div className="graduation-screen">
        <h2>🎓 Congratulations!</h2>
        <p>You survived the semester!</p>
        <div className="final-stats">
          <p>📚 Knowledge: {state.knowledge}</p>
          <p>💰 Money: M{state.money}</p>
          <p>❤️ Health: {state.health}</p>
          <p>😊 Happiness: {state.happiness}</p>
        </div>
        <button onClick={() => dispatch({ type: 'RESTART' })}>🔄 Play Again</button>
      </div>
    );
  }

  return (
    <div className="lesah-life">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>

        <StatusBar />
        <WelcomeBanner />
        <StatsCard />
        <ActionGrid />
        <MoneyTip />

        <button onClick={() => setEventOpen(true)} className="primary-btn">
          Trigger Random Event (Demo)
        </button>

        <EventModal open={eventOpen} onClose={() => setEventOpen(false)} />
        <FeedbackOverlay />
        <AchievementPopup />
      </div>
    </div>
  );
}

export default function LesahLifePage() {
  return (
    <GameProvider>
      <LesahLifeContent />
    </GameProvider>
  );
}