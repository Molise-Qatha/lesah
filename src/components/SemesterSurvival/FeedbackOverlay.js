import React, { useEffect, useState } from "react";
import { useGame } from "../../context/GameContext";
import { ACTIONS } from "../../utils/gameEngine";

export default function FeedbackOverlay() {
  const { state } = useGame();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!state.currentAction) return;
    const effects = ACTIONS[state.currentAction];
    if (!effects) return;
    const msgs = Object.entries(effects).map(([stat, value]) => ({
      id: Math.random(),
      icon: stat === "money" ? "💰" : stat === "knowledge" ? "📚" : stat === "health" ? "❤️" : stat === "energy" ? "⚡" : "😊",
      text: `${value > 0 ? '+' : ''}${value}`,
      stat,
    }));
    setMessages(msgs);
    const timer = setTimeout(() => setMessages([]), 2000);
    return () => clearTimeout(timer);
  }, [state.currentAction]);

  return (
    <div className="feedback-overlay">
      {messages.map((m) => (
        <div key={m.id} className={`feedback-item ${m.stat}`}>
          {m.icon} {m.text}
        </div>
      ))}
    </div>
  );
}