import React, { useState, useRef, useEffect, useMemo } from 'react';
import Gear from './Gear';

// Target Reference: Shows the OUTSIDE of the machine
function TargetReference({ targetConfig }) {
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    let animationId;
    const animate = () => {
      setRotation(prev => prev + targetConfig.inputSpeed);
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [targetConfig]);

  const r1 = rotation;
  const r2 = rotation * (targetConfig.outputSpeed / targetConfig.inputSpeed);

  return (
    <div style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(0,0,0,0.6)', padding: '15px', borderRadius: '10px', border: '2px solid #7f8c8d', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', zIndex: 10 }}>
      <h3 style={{ color: 'white', marginTop: 0, fontSize: '16px', textAlign: 'center' }}>Target Product (Outside)</h3>
      <svg width="200" height="150" viewBox="0 0 200 150">
        <g transform="scale(0.8) translate(30, 20)">
           {/* Opaque Casing hiding the internal gears */}
           <rect x="0" y="0" width="200" height="100" fill="#95a5a6" rx="10" />
           <text x="100" y="90" fill="#7f8c8d" fontSize="12" textAnchor="middle" fontWeight="bold">GEARBOX CASING</text>
           <text x="50" y="-10" fill="#ecf0f1" fontSize="14" textAnchor="middle">Input</text>
           <text x="150" y="-10" fill="#ecf0f1" fontSize="14" textAnchor="middle">Output</text>
           
           {/* Input: Crank on the left */}
           <g transform={`translate(50, 50) rotate(${r1})`}>
             <circle r="15" fill="#34495e" />
             <rect x="-5" y="0" width="10" height="30" fill="#2c3e50" />
             <circle cx="0" cy="30" r="8" fill="#e74c3c" />
           </g>

           {/* Output: Spinning Fan/Dial on the right */}
           <g transform={`translate(150, 50) rotate(${r2})`}>
             <circle r="25" fill="#ecf0f1" stroke="#bdc3c7" strokeWidth="4" />
             <line x1="0" y1="-25" x2="0" y2="25" stroke="#e67e22" strokeWidth="4" />
             <line x1="-25" y1="0" x2="25" y2="0" stroke="#e67e22" strokeWidth="4" />
             <circle r="5" fill="#d35400" />
           </g>
        </g>
      </svg>
    </div>
  );
}

export default function GameBoard({ level, onBack, onNextLevel, isLastLevel }) {
  // Initialize gears on the shelf
  const [gears, setGears] = useState(() => {
    return level.shelfGears.map((g, index) => ({
      ...g,
      x: 125, // Centered in the 250px left column
      y: 350 + index * 120, // Spread them vertically below the text
      startRot: 0
    }));
  });
  
  const pegs = level.pegs;

  const [draggingId, setDraggingId] = useState(null);
  const svgRef = useRef(null);
  const [boardRotation, setBoardRotation] = useState(0);
  const [showLesson, setShowLesson] = useState(false);

  // Check if all pegs have the correct gear
  const isSolved = useMemo(() => {
    let solved = true;
    for (const peg of pegs) {
      const gearAtPeg = gears.find(g => g.x === peg.x && g.y === peg.y);
      if (!gearAtPeg || gearAtPeg.teeth !== peg.requiredTeeth) {
        solved = false;
      }
    }
    return solved;
  }, [gears, pegs]);

  // Show lesson modal after a short delay when solved
  useEffect(() => {
    if (isSolved) {
      const timer = setTimeout(() => {
        setShowLesson(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setShowLesson(false);
    }
  }, [isSolved]);

  const [inputRotation, setInputRotation] = useState(0);

  useEffect(() => {
    let animationId;
    const animate = () => {
      setInputRotation(prev => prev + level.target.inputSpeed);
      if (isSolved) {
        setBoardRotation(prev => prev + level.target.inputSpeed);
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isSolved, level]);

  const handlePointerDown = (e, id) => {
    if (isSolved) return; 
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

    setGears(gears.map(g => g.id === draggingId ? { ...g, x: cursorPt.x, y: cursorPt.y } : g));
  };

  const handlePointerUp = (e) => {
    if (!draggingId) return;
    let snappedGears = [...gears];
    const gear = snappedGears.find(g => g.id === draggingId);
    
    // Snapping logic
    for (const peg of pegs) {
      const dist = Math.hypot(gear.x - peg.x, gear.y - peg.y);
      if (dist < 50) { 
        gear.x = peg.x;
        gear.y = peg.y;
        break;
      }
    }
    setGears(snappedGears);
    setDraggingId(null);
  };

  // Pre-calculate rotations for each peg based on gear trains
  const pegRotations = useMemo(() => {
    const rots = new Array(pegs.length).fill(0);
    if (!isSolved) return rots;

    // Peg 0 is input
    rots[0] = boardRotation;
    let currentSpeed = 1;
    
    for (let i = 1; i < pegs.length; i++) {
      const prevPeg = pegs[i-1];
      const currPeg = pegs[i];
      // Ratio = -(Teeth_prev / Teeth_curr)
      const ratio = -(prevPeg.requiredTeeth / currPeg.requiredTeeth);
      currentSpeed = currentSpeed * ratio;
      // Add an offset so the teeth visually mesh
      const offset = (360 / currPeg.requiredTeeth) / 2;
      rots[i] = (boardRotation * currentSpeed) + offset;
    }
    return rots;
  }, [isSolved, boardRotation, pegs]);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', flexDirection: 'row' }}>
      
      {/* Target Reference is still absolute but anchored to the right */}
      <TargetReference targetConfig={level.target} />

      {/* Main SVG Area utilizing ViewBox for scalable layout */}
      <div style={{ flex: 1, position: 'relative' }}>
        
        {showLesson && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#ecf0f1', padding: '30px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 20, maxWidth: '500px', textAlign: 'center' }}>
            <h2 style={{ color: '#2c3e50', marginTop: 0 }}>Level Complete!</h2>
            <p style={{ color: '#34495e', fontSize: '18px', lineHeight: '1.6' }}>{level.lesson}</p>
            <button 
              onClick={isLastLevel ? onBack : onNextLevel} 
              style={{ marginTop: '20px', padding: '10px 20px', background: '#27ae60', border: 'none', color: 'white', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' }}
            >
              {isLastLevel ? 'Return to Menu' : 'Next Level'}
            </button>
          </div>
        )}

        <svg 
          ref={svgRef}
          width="100%" 
          height="100%" 
          viewBox="0 0 1024 768"
          preserveAspectRatio="xMidYMid slice"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{ display: 'block' }}
        >
          {/* Draw Left Shelf Area Background (Fixed 250px in the 1024 coordinate space) */}
          <rect x="0" y="0" width="250" height="768" fill="rgba(0,0,0,0.2)" />
          
          {/* HTML Overlay text inside SVG using foreignObject for better scaling */}
          <foreignObject x="20" y="20" width="210" height="300">
            <div xmlns="http://www.w3.org/1999/xhtml" style={{ color: 'white' }}>
              <button onClick={onBack} style={{ marginBottom: '10px', padding: '8px 12px', background: '#34495e', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>&larr; Menu</button>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>{level.title}</h2>
              <p style={{ margin: '0 0 20px 0', fontSize: '14px', lineHeight: '1.4', opacity: 0.8 }}>{level.description}</p>
              {isSolved && <div style={{ color: '#2ecc71', fontSize: '18px', fontWeight: 'bold' }}>Solved!</div>}
              <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
              <h3 style={{ margin: '10px 0 0 0', opacity: 0.5, fontSize: '16px', textAlign: 'center' }}>Parts Shelf</h3>
            </div>
          </foreignObject>

          {/* Draw pegs and hints */}
          {pegs.map((p, i) => (
            <g key={p.id} transform={`translate(${p.x}, ${p.y})`}>
              {p.type === 'input' && (
                <g>
                  <circle r={p.requiredTeeth * (40/12) + 5} fill="none" stroke="#e74c3c" strokeWidth="2" strokeDasharray="5,5" opacity="0.3" />
                  <text y={-p.requiredTeeth * (40/12) - 15} fill="#e74c3c" fontSize="14" textAnchor="middle">Input Motor</text>
                  <g transform={`rotate(${inputRotation})`} opacity="0.5">
                     <rect x="-5" y="0" width="10" height="30" fill="#e74c3c" />
                  </g>
                </g>
              )}
              
              {p.type === 'output' && (
                <g>
                  <circle r={p.requiredTeeth * (40/12) + 5} fill="none" stroke="#e67e22" strokeWidth="2" strokeDasharray="5,5" opacity="0.3" />
                  <text y={-p.requiredTeeth * (40/12) - 15} fill="#e67e22" fontSize="14" textAnchor="middle">Output Dial</text>
                  <g transform={`rotate(${isSolved ? pegRotations[i] : 0})`} opacity="0.5">
                     <line x1="0" y1="-25" x2="0" y2="25" stroke="#e67e22" strokeWidth="4" />
                     <line x1="-25" y1="0" x2="25" y2="0" stroke="#e67e22" strokeWidth="4" />
                  </g>
                </g>
              )}

              {p.type === 'idler' && (
                <g>
                  <circle r={p.requiredTeeth * (40/12) + 5} fill="none" stroke="#95a5a6" strokeWidth="2" strokeDasharray="5,5" opacity="0.2" />
                  <text y={-p.requiredTeeth * (40/12) - 15} fill="#95a5a6" fontSize="12" textAnchor="middle">Idler</text>
                </g>
              )}

              <circle r={12} fill="#7f8c8d" />
              <circle r={6} fill="#2c3e50" />
            </g>
          ))}

          {/* Draw gears */}
          {gears.map(g => {
            let currentRotation = g.startRot;
            
            // Determine if placed on a peg
            const pegIndex = pegs.findIndex(p => p.x === g.x && p.y === g.y);
            if (pegIndex !== -1) {
              const peg = pegs[pegIndex];
              if (peg.type === 'input') {
                currentRotation = inputRotation;
              } else if (isSolved) {
                currentRotation = pegRotations[pegIndex];
              }
            }

            return (
              <Gear 
                key={g.id} 
                {...g} 
                rotation={currentRotation}
                onPointerDown={(e) => handlePointerDown(e, g.id)} 
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
