// src/components/SemesterSurvival/AchievementPopup.js
import React, { useEffect } from "react";
import { useGame } from "../../context/GameContext";
import { ACHIEVEMENTS } from "../../utils/gameEngine";

export default function AchievementPopup() {
  const { state, dispatch } = useGame();

  useEffect(() => {
    if (state.newAchievements && state.newAchievements.length > 0) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_NEW_ACHIEVEMENTS' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.newAchievements, dispatch]);

  if (!state.newAchievements || state.newAchievements.length === 0) return null;

  return (
    <div className="achievement-popup">
      {state.newAchievements.map((key) => {
        const ach = ACHIEVEMENTS[key];
        return (
          <div key={key} className="achievement-card">
            <span className="ach-icon">🏆</span>
            <div>
              <strong>{ach.name}</strong>
              <p>{ach.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}