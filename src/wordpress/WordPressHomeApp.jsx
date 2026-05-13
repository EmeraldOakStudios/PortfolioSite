import React, { useEffect, useMemo, useState } from 'react';
import RoomPage from '../pages/RoomPage';
import { rooms as fallbackRooms } from '../data/rooms';

function resolveUploadsUrl(url, uploadsBaseUrl) {
  if (!url || typeof url !== 'string') return '';
  if (/^(https?:)?\/\//i.test(url)) return url;

  const uploadsBase = (uploadsBaseUrl || '').replace(/\/+$/, '');
  if (!uploadsBase) return url;

  const normalizedPath = url
    .replace(/^\/wp-content\/uploads\//i, '')
    .replace(/^wp-content\/uploads\//i, '')
    .replace(/^\//, '');

  if (!normalizedPath) {
    return uploadsBase;
  }

  return `${uploadsBase}/${normalizedPath}`;
}

function normalizeRoomAssets(rawRooms, uploadsBaseUrl) {
  if (!Array.isArray(rawRooms)) return [];

  return rawRooms.map((room) => ({
    ...room,
    glb: resolveUploadsUrl(room.glb, uploadsBaseUrl),
    panels: Array.isArray(room.panels)
      ? room.panels.map((panel) => ({
          ...panel,
          image: resolveUploadsUrl(panel.image, uploadsBaseUrl),
          links: Array.isArray(panel.links) ? panel.links : []
        }))
      : []
  }));
}

function WordPressHomeApp() {
  const settings = (typeof window !== 'undefined' && window.Portfolio3DHomeSettings)
    ? window.Portfolio3DHomeSettings
    : {};

  const [rooms, setRooms] = useState(normalizeRoomAssets(fallbackRooms, settings.uploadsBaseUrl));
  const [currentRoomId, setCurrentRoomId] = useState(1);

  useEffect(() => {
    const endpoint = settings.apiEndpoint;
    if (!endpoint) return;

    let ignore = false;

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load rooms: ${response.status}`);
        return response.json();
      })
      .then((payload) => {
        if (ignore) return;
        const nextRooms = normalizeRoomAssets(payload?.rooms, settings.uploadsBaseUrl);
        if (nextRooms.length > 0) {
          setRooms(nextRooms);
          if (!nextRooms.some((room) => room.id === currentRoomId)) {
            setCurrentRoomId(nextRooms[0].id);
          }
        }
      })
      .catch(() => {
        // Keep fallback local data when the endpoint is unavailable.
      });

    return () => {
      ignore = true;
    };
  }, [settings.apiEndpoint, settings.uploadsBaseUrl, currentRoomId]);

  const activeRoom = useMemo(() => {
    if (!Array.isArray(rooms) || rooms.length === 0) return null;
    return rooms.find((room) => room.id === Number(currentRoomId)) || rooms[0];
  }, [rooms, currentRoomId]);

  if (!activeRoom) {
    return <div style={{ color: '#fff', padding: '20px' }}>No rooms configured.</div>;
  }

  return (
    <RoomPage
      roomId={activeRoom.id}
      roomData={activeRoom}
      onNavigateRoom={(nextRoomId) => setCurrentRoomId(nextRoomId)}
    />
  );
}

export default WordPressHomeApp;
