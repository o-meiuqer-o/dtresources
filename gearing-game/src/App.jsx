import React, { useState } from 'react';
import GameBoard from './components/GameBoard';
import LevelSelect from './components/LevelSelect';
import { levels } from './levels';
import './App.css';

function App() {
  const [currentLevelId, setCurrentLevelId] = useState(null);

  const currentLevel = levels.find(l => l.id === currentLevelId);

  const handleNextLevel = () => {
    const nextId = currentLevelId + 1;
    if (levels.find(l => l.id === nextId)) {
      setCurrentLevelId(nextId);
    } else {
      // Game completed
      setCurrentLevelId(null); 
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#2c3e50', overflow: 'hidden', margin: 0, padding: 0 }}>
      {currentLevel ? (
        <GameBoard 
          key={currentLevel.id}
          level={currentLevel} 
          onBack={() => setCurrentLevelId(null)}
          onNextLevel={handleNextLevel}
          isLastLevel={currentLevelId === levels[levels.length - 1].id}
        />
      ) : (
        <LevelSelect onSelectLevel={(level) => setCurrentLevelId(level.id)} />
      )}
    </div>
  );
}

export default App;
