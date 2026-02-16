
import React, { useState, useRef, useEffect } from 'react';
import { MetalType, SlotInstance, BuilderTool } from '../types';

interface NecklaceCanvasProps {
  holderId: string;
  metal: MetalType;
  slots: SlotInstance[];
  activeSlotId: string | null;
  onSlotClick: (slotId: string) => void;
  onAddSlot: (angle: number) => void;
  onRemoveSlot: (slotId: string) => void;
  onSwapInitiate: (slotId: string) => void;
  isSwapMode: boolean;
  swapSourceSlotId: string | null;
  isSplitView: boolean;
  activeTool: BuilderTool;
}

const MIN_ANGULAR_DISTANCE = 20; 
const CHAIN_RADIUS = 160;
const PLACEMENT_RADIUS = 192; 
const CENTER_X = 250;
const CENTER_Y = 250;

const EXCLUDE_START = 250;
const EXCLUDE_END = 290;

const NecklaceCanvas: React.FC<NecklaceCanvasProps> = ({
  holderId,
  metal,
  slots,
  activeSlotId,
  onSlotClick,
  onAddSlot,
  onRemoveSlot,
  onSwapInitiate,
  isSwapMode,
  swapSourceSlotId,
  isSplitView,
  activeTool
}) => {
  const metalColor = metal === 'gold-vermeil' ? '#D4AF37' : '#C0C0C0';
  const [showSwapIconSlot, setShowSwapIconSlot] = useState<string | null>(null);
  const [ghostAngle, setGhostAngle] = useState<number | null>(null);
  const [isCollision, setIsCollision] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMouseEnter = (id: string) => {
    // Only show "Swap" if more than one slot and not in tool mode (Desktop only really)
    if (slots.length <= 1 || activeTool !== 'NONE') return;
    
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowSwapIconSlot(id);
    }, 600);
  };

  const handleMouseLeave = () => {
    setShowSwapIconSlot(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const getPositionFromAngle = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: CENTER_X + PLACEMENT_RADIUS * Math.cos(rad),
      y: CENTER_Y + PLACEMENT_RADIUS * Math.sin(rad)
    };
  };

  const getChainPointFromAngle = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: CENTER_X + CHAIN_RADIUS * Math.cos(rad),
      y: CENTER_Y + CHAIN_RADIUS * Math.sin(rad)
    };
  };

  const checkCollision = (angle: number) => {
    return slots.some(s => {
      let diff = Math.abs(s.angle - angle);
      if (diff > 180) diff = 360 - diff;
      return diff < MIN_ANGULAR_DISTANCE;
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!svgRef.current || activeTool !== 'ADD' || isSwapMode) {
      setGhostAngle(null);
      return;
    }
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 500;
    const y = ((e.clientY - rect.top) / rect.height) * 500;
    
    const dx = x - CENTER_X;
    const dy = y - CENTER_Y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Interaction zone
    if (dist > CHAIN_RADIUS - 60 && dist < PLACEMENT_RADIUS + 50) {
      let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      if (angle < 0) angle += 360;
      
      if (angle < EXCLUDE_START || angle > EXCLUDE_END) {
         setGhostAngle(angle);
         setIsCollision(checkCollision(angle));
      } else {
         setGhostAngle(null);
      }
    } else {
      setGhostAngle(null);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (activeTool === 'ADD' && ghostAngle !== null && !isCollision) {
      onAddSlot(ghostAngle);
    }
  };

  const getChainStyle = () => {
    switch (holderId) {
      case 'box-chain': return { strokeDasharray: '4,1', strokeWidth: '4' };
      case 'snake-chain': return { strokeDasharray: 'none', strokeWidth: '5' };
      case 'rope-chain': return { strokeDasharray: '8,2', strokeWidth: '6' };
      case 'bead-ball-chain': return { strokeDasharray: '1,10', strokeLinecap: 'round' as const, strokeWidth: '8' };
      case 'curb-chain': return { strokeDasharray: '10,2', strokeWidth: '7' };
      case 'figaro-chain': return { strokeDasharray: '15,2,4,2,4,2', strokeWidth: '5' };
      default: return { strokeDasharray: '6,4', strokeWidth: '3' };
    }
  };

  const chainStyle = getChainStyle();
  const startRad = (EXCLUDE_END * Math.PI) / 180;
  const endRad = (EXCLUDE_START * Math.PI) / 180;
  const startX = CENTER_X + CHAIN_RADIUS * Math.cos(startRad);
  const startY = CENTER_Y + CHAIN_RADIUS * Math.sin(startRad);
  const endX = CENTER_X + CHAIN_RADIUS * Math.cos(endRad);
  const endY = CENTER_Y + CHAIN_RADIUS * Math.sin(endRad);
  const arcPath = `M ${startX} ${startY} A ${CHAIN_RADIUS} ${CHAIN_RADIUS} 0 1 1 ${endX} ${endY}`;

  return (
    <div 
      className={`relative flex items-center justify-center transition-all duration-700 ease-in-out h-full w-full select-none
        ${isSplitView ? 'md:w-1/2 md:scale-85 md:-translate-x-12' : 'scale-100'}`}
      style={{ touchAction: 'none' }}
    >
      <svg 
        ref={svgRef}
        viewBox="0 0 500 500" 
        className="w-full max-w-[500px] h-auto drop-shadow-2xl overflow-visible"
        style={{ cursor: activeTool === 'ADD' ? 'crosshair' : activeTool === 'REMOVE' ? 'zoom-out' : 'default' }}
        onPointerMove={handlePointerMove}
        onMouseLeave={() => setGhostAngle(null)}
        onClick={handleCanvasClick}
      >
        <defs>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <clipPath id="circleClip">
            <circle cx="24" cy="24" r="24" />
          </clipPath>
        </defs>

        {/* Chain Path */}
        <g filter="url(#softGlow)">
          <path 
            d={arcPath} 
            fill="none" 
            stroke={metalColor} 
            strokeWidth={chainStyle.strokeWidth} 
            strokeDasharray={chainStyle.strokeDasharray}
            strokeLinecap={chainStyle.strokeLinecap}
            className="opacity-70 transition-all duration-500"
          />
        </g>

        {/* Clasp / Connector */}
        <g transform={`translate(${CENTER_X}, ${CENTER_Y - CHAIN_RADIUS})`}>
          <rect x="-8" y="-4" width="16" height="8" rx="2" fill={metalColor} />
        </g>
        
        {/* Ghost Placeholder */}
        {ghostAngle !== null && (
          <g>
            <circle 
              cx={getPositionFromAngle(ghostAngle).x} 
              cy={getPositionFromAngle(ghostAngle).y} 
              r="10" 
              fill={isCollision ? "#EF4444" : "white"} 
              fillOpacity={isCollision ? "0.4" : "0.5"}
              stroke={isCollision ? "#EF4444" : metalColor}
              strokeWidth="2"
              strokeDasharray={isCollision ? "none" : "3,3"}
              className={isCollision ? "" : "animate-pulse"}
            />
          </g>
        )}

        {/* Dynamic Slots */}
        {slots.map((slot) => {
          const charm = slot.charm;
          const isActive = activeSlotId === slot.id;
          const isSource = swapSourceSlotId === slot.id;
          const isHighlight = isSwapMode && !isSource; 
          const isSwapIconVisible = showSwapIconSlot === slot.id;

          const pos = getPositionFromAngle(slot.angle);
          const chainPos = getChainPointFromAngle(slot.angle);
          const placeholderRadius = 10; 
          const charmDisplayRadius = 24;

          return (
            <g 
              key={slot.id} 
              className="cursor-pointer group"
              onMouseEnter={() => handleMouseEnter(slot.id)}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => {
                e.stopPropagation();
                onSlotClick(slot.id);
              }}
            >
              {/* Invisible large hit area for fingers */}
              <circle cx={pos.x} cy={pos.y} r="32" fill="transparent" />

              <line 
                x1={chainPos.x} 
                y1={chainPos.y} 
                x2={pos.x} 
                y2={pos.y} 
                stroke={metalColor} 
                strokeWidth="2" 
                className="opacity-40"
              />

              {charm ? (
                <g className="transition-all duration-300">
                  <circle 
                    cx={pos.x} 
                    cy={pos.y} 
                    r={charmDisplayRadius + 4} 
                    fill="none" 
                    stroke={activeTool === 'REMOVE' ? '#EF4444' : metalColor} 
                    strokeWidth="2" 
                    className="opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                  />
                  <g transform={`translate(${pos.x - charmDisplayRadius}, ${pos.y - charmDisplayRadius})`}>
                    <circle cx="24" cy="24" r="24" fill="white" className="shadow-lg" />
                    <image
                      href={charm.imageUrl}
                      height="48"
                      width="48"
                      clipPath="url(#circleClip)"
                      className={`transition-all ${activeTool === 'REMOVE' ? 'grayscale opacity-60' : (isActive || isSource || isHighlight ? 'opacity-80' : 'opacity-100')}`}
                    />
                  </g>
                  {(isActive || isSource || isHighlight) && (
                    <circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r={charmDisplayRadius + 5} 
                      fill="none" 
                      stroke={isActive ? metalColor : (isSource ? '#3B82F6' : '#60A5FA')} 
                      strokeWidth="2.5" 
                      strokeDasharray="5,2"
                      className={isActive ? "animate-spin-slow" : "animate-pulse"}
                    />
                  )}
                </g>
              ) : (
                <g>
                  <circle 
                    cx={pos.x} 
                    cy={pos.y} 
                    r={placeholderRadius} 
                    fill="white" 
                    stroke={activeTool === 'REMOVE' ? '#EF4444' : (isActive ? metalColor : '#E5E7EB')}
                    strokeWidth="2"
                    className="shadow-md transition-colors"
                  />
                  <g className={`opacity-60 pointer-events-none ${activeTool === 'REMOVE' ? 'text-red-500' : ''}`}>
                    {activeTool === 'REMOVE' ? (
                      <line x1={pos.x-4} y1={pos.y} x2={pos.x+4} y2={pos.y} stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
                    ) : (
                      <>
                        <line x1={pos.x-4} y1={pos.y} x2={pos.x+4} y2={pos.y} stroke={metalColor} strokeWidth="2" strokeLinecap="round" />
                        <line x1={pos.x} y1={pos.y-4} x2={pos.x} y2={pos.y+4} stroke={metalColor} strokeWidth="2" strokeLinecap="round" />
                      </>
                    )}
                  </g>
                </g>
              )}

              {/* Text-based Swap Tooltip */}
              {isSwapIconVisible && activeTool === 'NONE' && slots.length > 1 && (
                <g 
                  className="animate-in fade-in zoom-in duration-300 origin-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSwapInitiate(slot.id);
                  }}
                >
                  <rect 
                    x={pos.x + 20} 
                    y={pos.y - 45} 
                    width="60" 
                    height="24" 
                    rx="12" 
                    fill="black" 
                    className="shadow-2xl" 
                  />
                  <text 
                    x={pos.x + 50} 
                    y={pos.y - 29} 
                    textAnchor="middle" 
                    fill="white" 
                    className="text-[9px] font-bold uppercase tracking-[0.2em]"
                  >
                    Swap
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default NecklaceCanvas;
