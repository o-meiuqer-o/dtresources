import React, { useState } from 'react';
import GameBoard from './components/GameBoard';
import LevelSelect from './components/LevelSelect';
import { levels } from './levels';
import './App.css';

function App() {
  const [currentLevelId, setCurrentLevelId] = useState(null);
  const [skipIntro, setSkipIntro] = useState(false);

  const currentLevel = levels.find(l => l.id === currentLevelId);

  const handleNextLevel = () => {
    const nextId = currentLevelId + 1;
    if (levels.find(l => l.id === nextId)) {
      setSkipIntro(true);
      setCurrentLevelId(nextId);
    } else {
      setCurrentLevelId(null); 
    }
  };

  const handleSelectLevel = (level) => {
    setSkipIntro(false);
    setCurrentLevelId(level.id);
  };

  return (
    <div className="app-container">
      {currentLevel ? (
        <GameBoard 
          key={currentLevel.id}
          level={currentLevel} 
          onBack={() => setCurrentLevelId(null)}
          onNextLevel={handleNextLevel}
          isLastLevel={currentLevelId === levels[levels.length - 1].id}
          skipIntro={skipIntro}
        />
      ) : (
        <LevelSelect onSelectLevel={handleSelectLevel} />
      )}
    </div>
  );
}

export default App;
