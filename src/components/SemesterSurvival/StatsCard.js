import React from "react";
import { useGame } from "../../context/GameContext";

const STATS_LABELS = [
  { id: "knowledge", label: "Knowledge", icon: "📚" },
  { id: "money", label: "Money", icon: "💰" },
  { id: "health", label: "Health", icon: "❤️" },
  { id: "energy", label: "Energy", icon: "⚡" },
  { id: "happiness", label: "Happiness", icon: "😊" },
];

export default function StatsCard() {
  const { state } = useGame();

  return (
    <div className="stats-card">
      <h3>📊 Your Stats</h3>
      {STATS_LABELS.map(({ id, label, icon }) => (
        <div key={id} className="stat-row">
          <span className="stat-label">
            {icon} {label}
          </span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(100, state[id] || 0)}%` }}
            />
          </div>
          <span className="stat-number">{state[id] || 0}</span>
        </div>
      ))}
    </div>
  );
}