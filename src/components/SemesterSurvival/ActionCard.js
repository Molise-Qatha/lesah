import React from "react";

export default function ActionCard({ action, selected, disabled, onClick }) {
  return (
    <button
      className={`action-card ${selected ? "selected" : ""}`}
      onClick={() => onClick(action.id)}
      disabled={disabled}
    >
      <span className="action-title">{action.title}</span>
      <span className="action-desc">{action.desc}</span>
    </button>
  );
}