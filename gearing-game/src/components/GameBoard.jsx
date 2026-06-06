import React, { useState, useRef } from 'react';
import Gear from './Gear';

export default function GameBoard() {
  const [gears, setGears] = useState([
    { id: 'g1', x: 100, y: 100, teeth: 12, radius: 40, color: '#e74c3c' },
    { id: 'g2', x: 250, y: 100, teeth: 18, radius: 60, color: '#3498db' },
  ]);
  
  const [pegs, setPegs] = useState([
    { id: 'p1', x: 400, y: 300, requiredTeeth: 12 },
    { id: 'p2', x: 490, y: 300, requiredTeeth: 18 }, // Adjusted for distance: 40 + 60 = 100, wait, it's 490, maybe 500
  ]);

  const [draggingId, setDraggingId] = useState(null);
  const svgRef = useRef(null);

  const handlePointerDown = (e, id) => {
    setDraggingId(id);
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!draggingId) return;

    const svg = svgRef.current;
    if (!svg) return;
    
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorPt = pt.matrixTransform(svg.getScreenCTM().inverse());

    setGears(gears.map(g => 
      g.id === draggingId ? { ...g, x: cursorPt.x, y: cursorPt.y } : g
    ));
  };

  const handlePointerUp = (e) => {
    if (!draggingId) return;
    
    // Snap to pegs logic
    let snappedGears = [...gears];
    const gear = snappedGears.find(g => g.id === draggingId);
    
    let snapped = false;
    for (const peg of pegs) {
      const dist = Math.hypot(gear.x - peg.x, gear.y - peg.y);
      if (dist < 50) { // Snapping threshold
        gear.x = peg.x;
        gear.y = peg.y;
        snapped = true;
        break;
      }
    }
    
    setGears(snappedGears);
    setDraggingId(null);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#2c3e50', overflow: 'hidden' }}>
      <svg 
        ref={svgRef}
        width="100%" 
        height="100%" 
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Draw pegs */}
        {pegs.map(p => (
          <g key={p.id} transform={`translate(${p.x}, ${p.y})`}>
            <circle r={10} fill="#7f8c8d" />
            <circle r={5} fill="#95a5a6" />
          </g>
        ))}

        {/* Draw gears */}
        {gears.map(g => (
          <Gear 
            key={g.id} 
            {...g} 
            onPointerDown={(e) => handlePointerDown(e, g.id)} 
          />
        ))}
      </svg>
    </div>
  );
}
