import React from 'react';
import GameCanvas from './components/GameCanvas';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1 style={{ textAlign: 'center', color: '#e74c3c', fontFamily: 'Impact', textTransform: 'uppercase' }}>
        Istanbul Streets Fighter
      </h1>
      <GameCanvas />
      <p style={{ textAlign: 'center', color: '#666', marginTop: '10px' }}>
        Controls: Arrow Keys to Move, Space to Attack
      </p>
    </div>
  );
}

export default App;
