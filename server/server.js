const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow React client
    methods: ["GET", "POST"],
  },
});

const cards = [{name:"ouro",number:1},{name:"espadas",number:3},{name:"copas",number:7}]

// In-memory game state
const gameData = {
  player1: {
    health: 30,
    mana: 10,
    hand: [...cards],
    board: [],
  },
  player2: {
    health: 25,
    mana: 8,
    hand: [...cards],
    board: [],
  },
  turn: 'player1', // Initially set the turn to player1
};

// Emit the full game data to all connected players
const emitGameData = () => {
  io.emit('game-data', gameData);
};

// Function to handle the round result
const handleRound = () => {
  const player1Card = gameData.player1.board[0];
  const player2Card = gameData.player2.board[0];

  // Check if both players have at least one card on the board
  if (player1Card && player2Card) {
    if (player1Card.number > player2Card.number) {
      gameData.player1.health += 5;  // Example: player1 wins, gain 5 health
      gameData.player2.health -= 5;  // Example: player2 loses 5 health
      io.emit('round-result', 'Player 1 wins this round!');
    } else if (player1Card.number < player2Card.number) {
      gameData.player1.health -= 5;  // Example: player1 loses 5 health
      gameData.player2.health += 5;  // Example: player2 wins, gain 5 health
      io.emit('round-result', 'Player 2 wins this round!');
    } else {
      io.emit('round-result', 'It\'s a tie this round!');
    }
  } else {
    io.emit('round-result', 'Both players need at least one card on the board to play.');
  }

  // Switch the turn after the round
  gameData.turn = gameData.turn === 'player1' ? 'player2' : 'player1';
  emitGameData();  // Broadcast the updated game state
};

io.on('connection', (socket) => {
  console.log('A player connected');

  // Send the full game state to the new connection
  socket.emit('game-data', gameData);

  // Handle card movement
  socket.on('move-card', ({ player, index }) => {
    const playerData = gameData[player];
    if (playerData) {
      console.log(index);
      if (index !== -1) {
        // Remove the card from the player's hand
        const [removedCard] = playerData.hand.splice(index, 1);
        // Add it to the player's board
        playerData.board.push(removedCard);
        emitGameData(); // Broadcast the updated game state
      } else {
        console.error(`Card not found in ${player}'s hand`);
      }
    } else {
      console.error(`Player ${player} not found`);
    }
  });

  // Handle passing the turn and comparing the cards
  socket.on('pass-turn', () => {
    handleRound(); // Compare the cards and update the game state
  });

  socket.on('disconnect', () => {
    console.log('A player disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
