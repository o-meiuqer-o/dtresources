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

export default function Gear({ x, y, teeth = 12, radius = 50, rotation = 0, color = "#555", id, onPointerDown, style }) {
  const path = generateGearPath(x, y, teeth, radius, 10, 10);
  
  return (
    <g 
      transform={`rotate(${rotation}, ${x}, ${y})`} 
      id={id}
      onPointerDown={onPointerDown}
      style={{ cursor: 'grab', ...style }}
    >
      <path d={path} fill={color} stroke="#333" strokeWidth="2" />
      <circle cx={x} cy={y} r={radius * 0.2} fill="#222" />
      <circle cx={x} cy={y} r={radius * 0.1} fill="#fff" />
    </g>
  );
}
