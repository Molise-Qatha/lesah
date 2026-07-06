import React from "react";
import { stats, playerData } from "../../data/semesterData";

export default function StatusBar() {
  return (
    <div className="status-bar">
      {stats.map((stat) => (
        <div key={stat.id} className="status-item">
          <span className="status-icon">{stat.icon}</span>
          <span className="status-value">{stat.value}</span>
        </div>
      ))}
      <div className="status-item">
        <span>📅</span> Week {playerData.week}
      </div>
      <div className="status-item">
        <span>📆</span> {playerData.day}
      </div>
      <div className="status-item">
        <span>📊</span> {playerData.semesterProgress}%
      </div>
    </div>
  );
}