import React from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Connect to the server

function MainPage() {
  const navigate = useNavigate();

  const handleJoin = (player) => {
    // Emit player join event to the server
    socket.emit('join-game', { player });

    // Redirect to the corresponding player page
    navigate(`/${player}`);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Card Game</h1>
      <button onClick={() => handleJoin('player1')}>Join as Player 1</button>
      <button onClick={() => handleJoin('player2')}>Join as Player 2</button>
    </div>
  );
}

export default MainPage;
