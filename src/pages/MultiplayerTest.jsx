import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RoomLobby from '../components/multiplayer/RoomLobby';
import './MultiplayerTest.css';

export default function MultiplayerTest() {
  const [count, setCount] = useState(0);
  const [lastMover, setLastMover] = useState(null);

  // Message handler — receives broadcasts from the other player
  const handleMessage = (msg) => {
    if (!msg || msg.type !== 'setCount') return;
    setCount(msg.value);
    setLastMover(msg.by);
  };

  return (
    <div className="mpt-page">
      <Link to="/" className="mpt-back">← Home</Link>

      <RoomLobby
        gameId="mt"
        gameName="Multiplayer Test"
        gamePath="/multiplayer-test"
        onMessage={handleMessage}
      >
        {({ playerId, opponentPresent, send }) => {
          const handleIncrement = () => {
            const next = count + 1;
            setCount(next);
            setLastMover(playerId);
            send({ type: 'setCount', value: next, by: playerId });
          };

          const handleReset = () => {
            setCount(0);
            setLastMover(null);
            send({ type: 'setCount', value: 0, by: playerId });
          };

          return (
            <div className="mpt-game">
              <h1>Shared Counter</h1>
              <p className="mpt-hint">
                Click the button. Both browsers will see the same number.
              </p>

              <div className="mpt-counter">{count}</div>

              <div className="mpt-players">
                <span>👤 You: <code>{playerId}</code></span>
                {opponentPresent && <span>👥 Opponent connected</span>}
              </div>

              <div className="mpt-buttons">
                <button
                  className="mpt-btn-increment"
                  onClick={handleIncrement}
                  disabled={!opponentPresent}
                >
                  +1
                </button>
                <button
                  className="mpt-btn-reset"
                  onClick={handleReset}
                  disabled={!opponentPresent}
                >
                  Reset
                </button>
              </div>

              {lastMover && (
                <p className="mpt-last">
                  Last moved by: <code>{lastMover}</code>
                </p>
              )}

              {!opponentPresent && (
                <p className="mpt-wait">
                  Buttons activate when your opponent joins.
                </p>
              )}
            </div>
          );
        }}
      </RoomLobby>
    </div>
  );
}