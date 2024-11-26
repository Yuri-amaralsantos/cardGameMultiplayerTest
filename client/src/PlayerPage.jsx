import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Playerpage.css';

const socket = io('http://localhost:3000');

function PlayerPage({ player }) {
  const [gameData, setGameData] = useState(null);
  const [roundResult, setRoundResult] = useState('');

  useEffect(() => {
    // Listen for game data updates
    socket.on('game-data', (data) => {
      setGameData(data);
    });

    // Listen for round result (winner)
    socket.on('round-result', (result) => {
      setRoundResult(result); // Update the round result state
    });

    // Clean up on component unmount
    return () => {
      socket.off('game-data');
      socket.off('round-result');
    };
  }, []);

  const moveCardToBoard = (index) => {
    socket.emit('move-card', { player, index });
  };

  const passTurn = () => {
    socket.emit('pass-turn'); // Emit the pass-turn event to handle the comparison
  };

  if (!gameData) {
    return <div>Loading game data...</div>;
  }

  // Determine opponent
  const opponent = player === 'player1' ? 'player2' : 'player1';

  const isMyTurn = gameData.turn === player; // Check if it's the player's turn

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <div id="playerUi" className="textUi">
        <span>Player: {player} </span>
        <span>Points: {gameData[player].health}</span>
      </div>
      <div id="opponentUi" className="textUi">
        <span>Opponent: {opponent} </span>
        <span>Points: {gameData[opponent].health} </span>
      </div>

      {/* Display the current player's turn as "player1" or "player2" */}
      <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
        Turn: {gameData.turn} {/* This will display either "player1" or "player2" */}
      </div>

      <button
        className="textUi"
        id="bPass"
        onClick={passTurn}
        disabled={!isMyTurn} // Disable the pass button if it's not the player's turn
      >
        Pass
      </button>

      {/* Display the result of the round */}
      {roundResult && (
        <span
          id="roundResult"
          style={{ display: 'block', marginTop: '20px', fontWeight: 'bold' }}
        >
          {roundResult}
        </span>
      )}

      <div id="main">
        <div className="board">
          {gameData[opponent].board.map((card, index) => (
            <button key={index} className="card">
              <p>{card.name}</p> <p>{card.number}</p>
            </button>
          ))}
        </div>

        <div className="board">
          {gameData[player].board.map((card, index) => (
            <button key={index} className="card">
              <p>{card.name}</p> <p>{card.number}</p>
            </button>
          ))}
        </div>

        <div className="board" style={{ marginTop: '80px' }}>
          {gameData[player].hand.map((card, index) => (
            <button
              key={index}
              className="card"
              onClick={() => moveCardToBoard(index)} // Pass index to move the card
              disabled={!isMyTurn} // Disable the card play button if it's not the player's turn
            >
              <p>{card.name}</p> <p>{card.number}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlayerPage;
