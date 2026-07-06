import React from "react";

export default function ActionCard({ action, selected, onClick }) {
  return (
    <button
      className={`action-card ${selected ? "selected" : ""}`}
      onClick={() => onClick(action.id)}
      disabled={selected && action.id !== selected}
    >
      <span className="action-title">{action.title}</span>
      <span className="action-desc">{action.desc}</span>
    </button>
  );
}