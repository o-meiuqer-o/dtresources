import React, { useState, useRef, useEffect, useMemo } from 'react';
import Confetti from 'react-confetti';
import Gear from './Gear';
import { audio } from '../audio';

// Target Reference: Shows the OUTSIDE of the machine, now rendered purely in SVG
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
    <g transform="translate(1050, 90)">
      <rect x="0" y="0" width="204" height="150" fill="rgba(0,0,0,0.4)" rx="15" />
      <text x="102" y="25" fill="white" fontSize="14" textAnchor="middle" textTransform="uppercase" letterSpacing="1">Target Product</text>
      
      <g transform="scale(0.8) translate(30, 45)">
         <rect x="0" y="0" width="200" height="100" fill="#34495e" rx="10" />
         <rect x="5" y="5" width="190" height="90" fill="#2c3e50" rx="8" />
         <text x="100" y="90" fill="#7f8c8d" fontSize="12" textAnchor="middle" fontWeight="bold">MECHANISM</text>
         
         {targetConfig.type === 'conveyor' ? (
           <g transform={`translate(100, 50)`}>
             {/* Conveyor Belt System */}
             <circle cx="-30" cy="15" r="15" fill="#7f8c8d" />
             <circle cx="-30" cy="15" r="15" fill="none" stroke="#bdc3c7" strokeWidth="2" strokeDasharray="5,5" transform={`rotate(${r2}, -30, 15)`} />
             
             <circle cx="50" cy="15" r="15" fill="#7f8c8d" />
             <circle cx="50" cy="15" r="15" fill="none" stroke="#bdc3c7" strokeWidth="2" strokeDasharray="5,5" transform={`rotate(${r2}, 50, 15)`} />
             
             <line x1="-30" y1="0" x2="50" y2="0" stroke="#34495e" strokeWidth="4" strokeDasharray="10,5" strokeDashoffset={r2 * (15 / 10)} />
             <line x1="-30" y1="30" x2="50" y2="30" stroke="#34495e" strokeWidth="4" strokeDasharray="10,5" strokeDashoffset={-r2 * (15 / 10)} />
             
             {/* Moving Box (Oscillates back and forth over the conveyor for visual effect) */}
             <rect x={-20 + (((Math.abs(r2)/2) % 360) / 360) * 60} y="-15" width="20" height="15" fill="#e67e22" rx="2" />
             <text x="10" y="-20" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">CONVEYOR</text>
           </g>
         ) : targetConfig.type === 'bicycle' ? (
           <g transform={`translate(100, 50)`}>
             <circle cx="40" cy="15" r="25" fill="none" stroke="#2c3e50" strokeWidth="4" />
             <circle cx="40" cy="15" r="25" fill="none" stroke="#34495e" strokeWidth="2" strokeDasharray="4,6" transform={`rotate(${r2}, 40, 15)`} />
             <circle cx="40" cy="15" r="8" fill="#7f8c8d" transform={`rotate(${r2}, 40, 15)`} />
             <circle cx="40" cy="15" r="4" fill="#34495e" />
             
             <circle cx="-30" cy="15" r="12" fill="#7f8c8d" />
             <g transform={`rotate(${r1}, -30, 15)`}>
                <line x1="-30" y1="15" x2="-30" y2="35" stroke="#2c3e50" strokeWidth="4" />
                <rect x="-35" y="30" width="10" height="10" fill="#e74c3c" />
                <line x1="-30" y1="15" x2="-30" y2="-5" stroke="#2c3e50" strokeWidth="4" />
                <rect x="-35" y="-10" width="10" height="10" fill="#e74c3c" />
             </g>

             <line x1="-30" y1="3" x2="40" y2="7" stroke="#34495e" strokeWidth="2" strokeDasharray="3,3" strokeDashoffset={-r1} />
             <line x1="-30" y1="27" x2="40" y2="23" stroke="#34495e" strokeWidth="2" strokeDasharray="3,3" strokeDashoffset={r1} />
             
             <text x="-40" y="-15" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">BICYCLE</text>
           </g>
         ) : targetConfig.type === 'mill' ? (
           <g transform={`translate(100, 50)`}>
             <polygon points="10,-25 30,-25 25,-5 15,-5" fill="#e67e22" />
             <g transform={`translate(5, 5) rotate(${r1})`}>
                <circle r="15" fill="#95a5a6" stroke="#7f8c8d" strokeWidth="2" />
                <circle r="10" fill="none" stroke="#bdc3c7" strokeWidth="2" strokeDasharray="4,4" />
             </g>
             <g transform={`translate(35, 5) rotate(${r2})`}>
                <circle r="15" fill="#95a5a6" stroke="#7f8c8d" strokeWidth="2" />
                <circle r="10" fill="none" stroke="#bdc3c7" strokeWidth="2" strokeDasharray="4,4" />
             </g>
             <circle cx="20" cy="25" r="2" fill="#f1c40f" />
             <circle cx="17" cy="30" r="2" fill="#f1c40f" />
             <circle cx="23" cy="32" r="2" fill="#f1c40f" />
             <text x="20" y="-35" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">ROLLER MILL</text>
           </g>
         ) : targetConfig.type === 'cam_engine' ? (
           <g transform={`translate(100, 50)`}>
             <g transform={`translate(0, 15) rotate(${r2})`}>
                <path d="M -15 0 A 15 15 0 1 0 15 0 C 15 -15, 5 -30, 0 -30 C -5 -30, -15 -15, -15 0" fill="#95a5a6" />
             </g>
             <line x1="0" y1="-30" x2="0" y2={15 - (15 + 15 * Math.max(0, Math.cos((r2 * Math.PI)/180)))} stroke="#bdc3c7" strokeWidth="6" />
             <rect x="-10" y={15 - (15 + 15 * Math.max(0, Math.cos((r2 * Math.PI)/180)))} width="20" height="4" fill="#7f8c8d" />
             <text x="0" y="-35" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">VALVE</text>
           </g>
         ) : targetConfig.type === 'train' ? (
           <g transform={`translate(100, 50)`}>
             <line x1="-70" y1="20" x2="70" y2="20" stroke="#7f8c8d" strokeWidth="4" />
             <rect x={-50 + Math.cos((r2 * Math.PI)/180)*15} y="0" width="30" height="15" fill="#e67e22" rx="2" />
             <line x1={-35 + Math.cos((r2 * Math.PI)/180)*15} y1="7.5" x2={35 + Math.cos((r2 * Math.PI)/180)*15} y2={Math.sin((r2 * Math.PI)/180)*15} stroke="#ecf0f1" strokeWidth="4" />
             <g transform={`translate(35, 0)`}>
               <circle r="25" fill="#c0392b" stroke="#922b21" strokeWidth="6" />
               <circle r="25" fill="none" stroke="#ecf0f1" strokeWidth="2" strokeDasharray="10,10" transform={`rotate(${r2})`} />
               <circle cx={Math.cos((r2 * Math.PI)/180)*15} cy={Math.sin((r2 * Math.PI)/180)*15} r="4" fill="#f1c40f" />
             </g>
             <text x="-40" y="-15" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">PISTON</text>
           </g>
         ) : targetConfig.type === 'crane' ? (
           <g transform={`translate(100, 50)`}>
             <circle r="12" fill="#7f8c8d" />
             <circle r="18" fill="none" stroke="#95a5a6" strokeWidth="4" strokeDasharray="8,6" transform={`rotate(${r2})`} />
             <g>
               <line x1="18" y1="0" x2="18" y2={60 - ((Math.abs(r2) % 360) / 360 * 40)} stroke="#bdc3c7" strokeWidth="2" />
               <rect x="-2" y={60 - ((Math.abs(r2) % 360) / 360 * 40)} width="40" height="30" fill="#c0392b" rx="3" />
               <text x="18" y={80 - ((Math.abs(r2) % 360) / 360 * 40)} fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">2 TON</text>
             </g>
           </g>
         ) : (
           <>
             <text x="50" y="-10" fill="#ecf0f1" fontSize="14" textAnchor="middle">Input</text>
             <text x="150" y="-10" fill="#ecf0f1" fontSize="14" textAnchor="middle">Output</text>
             <g transform={`translate(50, 50) rotate(${r1})`}>
               <circle r="15" fill="#e74c3c" />
               <rect x="-5" y="0" width="10" height="30" fill="#c0392b" />
               <circle cx="0" cy="30" r="8" fill="#f1c40f" />
             </g>
             <g transform={`translate(150, 50) rotate(${r2})`}>
               <circle r="25" fill="#3498db" stroke="#2980b9" strokeWidth="4" />
               <line x1="0" y1="-25" x2="0" y2="25" stroke="#f1c40f" strokeWidth="4" />
               <line x1="-25" y1="0" x2="25" y2="0" stroke="#f1c40f" strokeWidth="4" />
               <circle r="5" fill="#f39c12" />
             </g>
           </>
         )}
      </g>
    </g>
  );
}

export default function GameBoard({ level, onBack, onNextLevel, isLastLevel }) {
  const [gears, setGears] = useState(() => {
    return level.shelfGears.map((g, index) => ({
      ...g,
      x: 125,
      y: 400 + index * 150,
      startRot: 0,
      isOnShelf: true,
      sliderId: null,
      beltId: null
    }));
  });
  
  const pegs = level.pegs;
  const sliders = level.sliders || [];
  const beltsConfig = level.belts || [];

  const [draggingId, setDraggingId] = useState(null);
  const [shelfDragStart, setShelfDragStart] = useState(null);
  const [shelfScrollY, setShelfScrollY] = useState(0);
  const svgRef = useRef(null);
  const [boardRotation, setBoardRotation] = useState(0);
  const [showLesson, setShowLesson] = useState(false);
  const [startTime] = useState(Date.now());
  const [endTime, setEndTime] = useState(null);

  const [windowDim, setWindowDim] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  
  useEffect(() => {
    const handleResize = () => setWindowDim({ w: window.innerWidth, h: window.innerHeight });
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const isSolved = useMemo(() => {
    let solved = true;
    for (const peg of pegs) {
      if (peg.requiredType === 'cam') {
        const gearAtPeg = gears.find(g => g.type === 'cam' && g.x === peg.x && g.y === peg.y);
        if (!gearAtPeg) {
          solved = false;
        }
      } else {
        const gearAtPeg = gears.find(g => g.type !== 'cam' && g.type !== 'linkage' && g.type !== 'belt' && g.type !== 'crossed_belt' && g.x === peg.x && g.y === peg.y);
        if (!gearAtPeg || gearAtPeg.teeth !== peg.requiredTeeth) {
          solved = false;
        }
      }
    }
    for (const slider of sliders) {
      const link = gears.find(g => g.type === 'linkage' && g.sliderId === slider.id);
      if (!link || link.length !== slider.requiredLength) {
        solved = false;
      }
    }
    for (const belt of beltsConfig) {
      const placedBelt = gears.find(g => (g.type === 'belt' || g.type === 'crossed_belt') && g.beltId === belt.id && g.beltType === belt.type);
      if (!placedBelt) {
        solved = false;
      }
    }
    return solved;
  }, [gears, pegs, sliders, beltsConfig]);

  useEffect(() => {
    if (isSolved && !endTime) {
      setEndTime(Date.now());
    }
  }, [isSolved, endTime]);

  let stars = 0;
  if (isSolved && endTime) {
    const timeTaken = (endTime - startTime) / 1000;
    if (timeTaken <= 15) stars = 3;
    else if (timeTaken <= 30) stars = 2;
    else stars = 1;
  }
  const starString = "★".repeat(stars) + "☆".repeat(3 - stars);

  useEffect(() => {
    if (isSolved) {
      setShowLesson(true);
      audio.stopMotor();
      audio.playSuccess();
    } else {
      setShowLesson(false);
    }
  }, [isSolved]);

  useEffect(() => {
    if (!isSolved && draggingId === null && window.AudioContext) {
      const timeout = setTimeout(() => {
         if (!isSolved) audio.startMotor();
      }, 500);
      return () => clearTimeout(timeout);
    }
    if (draggingId !== null) {
      audio.stopMotor();
    }
  }, [isSolved, draggingId]);

  const [inputRotation, setInputRotation] = useState(0);
  const isDragging = draggingId !== null;

  useEffect(() => {
    let animationId;
    const animate = () => {
      if (!isDragging) {
        setInputRotation(prev => prev + level.target.inputSpeed);
        if (isSolved) {
          setBoardRotation(prev => prev + level.target.inputSpeed);
        }
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isSolved, level, isDragging]);

  const handlePointerDown = (e, id) => {
    e.stopPropagation();
    if (isSolved) return; 
    audio.startBGM();
    audio.playGrab();
    setDraggingId(id);
    setGears(prevGears => prevGears.map(g => {
      if (g.id === id && g.isOnShelf) {
        return { ...g, isOnShelf: false, y: g.y + shelfScrollY };
      }
      return g;
    }));
    e.target.setPointerCapture(e.pointerId);
  };

  const handleShelfPointerDown = (e) => {
    audio.startBGM();
    e.target.setPointerCapture(e.pointerId);
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorPt = pt.matrixTransform(svg.getScreenCTM().inverse());
    setShelfDragStart({ y: cursorPt.y, scrollY: shelfScrollY });
  };

  const handlePointerMove = (e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorPt = pt.matrixTransform(svg.getScreenCTM().inverse());

    if (shelfDragStart) {
       const dy = (cursorPt.y - shelfDragStart.y) * 3.6;
       let newScroll = shelfDragStart.scrollY + dy;
       const totalContentHeight = level.shelfGears.length * 150 + 150; 
       const visibleHeight = 420; 
       const maxScrollUp = totalContentHeight > visibleHeight ? -(totalContentHeight - visibleHeight) : 0;
       newScroll = Math.min(0, Math.max(maxScrollUp, newScroll));
       setShelfScrollY(newScroll);
       return;
    }

    if (!draggingId) return;
    setGears(gears.map(g => g.id === draggingId ? { ...g, x: cursorPt.x, y: cursorPt.y } : g));
  };

  const handlePointerUp = (e) => {
    if (shelfDragStart) {
       setShelfDragStart(null);
       return;
    }
    if (!draggingId) return;
    let snappedGears = [...gears];
    const gearIndex = snappedGears.findIndex(g => g.id === draggingId);
    const gear = snappedGears[gearIndex];
    let snapped = false;

    if (gear.type === 'linkage') {
      for (const slider of sliders) {
        const peg = pegs.find(p => p.id === slider.pegId);
        const midX = (peg.x + slider.startX) / 2;
        const midY = (peg.y + slider.y) / 2;
        const dist = Math.hypot(gear.x - midX, gear.y - midY);
        if (dist < 120 && gear.length === slider.requiredLength) {
          gear.sliderId = slider.id;
          gear.x = midX;
          gear.y = midY;
          snapped = true;
          break;
        }
      }
    } else if (gear.type === 'belt' || gear.type === 'crossed_belt') {
      for (const belt of beltsConfig) {
        if (belt.type === gear.beltType) {
          const p1 = pegs.find(p => p.id === belt.p1);
          const p2 = pegs.find(p => p.id === belt.p2);
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          const dist = Math.hypot(gear.x - midX, gear.y - midY);
          if (dist < 150) {
            gear.beltId = belt.id;
            gear.x = midX;
            gear.y = midY;
            snapped = true;
            break;
          }
        }
      }
    } else {
      for (const peg of pegs) {
        const dist = Math.hypot(gear.x - peg.x, gear.y - peg.y);
        if (dist < 50) { 
          gear.x = peg.x;
          gear.y = peg.y;
          snapped = true;
          break;
        }
      }
    }

    if (!snapped && gear.x < 250) {
      gear.isOnShelf = true;
      gear.sliderId = null;
      gear.beltId = null;
      gear.x = 125;
      gear.y = gear.y - shelfScrollY; 
    } else if (!snapped) {
      gear.sliderId = null;
      gear.beltId = null;
    }

    if (snapped) {
      audio.playSnap();
    } else {
      audio.playDrop();
    }

    setGears(snappedGears);
    setDraggingId(null);
  };

  const handleWheel = (e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorPt = pt.matrixTransform(svg.getScreenCTM().inverse());
    if (cursorPt.x <= 250) {
      setShelfScrollY(prev => {
        const newScroll = prev - e.deltaY;
        const totalContentHeight = level.shelfGears.length * 150 + 150; 
        const visibleHeight = 468; 
        const maxScrollUp = totalContentHeight > visibleHeight ? -(totalContentHeight - visibleHeight) : 0;
        return Math.min(0, Math.max(maxScrollUp, newScroll));
      });
    }
  };

  // Graph-based speed traversal
  const pegSpeeds = useMemo(() => {
    const speeds = new Array(pegs.length).fill(0);
    speeds[0] = 1;
    for (let i = 1; i < pegs.length; i++) {
      const p = pegs[i];
      if (p.drivenBy) {
         const srcIdx = pegs.findIndex(x => x.id === p.drivenBy);
         if (srcIdx !== -1) {
           const srcP = pegs[srcIdx];
           const ratio = srcP.requiredTeeth / p.requiredTeeth;
           let sign = (p.driveType === 'gear' || p.driveType === 'crossed_belt') ? -1 : 1;
           if (p.driveType === 'shaft') {
             speeds[i] = speeds[srcIdx];
           } else {
             speeds[i] = speeds[srcIdx] * sign * ratio;
           }
         }
      } else {
         const srcP = pegs[i-1];
         const ratio = -(srcP.requiredTeeth / p.requiredTeeth);
         speeds[i] = speeds[i-1] * ratio;
      }
    }
    return speeds;
  }, [pegs]);

  const pegRotations = useMemo(() => {
    const rots = new Array(pegs.length).fill(0);
    if (!isSolved) return rots;
    for (let i = 0; i < pegs.length; i++) {
      rots[i] = boardRotation * pegSpeeds[i];
    }
    return rots;
  }, [isSolved, boardRotation, pegs, pegSpeeds]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.warn(e));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const getDragStyle = (id) => {
    const isSelected = draggingId === id;
    return {
      cursor: isSelected ? 'grabbing' : 'grab',
      filter: isSelected ? 'drop-shadow(0px 0px 8px #f1c40f) drop-shadow(0px 0px 15px rgba(241,196,15,0.8))' : 'none',
      transition: 'filter 0.2s'
    };
  };

  const toggleAudio = () => {
    const muted = audio.toggleMute();
    setIsAudioMuted(muted);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {showLesson && <Confetti width={windowDim.w} height={windowDim.h} recycle={false} numberOfPieces={500} />}
      {showLesson && (
        <div className="celebration-modal">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div>
              <h2 style={{ color: '#2c3e50', margin: 0, fontSize: '28px', textAlign: 'left' }}>Level Complete!</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                 <div className="stars-container" style={{ margin: 0, fontSize: '24px' }}>{starString}</div>
                 <span style={{ fontSize: '14px', color: '#7f8c8d' }}>Solved in {((endTime - startTime)/1000).toFixed(1)}s</span>
              </div>
            </div>
            <button className="btn-primary" onClick={isLastLevel ? onBack : onNextLevel} style={{ margin: 0, padding: '12px 25px', fontSize: '18px' }}>
              {isLastLevel ? 'Return to Menu' : 'Next Level ➔'}
            </button>
          </div>
          <p style={{ color: '#34495e', fontSize: '18px', lineHeight: '1.6', background: 'rgba(236, 240, 241, 0.8)', padding: '15px', borderRadius: '10px', margin: 0, textAlign: 'left', borderLeft: '5px solid #3498db' }}>
            <strong>The Lesson:</strong> {level.lesson}
          </p>
        </div>
      )}

      <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid meet" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onWheel={handleWheel} style={{ display: 'block', background: 'rgba(0,0,0,0.1)' }}>
        <defs>
          <clipPath id="shelfClip">
            <rect x="0" y="300" width="330" height="420" />
          </clipPath>
        </defs>

        <TargetReference targetConfig={level.target} />

        <rect x="0" y="0" width="330" height="720" fill="rgba(0,0,0,0.3)" onPointerDown={handleShelfPointerDown} style={{ cursor: 'ns-resize' }} />
        
        {/* Scroll Zone Visual Indicator */}
        <rect x="250" y="300" width="80" height="420" fill="rgba(255,255,255,0.05)" style={{ pointerEvents: 'none' }} />
        <g style={{ pointerEvents: 'none' }} opacity="0.6">
           <path d="M 290 320 L 280 335 L 300 335 Z" fill="#bdc3c7" />
           <line x1="290" y1="335" x2="290" y2="685" stroke="#bdc3c7" strokeWidth="4" strokeDasharray="10,10" />
           <path d="M 290 700 L 280 685 L 300 685 Z" fill="#bdc3c7" />
           <text x="290" y="510" fill="#bdc3c7" fontSize="16" transform="rotate(-90 290 510)" textAnchor="middle" letterSpacing="4" fontWeight="bold">SCROLL ZONE</text>
        </g>

        <foreignObject x="20" y="20" width="210" height="280">
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ color: 'white' }}>
            <button onClick={onBack} style={{ marginBottom: '15px', padding: '8px 12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', backdropFilter: 'blur(5px)' }}>&larr; Menu</button>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{level.title}</h2>
            <p style={{ margin: '0 0 10px 0', fontSize: '15px', lineHeight: '1.4', opacity: 0.9 }}>{level.description}</p>
            {isSolved && <div style={{ color: '#f1c40f', fontSize: '20px', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Solved!</div>}
            <div style={{ marginTop: '15px' }} />
            <h3 style={{ margin: '15px 0 0 0', color: '#bdc3c7', fontSize: '16px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>Parts Shelf <br/><span style={{fontSize: '11px', opacity: 0.7}}>(Scrollable)</span></h3>
          </div>
        </foreignObject>

        {/* UI Overlay Buttons */}
        <foreignObject x="1100" y="20" width="160" height="50">
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingRight: '20px' }}>
            <button onClick={toggleAudio} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
              {isAudioMuted ? '🔇' : '🔊'}
            </button>
            <button onClick={toggleFullscreen} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
              {isFullscreen ? '↙' : '⛶'}
            </button>
          </div>
        </foreignObject>

        {/* Mobile Tutorial Overlays */}
        {(level.id === 1 || level.id === 2) && ('ontouchstart' in window || navigator.maxTouchPoints > 0) && (
          <g>
            {/* Shelf Scroll Hint */}
            <rect x="20" y="320" width="210" height="40" fill="rgba(52, 152, 219, 0.8)" rx="20" />
            <text x="125" y="346" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">↑ SWIPE TO SCROLL ↓</text>
            
            {/* Drag Hint */}
            <rect x="20" y="100" width="210" height="40" fill="rgba(231, 76, 60, 0.8)" rx="20" />
            <text x="125" y="126" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">TAP &amp; DRAG TO MOVE</text>

            {/* Place Hint */}
            <rect x="420" y="300" width="200" height="40" fill="rgba(46, 204, 113, 0.8)" rx="20" />
            <text x="520" y="326" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">DRAG TO HIGHLIGHTS</text>
          </g>
        )}

        {/* Draw Placed Belts (behind gears) */}
        {gears.filter(g => !g.isOnShelf && (g.type === 'belt' || g.type === 'crossed_belt')).map(g => {
           if (!g.beltId) {
              return (
                 <g key={g.id} transform={`translate(${g.x}, ${g.y})`} onPointerDown={(e) => handlePointerDown(e, g.id)} style={getDragStyle(g.id)}>
                    <rect x="-40" y="-10" width="80" height="20" fill="none" stroke={g.color} strokeWidth="6" rx="10" />
                 </g>
              );
           }
           const beltConfig = beltsConfig.find(b => b.id === g.beltId);
           const p1 = pegs.find(p => p.id === beltConfig.p1);
           const p2 = pegs.find(p => p.id === beltConfig.p2);
           const r1 = p1.requiredTeeth * (40/12);
           const r2 = p2.requiredTeeth * (40/12);
           const d = Math.hypot(p2.x - p1.x, p2.y - p1.y);
           const phi = Math.atan2(p2.y - p1.y, p2.x - p1.x);
           
           if (g.type === 'belt') {
              const alpha = Math.acos((r1 - r2) / d);
              const x1t = p1.x + r1 * Math.cos(phi + alpha);
              const y1t = p1.y + r1 * Math.sin(phi + alpha);
              const x2t = p2.x + r2 * Math.cos(phi + alpha);
              const y2t = p2.y + r2 * Math.sin(phi + alpha);
              const x1b = p1.x + r1 * Math.cos(phi - alpha);
              const y1b = p1.y + r1 * Math.sin(phi - alpha);
              const x2b = p2.x + r2 * Math.cos(phi - alpha);
              const y2b = p2.y + r2 * Math.sin(phi - alpha);
              
              return (
                 <g key={g.id} onPointerDown={(e) => handlePointerDown(e, g.id)} style={{cursor: 'grab'}}>
                    <line x1={x1t} y1={y1t} x2={x2t} y2={y2t} stroke={g.color} strokeWidth="8" />
                    <line x1={x1b} y1={y1b} x2={x2b} y2={y2b} stroke={g.color} strokeWidth="8" />
                    <line x1={x1t} y1={y1t} x2={x2t} y2={y2t} stroke="#ecf0f1" strokeWidth="2" strokeDasharray="10,10" strokeDashoffset={-boardRotation} />
                    <line x1={x1b} y1={y1b} x2={x2b} y2={y2b} stroke="#ecf0f1" strokeWidth="2" strokeDasharray="10,10" strokeDashoffset={boardRotation} />
                 </g>
              );
           } else if (g.type === 'crossed_belt') {
              const alpha = Math.acos((r1 + r2) / d);
              const x1t = p1.x + r1 * Math.cos(phi + alpha);
              const y1t = p1.y + r1 * Math.sin(phi + alpha);
              const x2b = p2.x + r2 * Math.cos(phi + Math.PI + alpha);
              const y2b = p2.y + r2 * Math.sin(phi + Math.PI + alpha);
              const x1b = p1.x + r1 * Math.cos(phi - alpha);
              const y1b = p1.y + r1 * Math.sin(phi - alpha);
              const x2t = p2.x + r2 * Math.cos(phi + Math.PI - alpha);
              const y2t = p2.y + r2 * Math.sin(phi + Math.PI - alpha);

              return (
                 <g key={g.id} onPointerDown={(e) => handlePointerDown(e, g.id)} style={{cursor: 'grab'}}>
                    <line x1={x1t} y1={y1t} x2={x2b} y2={y2b} stroke={g.color} strokeWidth="8" />
                    <line x1={x1b} y1={y1b} x2={x2t} y2={y2t} stroke={g.color} strokeWidth="8" />
                 </g>
              );
           }
        })}

        {/* Draw sliders (piston tracks) */}
        {sliders.map(s => {
          const connectedLinkage = gears.find(g => g.type === 'linkage' && g.sliderId === s.id);
          let sx = s.startX;
          if (connectedLinkage) {
             const pegIndex = pegs.findIndex(p => p.id === s.pegId);
             const peg = pegs[pegIndex];
             let gearRotation = 0;
             if (isSolved) {
               gearRotation = peg.type === 'input' ? inputRotation : pegRotations[pegIndex];
             } else {
               gearRotation = peg.type === 'input' ? inputRotation : 0;
             }
             const rad = (gearRotation * Math.PI) / 180;
             const px = peg.x + (peg.pinOffset || 0) * Math.cos(rad);
             const py = peg.y + (peg.pinOffset || 0) * Math.sin(rad);
             const dx = Math.sqrt(Math.abs(connectedLinkage.length ** 2 - (s.y - py) ** 2));
             sx = px + dx;
          }
          return (
            <g key={s.id}>
               <line x1={s.startX - 100} y1={s.y} x2={s.startX + 150} y2={s.y} stroke="#7f8c8d" strokeWidth="6" strokeLinecap="round" />
               <rect x={sx - 15} y={s.y - 15} width="30" height="30" fill="#e67e22" rx="4" stroke="#d35400" strokeWidth="2" />
               <circle cx={sx} cy={s.y} r="5" fill="#2c3e50" />
               {!connectedLinkage && !level.hideCues && (
                  <line x1={pegs.find(p => p.id === s.pegId).x} y1={pegs.find(p => p.id === s.pegId).y} x2={s.startX} y2={s.y} stroke="#e67e22" strokeWidth="2" strokeDasharray="5,5" opacity="0.4" />
               )}
            </g>
          );
        })}

        {/* Draw followers */}
        {(level.followers || []).map(f => {
           const pegIndex = pegs.findIndex(p => p.id === f.pegId);
           const peg = pegs[pegIndex];
           let gearRotation = 0;
           if (isSolved) {
             gearRotation = peg.type === 'input' ? inputRotation : pegRotations[pegIndex];
           } else {
             gearRotation = peg.type === 'input' ? inputRotation : 0;
           }
           
           const rad = (gearRotation * Math.PI) / 180;
           const effectiveHeight = 30 + 30 * Math.max(0, Math.cos(rad)); 
           const followerY = peg.y - effectiveHeight;

           return (
             <g key={f.id}>
               <line x1={peg.x - 15} y1={peg.y - 100} x2={peg.x + 15} y2={peg.y - 100} stroke="#7f8c8d" strokeWidth="4" />
               <line x1={peg.x} y1={followerY - 100} x2={peg.x} y2={followerY} stroke="#bdc3c7" strokeWidth="8" strokeLinecap="round" />
               <line x1={peg.x - 15} y1={followerY} x2={peg.x + 15} y2={followerY} stroke="#bdc3c7" strokeWidth="6" strokeLinecap="round" />
             </g>
           );
        })}

        {/* Draw pegs and hints */}
        {pegs.map((p, i) => (
          <g key={p.id} transform={`translate(${p.x}, ${p.y})`}>
            {p.type === 'input' && (
              <g>
                {!level.hideCues && <circle r={p.requiredTeeth * (40/12) + 5} fill="none" stroke="#e74c3c" strokeWidth="2" strokeDasharray="5,5" opacity="0.4" />}
                <text y={-p.requiredTeeth * (40/12) - 15} fill="#e74c3c" fontSize="14" textAnchor="middle" fontWeight="bold">Input Motor</text>
                <g transform={`rotate(${inputRotation})`} opacity="0.6">
                   <rect x="-5" y="0" width="10" height="30" fill="#e74c3c" />
                </g>
              </g>
            )}
            {p.type === 'output' && (
              <g>
                {!level.hideCues && <circle r={p.requiredTeeth * (40/12) + 5} fill="none" stroke="#f1c40f" strokeWidth="2" strokeDasharray="5,5" opacity="0.4" />}
                <text y={-p.requiredTeeth * (40/12) - 15} fill="#f1c40f" fontSize="14" textAnchor="middle" fontWeight="bold">Output</text>
                <g transform={`rotate(${isSolved ? pegRotations[i] : 0})`} opacity="0.6">
                   <line x1="0" y1="-25" x2="0" y2="25" stroke="#f1c40f" strokeWidth="4" />
                   <line x1="-25" y1="0" x2="25" y2="0" stroke="#f1c40f" strokeWidth="4" />
                </g>
              </g>
            )}
            {p.type === 'idler' && (
              <g>
                {!level.hideCues && <circle r={p.requiredTeeth * (40/12) + 5} fill="none" stroke="#95a5a6" strokeWidth="2" strokeDasharray="5,5" opacity="0.3" />}
                <text y={-p.requiredTeeth * (40/12) - 15} fill="#95a5a6" fontSize="12" textAnchor="middle">Idler</text>
              </g>
            )}
            <circle r={12} fill="#7f8c8d" />
            <circle r={6} fill="#2c3e50" />
          </g>
        ))}

        {/* Draw gears & cams on the board */}
        {gears.filter(g => !g.isOnShelf && g.type !== 'belt' && g.type !== 'crossed_belt' && g.type !== 'linkage').map(g => {
          let currentRotation = g.startRot;
          const pegIndex = pegs.findIndex(p => p.x === g.x && p.y === g.y);
          if (pegIndex !== -1) {
            const peg = pegs[pegIndex];
            if (peg.type === 'input') {
              currentRotation = inputRotation;
            } else if (isSolved) {
              currentRotation = pegRotations[pegIndex];
            } else {
              currentRotation = peg.type === 'input' ? inputRotation : 0;
            }
          }
          return (
            <Gear 
              key={g.id} 
              {...g} 
              rotation={currentRotation}
              pinOffset={pegs[pegIndex]?.pinOffset}
              onPointerDown={(e) => handlePointerDown(e, g.id)} 
              dragStyle={getDragStyle(g.id)}
            />
          );
        })}

        {/* Draw linkages on the board (on top of gears) */}
        {gears.filter(g => !g.isOnShelf && g.type === 'linkage').map(g => {
          if (!g.sliderId) {
            return (
              <g key={g.id} transform={`translate(${g.x}, ${g.y})`} onPointerDown={(e) => handlePointerDown(e, g.id)} style={getDragStyle(g.id)}>
                <rect x={-g.length/2 - 20} y="-30" width={g.length + 40} height="60" fill="transparent" />
                <line x1={-g.length/2} y1="0" x2={g.length/2} y2="0" stroke={g.color} strokeWidth="10" strokeLinecap="round" />
                <circle cx={-g.length/2} cy="0" r="5" fill="#2c3e50" />
                <circle cx={g.length/2} cy="0" r="5" fill="#2c3e50" />
              </g>
            );
          } else {
            const slider = sliders.find(s => s.id === g.sliderId);
            const pegIndex = pegs.findIndex(p => p.id === slider.pegId);
            const peg = pegs[pegIndex];
            let gearRotation = 0;
            if (isSolved) {
              gearRotation = peg.type === 'input' ? inputRotation : pegRotations[pegIndex];
            } else {
              gearRotation = peg.type === 'input' ? inputRotation : 0;
            }
            const rad = (gearRotation * Math.PI) / 180;
            const px = peg.x + (peg.pinOffset || 0) * Math.cos(rad);
            const py = peg.y + (peg.pinOffset || 0) * Math.sin(rad);
            const sx = px + Math.sqrt(Math.abs(g.length ** 2 - (slider.y - py) ** 2));
            const sy = slider.y;

            return (
              <g key={g.id} onPointerDown={(e) => handlePointerDown(e, g.id)} style={getDragStyle(g.id)}>
                <line x1={px} y1={py} x2={sx} y2={sy} stroke={g.color} strokeWidth="10" strokeLinecap="round" />
                <circle cx={px} cy={py} r="5" fill="#2c3e50" />
                <circle cx={sx} cy={sy} r="5" fill="#2c3e50" />
              </g>
            );
          }
        })}

        {/* Draw items on the shelf (scrollable, clipped) */}
        <g clipPath="url(#shelfClip)">
          {gears.filter(g => g.isOnShelf).map(g => {
            if (g.type === 'linkage') {
              return (
                <g key={g.id} transform={`translate(${g.x}, ${g.y + shelfScrollY})`} onPointerDown={(e) => handlePointerDown(e, g.id)} style={getDragStyle(g.id)}>
                  <rect x={-g.length/2 - 10} y="-20" width={g.length + 20} height="40" fill="transparent" />
                  <line x1={-g.length/2} y1="0" x2={g.length/2} y2="0" stroke={g.color} strokeWidth="10" strokeLinecap="round" />
                  <circle cx={-g.length/2} cy="0" r="5" fill="#2c3e50" />
                  <circle cx={g.length/2} cy="0" r="5" fill="#2c3e50" />
                  <text y="-15" fill="white" fontSize="12" textAnchor="middle">Linkage (L={g.length})</text>
                </g>
              );
            }
            if (g.type === 'belt') {
              return (
                <g key={g.id} transform={`translate(${g.x}, ${g.y + shelfScrollY})`} onPointerDown={(e) => handlePointerDown(e, g.id)} style={getDragStyle(g.id)}>
                  <rect x="-45" y="-15" width="90" height="30" fill="transparent" />
                  <rect x="-40" y="-10" width="80" height="20" fill="none" stroke={g.color} strokeWidth="6" rx="10" />
                  <text y="-20" fill="white" fontSize="12" textAnchor="middle">Standard Belt</text>
                </g>
              );
            }
            if (g.type === 'crossed_belt') {
              return (
                <g key={g.id} transform={`translate(${g.x}, ${g.y + shelfScrollY})`} onPointerDown={(e) => handlePointerDown(e, g.id)} style={getDragStyle(g.id)}>
                  <rect x="-45" y="-15" width="90" height="30" fill="transparent" />
                  <path d="M -40 -10 L 40 10 M -40 10 L 40 -10 M -40 -10 A 10 10 0 0 0 -40 10 M 40 -10 A 10 10 0 0 1 40 10" fill="none" stroke={g.color} strokeWidth="6" />
                  <text y="-20" fill="white" fontSize="12" textAnchor="middle">Crossed Belt</text>
                </g>
              );
            }
            return (
              <Gear 
                key={g.id} 
                {...g} 
                y={g.y + shelfScrollY}
                rotation={g.startRot}
                onPointerDown={(e) => handlePointerDown(e, g.id)} 
                dragStyle={getDragStyle(g.id)}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
