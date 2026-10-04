import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabaseClient';

// ─────────────────────────────────────────────
//  LeSAH Multiplayer Room Engine
//  Ephemeral rooms. No login. No persistence.
//  Uses Supabase Realtime broadcast + presence.
// ─────────────────────────────────────────────

const CODE_CHARS = 'abcdefghjkmnpqrstuvwxyz23456789'; // no confusing chars

export function generateRoomCode(gameId) {
  const prefix = (gameId || 'rm').slice(0, 2).toLowerCase();
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return `${prefix}-${code}`;
}

export function generatePlayerId() {
  return 'p-' + Math.random().toString(36).slice(2, 10);
}

/**
 * useRoom — connect to an ephemeral multiplayer room.
 *
 * @param {string}   gameId     short id, e.g. 'mb' for Morabaraba
 * @param {string}   roomCode   from URL, e.g. 'mb-k2pf'
 * @param {string}   playerId   stable id for this browser
 * @param {function} onMessage  called when the OTHER player sends a payload
 */
export function useRoom({ gameId, roomCode, playerId, onMessage }) {
  const [isConnected, setIsConnected] = useState(false);
  const [players, setPlayers] = useState([]);
  const channelRef = useRef(null);
  const onMessageRef = useRef(onMessage);

  // Keep the latest callback without reconnecting
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!gameId || !roomCode || !playerId) return;

    const channelName = `lesah-room-${gameId}-${roomCode}`;
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false },
        presence: { key: playerId },
      },
    });

    channel
      .on('broadcast', { event: 'move' }, (payload) => {
        if (onMessageRef.current) onMessageRef.current(payload.payload);
      })
      .on('presence', { event: 'sync' }, () => {
        setPlayers(Object.keys(channel.presenceState()));
      })
      .on('presence', { event: 'join' }, () => {
        setPlayers(Object.keys(channel.presenceState()));
      })
      .on('presence', { event: 'leave' }, () => {
        setPlayers(Object.keys(channel.presenceState()));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          await channel.track({ playerId, joinedAt: Date.now() });
        } else {
          setIsConnected(false);
        }
      });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
      setIsConnected(false);
      setPlayers([]);
    };
  }, [gameId, roomCode, playerId]);

  const send = useCallback((payload) => {
    if (!channelRef.current) return;
    channelRef.current.send({
      type: 'broadcast',
      event: 'move',
      payload,
    });
  }, []);

  return { isConnected, players, send };
}