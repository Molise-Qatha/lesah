import React from "react";
import { stats } from "../../data/semesterData";

export default function StatsCard() {
  return (
    <div className="stats-card">
      <h3>📊 Your Stats</h3>
      {stats.map((stat) => (
        <div key={stat.id} className="stat-row">
          <span className="stat-label">
            {stat.icon} {stat.label}
          </span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${stat.value}%` }}
            />
          </div>
          <span className="stat-number">{stat.value}</span>
        </div>
      ))}
    </div>
  );
}