import React from "react";
import { randomEvent } from "../../data/semesterData";

export default function EventModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <h2>⚡ {randomEvent.title}</h2>
        <p>{randomEvent.description}</p>
        <div className="event-options">
          {randomEvent.options.map((opt) => (
            <button key={opt.id} className="event-option-btn">
              {opt.label} {opt.cost ? `(M${opt.cost})` : ""}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}