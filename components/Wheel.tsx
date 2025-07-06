
import React from 'react';

interface WheelProps {
  items: string[];
  rotation: number;
  isSpinning: boolean;
  onSpinClick: () => void;
}

const COLORS = [
  "#4e79a7", "#f28e2c", "#e15759", "#76b7b2", "#59a14f", 
  "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ab"
];

const Wheel: React.FC<WheelProps> = ({ items, rotation, isSpinning, onSpinClick }) => {
  const numItems = items.length;
  const arc = 360 / numItems;
  const radius = 200;
  const center = 250;

  const getCoordinatesForPercent = (percent: number) => {
    const x = center + radius * Math.cos(2 * Math.PI * percent);
    const y = center + radius * Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const sectors = items.map((item, index) => {
    const angle = arc * index;
    const startPercent = angle / 360;
    const endPercent = (angle + arc) / 360;
    
    const [startX, startY] = getCoordinatesForPercent(startPercent);
    const [endX, endY] = getCoordinatesForPercent(endPercent);

    const largeArcFlag = arc > 180 ? 1 : 0;

    const pathData = [
      `M ${center},${center}`,
      `L ${startX},${startY}`,
      `A ${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY}`,
      "Z"
    ].join(" ");

    const textAngle = angle + arc / 2;
    const textRotation = textAngle;
    const textRadius = radius * 0.65;
    const textX = center + textRadius * Math.cos(textAngle * Math.PI / 180);
    const textY = center + textRadius * Math.sin(textAngle * Math.PI / 180);

    return {
      path: pathData,
      color: COLORS[index % COLORS.length],
      label: item,
      textTransform: `rotate(${textRotation}, ${textX}, ${textY})`,
      textX,
      textY,
    };
  });

  const canSpin = items.length >= 2;

  return (
    <div className="relative flex items-center justify-center w-[90vw] aspect-square landscape:w-auto landscape:h-[80vh] max-w-[500px] max-h-[500px]">
      <div 
        className="absolute w-full h-full rounded-full shadow-2xl"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
        }}
      >
        <svg viewBox="0 0 500 500" transform="rotate(-90)" className="w-full h-full">
          <g>
            {sectors.map((sector, index) => (
              <g key={index}>
                <path d={sector.path} fill={sector.color} stroke="#fff" strokeWidth="2" />
                <text
                  x={sector.textX}
                  y={sector.textY}
                  transform={sector.textTransform}
                  fill="#ffffff"
                  fontSize="16"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ pointerEvents: 'none' }}
                >
                  {sector.label.length > 12 ? `${sector.label.slice(0, 10)}...` : sector.label}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Pointer */}
      <div className="absolute right-[-4%] top-1/2 -translate-y-1/2 z-10" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.5))' }}>
         <div className="w-0 h-0 border-t-[2.5vmin] border-t-transparent border-b-[2.5vmin] border-b-transparent border-l-[4vmin] border-l-red-600 md:border-t-[20px] md:border-b-[20px] md:border-l-[30px]"></div>
      </div>
      
      {/* Spin Button */}
      <button
        onClick={onSpinClick}
        disabled={isSpinning || !canSpin}
        className="absolute w-1/4 h-1/4 rounded-full bg-white border-[1.5vmin] md:border-8 border-gray-300 flex items-center justify-center text-center text-[3.5vmin] md:text-2xl font-bold text-gray-800 z-10 cursor-pointer transition-transform transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:scale-100"
      >
        {canSpin ? (isSpinning ? "..." : "SPIN") : "Add Items"}
      </button>
    </div>
  );
};

export default Wheel;
