import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import PlayerPage from './PlayerPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/player1" element={<PlayerPage player="player1" />} />
        <Route path="/player2" element={<PlayerPage player="player2" />} />
      </Routes>
    </Router>
  );
}

export default App;
