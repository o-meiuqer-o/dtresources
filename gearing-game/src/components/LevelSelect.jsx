import React from 'react';
import { levels } from '../levels';

export default function LevelSelect({ onSelectLevel }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', overflowY: 'auto', padding: '40px', color: 'white' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '10px', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>Gearing Game</h1>
      <p style={{ fontSize: '20px', marginBottom: '40px', opacity: 0.8 }}>Select a level to begin</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '15px', width: '60%', maxWidth: '800px' }}>
        {levels.map(level => (
          <div 
            key={level.id} 
            onClick={() => onSelectLevel(level)}
            style={{ 
              aspectRatio: '1',
              background: 'linear-gradient(135deg, #2980b9, #8e44ad)', 
              borderRadius: '12px',
              cursor: 'pointer',
              border: '2px solid transparent',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.1s, box-shadow 0.1s, border 0.1s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.4)';
              e.currentTarget.style.border = '2px solid #f1c40f';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
              e.currentTarget.style.border = '2px solid transparent';
            }}
          >
            <div style={{ fontSize: '32px', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{level.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
