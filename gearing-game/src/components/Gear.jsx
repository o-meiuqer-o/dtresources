import React from 'react';

export function generateGearPath(cx, cy, teeth, radius, addendum, dedendum) {
  const points = [];
  const angleStep = (Math.PI * 2) / teeth;
  
  for (let i = 0; i < teeth; i++) {
    const angle = i * angleStep;
    const nextAngle = (i + 1) * angleStep;
    
    const rOuter = radius + addendum;
    const rInner = radius - dedendum;
    
    const a1 = angle;
    const a2 = angle + angleStep * 0.2;
    const a3 = angle + angleStep * 0.4;
    const a4 = angle + angleStep * 0.6;
    const a5 = angle + angleStep * 0.8;
    const a6 = nextAngle;
    
    // Bottom root
    points.push(`${cx + Math.cos(a1) * rInner},${cy + Math.sin(a1) * rInner}`);
    points.push(`${cx + Math.cos(a2) * rInner},${cy + Math.sin(a2) * rInner}`);
    // Tip
    points.push(`${cx + Math.cos(a3) * rOuter},${cy + Math.sin(a3) * rOuter}`);
    points.push(`${cx + Math.cos(a4) * rOuter},${cy + Math.sin(a4) * rOuter}`);
    // Bottom root
    points.push(`${cx + Math.cos(a5) * rInner},${cy + Math.sin(a5) * rInner}`);
    points.push(`${cx + Math.cos(a6) * rInner},${cy + Math.sin(a6) * rInner}`);
  }
  
  return `M ${points.join(' L ')} Z`;
}

export default function Gear({ x, y, teeth, radius, color, rotation, isOnShelf, onPointerDown, type, pinOffset, id, style }) {
  if (type === 'cam') {
    return (
      <g transform={`translate(${x}, ${y})`} onPointerDown={onPointerDown} style={{ cursor: isOnShelf ? 'grab' : 'pointer' }}>
        <circle r="60" fill="transparent" />
        <g transform={`rotate(${rotation})`}>
          <path d="M -30 0 A 30 30 0 1 0 30 0 C 30 -30, 15 -60, 0 -60 C -15 -60, -30 -30, -30 0" fill={color} stroke="#2c3e50" strokeWidth="4" />
          <circle r="6" fill="#ecf0f1" />
          <line x1="0" y1="0" x2="0" y2="-50" stroke="#ecf0f1" strokeWidth="2" strokeDasharray="4,4" />
        </g>
      </g>
    );
  }

  const innerRadius = radius - 10;
  const path = generateGearPath(x, y, teeth || 12, radius || 50, 10, 10);
  
  return (
    <g 
      transform={`rotate(${rotation || 0}, ${x}, ${y})`} 
      id={id}
      onPointerDown={onPointerDown}
      style={{ cursor: 'grab', ...style }}
    >
      <circle cx={x} cy={y} r={Math.max((radius || 50) + 20, 50)} fill="transparent" />
      <path d={path} fill={color} stroke="#333" strokeWidth="2" />
      <circle cx={x} cy={y} r={radius * 0.2} fill="#222" />
      <circle cx={x} cy={y} r={radius * 0.1} fill="#fff" />
      {pinOffset && (
        <circle cx={x + pinOffset} cy={y} r={radius * 0.15} fill="#f1c40f" stroke="#d35400" strokeWidth="2" />
      )}
    </g>
  );
}
