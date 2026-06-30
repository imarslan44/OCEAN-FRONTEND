import React from 'react';

// OCEAN labels
const TRAITS = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'];

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

export default function CompareRadarChart({ inviterScores, inviteeScores, inviterName, inviteeName }) {
  const size = 300;
  const center = size / 2;
  const radius = (size / 2) - 40; // leave room for labels
  const numTraits = 5;

  const getPoints = (scoresObj) => {
    // scores is an object {O, C, E, A, N} between 0 and 100
    const values = [scoresObj.O, scoresObj.C, scoresObj.E, scoresObj.A, scoresObj.N];
    return values.map((val, i) => {
      // default to 0 if val is undefined
      const r = ((val || 0) / 100) * radius;
      const angle = (i * 360) / numTraits;
      return polarToCartesian(center, center, r, angle);
    });
  };

  const inviterPoints = getPoints(inviterScores);
  const inviteePoints = getPoints(inviteeScores);

  const inviterPath = inviterPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  const inviteePath = inviteePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  // Draw concentric web lines
  const levels = 5;
  const webLines = [];
  for (let l = 1; l <= levels; l++) {
    const r = (radius / levels) * l;
    const pts = [];
    for (let i = 0; i < numTraits; i++) {
      const angle = (i * 360) / numTraits;
      pts.push(polarToCartesian(center, center, r, angle));
    }
    const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
    webLines.push(path);
  }

  // Draw axis lines
  const axes = [];
  for (let i = 0; i < numTraits; i++) {
    const angle = (i * 360) / numTraits;
    axes.push(polarToCartesian(center, center, radius, angle));
  }

  return (
    <div className="relative w-full max-w-[350px] mx-auto aspect-square flex flex-col items-center">
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background Web */}
        <g stroke="currentColor" strokeOpacity="0.1" fill="none" strokeWidth="1">
          {webLines.map((path, i) => <path key={i} d={path} />)}
        </g>
        
        {/* Axis Lines */}
        <g stroke="currentColor" strokeOpacity="0.15" strokeWidth="1">
          {axes.map((p, i) => (
            <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} />
          ))}
        </g>

        {/* Labels */}
        <g fill="currentColor" className="text-[10px] font-bold uppercase tracking-wider opacity-70" textAnchor="middle" dominantBaseline="middle">
          {axes.map((p, i) => {
            const angle = (i * 360) / numTraits;
            const labelRadius = radius + 20;
            const lp = polarToCartesian(center, center, labelRadius, angle);
            return (
              <text key={i} x={lp.x} y={lp.y}>{TRAITS[i]}</text>
            );
          })}
        </g>

        {/* Inviter Polygon */}
        <path d={inviterPath} fill="currentColor" className="text-primary opacity-30" />
        <path d={inviterPath} fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" />
        
        {/* Invitee Polygon */}
        <path d={inviteePath} fill="currentColor" className="text-secondary opacity-30" />
        <path d={inviteePath} fill="none" stroke="currentColor" className="text-secondary" strokeWidth="2" strokeDasharray="4 4" />

        {/* Dots */}
        {inviterPoints.map((p, i) => (
          <circle key={`inv1-${i}`} cx={p.x} cy={p.y} r="3" fill="currentColor" className="text-primary" />
        ))}
        {inviteePoints.map((p, i) => (
          <circle key={`inv2-${i}`} cx={p.x} cy={p.y} r="3" fill="currentColor" className="text-secondary" />
        ))}
      </svg>
      
      {/* Legend */}
      <div className="flex gap-6 mt-4 font-label-sm text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary opacity-80"></div>
          <span className="font-bold">{inviterName}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-secondary opacity-80"></div>
          <span className="font-bold">{inviteeName}</span>
        </div>
      </div>
    </div>
  );
}
