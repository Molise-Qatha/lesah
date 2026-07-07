import React from "react";
import ActionCard from "./ActionCard";
import { actions } from "../../data/semesterData";
import { useGame } from "../../context/GameContext";

export default function ActionGrid() {
  const { state, dispatch } = useGame();

  const handleSelect = (actionId) => {
    if (!state.actionUsedToday && !state.gameOver && !state.graduated) {
      dispatch({ type: 'PERFORM_ACTION', payload: actionId });
    }
  };

  const handleNextDay = () => {
    dispatch({ type: 'NEXT_DAY' });
  };

  return (
    <div className="actions-section">
      <h3>📋 Today's Action</h3>
      {state.actionUsedToday && (
        <p className="action-used-msg">You have already completed today's activity.</p>
      )}
      <div className="action-grid">
        {actions.map((action) => (
          <ActionCard
            key={action.id}
            action={action}
            selected={state.currentAction === action.id}
            disabled={state.actionUsedToday || state.gameOver || state.graduated}
            onClick={handleSelect}
          />
        ))}
      </div>
      {state.actionUsedToday && !state.gameOver && !state.graduated && (
        <button className="next-day-btn" onClick={handleNextDay}>
          ➡️ Next Day
        </button>
      )}
    </div>
  );
}