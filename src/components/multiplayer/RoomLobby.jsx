import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { generateRoomCode, generatePlayerId, useRoom } from '../../lib/multiplayer/useRoom';
import './RoomLobby.css';

export default function RoomLobby({ gameId, gameName, gamePath, onMessage, children }) {
  const { roomCode: urlRoomCode } = useParams();
  const navigate = useNavigate();

  // Stable player id per browser session
  const playerId = useMemo(() => {
    const key = `lesah_player_id_${gameId}`;
    let id = sessionStorage.getItem(key);
    if (!id) {
      id = generatePlayerId();
      sessionStorage.setItem(key, id);
    }
    return id;
  }, [gameId]);

  const [roomCode, setRoomCode] = useState(urlRoomCode || null);
  const [copied, setCopied] = useState(false);

  // Adopt room code from URL if it changes
  useEffect(() => {
    if (urlRoomCode && urlRoomCode !== roomCode) {
      setRoomCode(urlRoomCode);
    }
  }, [urlRoomCode, roomCode]);

  const { isConnected, players, send } = useRoom({
    gameId,
    roomCode,
    playerId,
    onMessage,
  });

  const handleCreateRoom = () => {
    const code = generateRoomCode(gameId);
    setRoomCode(code);
    navigate(`${gamePath}/play/${code}`);
  };

  const shareUrl = roomCode
    ? `${window.location.origin}${gamePath}/play/${roomCode}`
    : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const opponentPresent = players.length >= 2;

  if (!roomCode) {
    return (
      <div className="room-lobby">
        <div className="room-lobby-card">
          <span className="room-lobby-icon">🎮</span>
          <h2>Play {gameName} with a Friend</h2>
          <p>
            Create a room, share the link, and play together. No account needed.
          </p>
          <button className="room-lobby-btn-primary" onClick={handleCreateRoom}>
            Create Room
          </button>
          <Link to={gamePath} className="room-lobby-link">
            ← Back to {gameName}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="room-lobby-active">
      <div className="room-status-bar">
        <div className="room-status-left">
          <span className="room-code-label">Room</span>
          <code className="room-code">{roomCode}</code>
        </div>

        <div className="room-status-center">
          {!isConnected && <span className="room-status-waiting">⏳ Connecting…</span>}
          {isConnected && !opponentPresent && (
            <span className="room-status-waiting">⏳ Waiting for opponent…</span>
          )}
          {isConnected && opponentPresent && (
            <span className="room-status-ready">✅ Opponent connected</span>
          )}
        </div>

        <div className="room-status-right">
          <button className="room-copy-btn" onClick={handleCopy}>
            {copied ? '✅ Copied' : '🔗 Copy Invite Link'}
          </button>
          <Link to={gamePath} className="room-leave-btn">
            Leave
          </Link>
        </div>
      </div>

      {!opponentPresent && (
        <div className="room-share-hint">
          <p>Send this link to your friend:</p>
          <div className="room-share-link">{shareUrl}</div>
          <p className="room-share-note">
            They can open it on their phone or another browser.
          </p>
        </div>
      )}

      {typeof children === 'function'
        ? children({
            playerId,
            players,
            isConnected,
            opponentPresent,
            send,
            roomCode,
          })
        : children}
    </div>
  );
}