import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import {
  INITIAL_STATE,
  applyAction,
  nextDay,
  clamp,
  checkAchievements,
  saveGame,
  loadGame,
  clearSave,
} from '../utils/gameEngine';

const GameContext = createContext();

function gameReducer(state, action) {
  switch (action.type) {
    case 'PERFORM_ACTION': {
      let newState = applyAction(state, action.payload);
      newState = checkAchievements(newState);
      saveGame(newState);
      return newState;
    }
    case 'NEXT_DAY': {
      let newState = nextDay(state);
      newState = checkAchievements(newState);
      saveGame(newState);
      return newState;
    }
    case 'RESTART':
      clearSave();
      return { ...INITIAL_STATE };
    case 'LOAD_STATE':
      return action.payload;
    case 'CLEAR_NEW_ACHIEVEMENTS':
      return { ...state, newAchievements: [] };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      dispatch({ type: 'LOAD_STATE', payload: saved });
    }
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return null;

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}