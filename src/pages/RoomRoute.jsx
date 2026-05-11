import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RoomPage from './RoomPage';

function RoomRoute() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <RoomPage
      roomId={id}
      onNavigateRoute={(route) => navigate(route)}
    />
  );
}

export default RoomRoute;
