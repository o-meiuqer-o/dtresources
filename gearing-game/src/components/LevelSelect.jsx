import React from 'react';
import { levels } from '../levels';

export default function LevelSelect({ onSelectLevel }) {
  return (
    <div style={{ padding: '40px', color: 'white', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Mechanical Gearing Simulator</h1>
      <p style={{ fontSize: '18px', color: '#bdc3c7' }}>
        Select a level to practice your understanding of gear trains and mechanical linkages.
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '40px' }}>
        {levels.map(level => (
          <div 
            key={level.id} 
            style={{ 
              background: '#34495e', 
              padding: '20px', 
              borderRadius: '10px',
              cursor: 'pointer',
              border: '2px solid transparent',
              transition: 'border 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.border = '2px solid #3498db'}
            onMouseOut={(e) => e.currentTarget.style.border = '2px solid transparent'}
            onClick={() => onSelectLevel(level)}
          >
            <h2>{level.title}</h2>
            <p>{level.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
