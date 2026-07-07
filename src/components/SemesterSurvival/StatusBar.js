import React from "react";
import { useGame } from "../../context/GameContext";

const STATS_KEYS = [
  { key: "money", icon: "💰" },
  { key: "knowledge", icon: "📚" },
  { key: "health", icon: "❤️" },
  { key: "energy", icon: "⚡" },
  { key: "happiness", icon: "😊" },
];

export default function StatusBar() {
  const { state } = useGame();

  return (
    <div className="status-bar">
      {STATS_KEYS.map(({ key, icon }) => (
        <div key={key} className="status-item">
          <span className="status-icon">{icon}</span>
          <span className="status-value">{state[key]}</span>
        </div>
      ))}
      <div className="status-item">
        <span>📅</span> Week {state.week}
      </div>
      <div className="status-item">
        <span>📆</span> Day {state.day}
      </div>
      <div className="status-item">
        <span>📊</span> {state.semesterProgress}%
      </div>
    </div>
  );
}