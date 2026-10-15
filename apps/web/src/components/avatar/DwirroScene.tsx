import React, { useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { DwirroAvatar } from './DwirroAvatar';
import { DwirroState, STATE_EXPRESSIONS } from './characterState';

interface DwirroSceneProps {
  state?: DwirroState;
  className?: string;
  onStateChange?: (state: DwirroState) => void;
  interactive?: boolean;
}

/**
 * Checks for reliable WebGL rendering context.
 * Prevents test runner (jsdom) or unsupported devices from crashing.
 */
function isWebGLSupported(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const DwirroScene: React.FC<DwirroSceneProps> = ({
  state = 'idle',
  className = '',
  onStateChange,
  interactive = true,
}) => {
  const [hasWebGL, setHasWebGL] = useState<boolean>(false);
  const [currentState, setCurrentState] = useState<DwirroState>(state);

  useEffect(() => {
    setHasWebGL(isWebGLSupported());
  }, []);

  useEffect(() => {
    setCurrentState(state);
  }, [state]);

  const expression = useMemo(() => {
    return STATE_EXPRESSIONS[currentState] || STATE_EXPRESSIONS.idle;
  }, [currentState]);

  const handleMascotClick = () => {
    if (!interactive) return;
    // Cycle playful reaction
    const next: DwirroState =
      currentState === 'happy' ? 'thinking' : currentState === 'thinking' ? 'surprised' : 'happy';
    setCurrentState(next);
    onStateChange?.(next);
  };

  // State indicator badge colors
  const stateBadgeInfo: Record<DwirroState, { label: string; color: string; dot: string }> = {
    idle: { label: 'Online', color: 'text-slate-400', dot: 'bg-slate-400' },
    listening: { label: 'Listening...', color: 'text-cyan-400', dot: 'bg-cyan-400 animate-ping' },
    thinking: { label: 'Thinking...', color: 'text-indigo-400', dot: 'bg-indigo-400 animate-pulse' },
    speaking: { label: 'Speaking', color: 'text-cyan-300', dot: 'bg-cyan-300 animate-bounce' },
    happy: { label: 'Happy', color: 'text-emerald-400', dot: 'bg-emerald-400' },
    surprised: { label: 'Alert', color: 'text-amber-400', dot: 'bg-amber-400' },
    away: { label: 'Resting', color: 'text-slate-500', dot: 'bg-slate-600' },
  };

  return (
    <div
      data-testid="dwirro-avatar-scene"
      className={`relative flex flex-col items-center justify-center select-none overflow-hidden rounded-2xl bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90 border border-slate-800/60 shadow-xl ${className}`}
      onClick={handleMascotClick}
      title={interactive ? 'Click Dwirro to interact' : undefined}
    >
      {/* Top Ambient Glow / Cyan Spotlight Backdrop */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-48 h-28 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* State Status Badge */}
      <div className="absolute top-3 left-4 z-10 flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800/80 backdrop-blur-md text-[11px] font-medium shadow-sm">
        <span className={`w-2 h-2 rounded-full ${stateBadgeInfo[currentState].dot}`} />
        <span className={stateBadgeInfo[currentState].color}>
          {stateBadgeInfo[currentState].label}
        </span>
      </div>

      {/* Interactive Quick State Selector Pill */}
      {interactive && (
        <div
          className="absolute top-3 right-4 z-10 flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity bg-slate-900/90 p-1 rounded-xl border border-slate-800 backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
        >
          {(['idle', 'listening', 'thinking', 'speaking', 'happy'] as DwirroState[]).map((s) => (
            <button
              key={s}
              onClick={() => {
                setCurrentState(s);
                onStateChange?.(s);
              }}
              className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-lg transition-colors ${
                currentState === s
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Main 3D Canvas or Graceful 2D Fallback */}
      <div className="w-full h-full min-h-[210px] md:min-h-[250px]">
        {hasWebGL ? (
          <Canvas
            camera={{ position: [0, 0.20, 3.1], fov: 38 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            dpr={[1, 2]}
          >
            {/* Ambient Lighting */}
            <ambientLight color="#122040" intensity={1.1} />

            {/* Key Lighting from upper left */}
            <directionalLight position={[-1.8, 3.2, 2.5]} color="#E6F4FF" intensity={2.2} />

            {/* Fill Lighting from right */}
            <directionalLight position={[2.2, 1.6, 1.8]} color="#1C3F78" intensity={1.2} />

            {/* Cyan Rim Lighting from behind character to highlight silhouette */}
            <directionalLight position={[0, 2.5, -2.6]} color="#19BFFF" intensity={2.6} />

            {/* Soft dark contact shadow floor */}
            <mesh position={[0, -0.46, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[4, 32]} />
              <meshBasicMaterial color="#050B16" opacity={0.75} transparent />
            </mesh>

            {/* 3D Dwirro Character */}
            <DwirroAvatar expression={expression} />
          </Canvas>
        ) : (
          /* Graceful Fallback (in test runners or environments without WebGL) */
          <div
            data-testid="dwirro-avatar-fallback"
            className="w-full h-full flex flex-col items-center justify-center p-4"
          >
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Fallback Mascot Silhouette */}
              <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(25,191,255,0.3)]">
                {/* Slanted Visor Top */}
                <path
                  d="M 18,22 Q 28,14 48,18 Q 72,24 84,32 L 80,38 Q 60,30 38,26 Q 24,24 18,28 Z"
                  fill="#1C3F78"
                />
                {/* Visor Cyan Under-Glow */}
                <path d="M 22,27 Q 45,22 80,36" stroke="#19BFFF" strokeWidth="2.5" fill="none" />

                {/* Left Side Pod with Cyan Ring */}
                <rect x="6" y="36" width="12" height="28" rx="6" fill="#10254B" />
                <rect x="15" y="38" width="3" height="24" rx="1.5" fill="#19BFFF" />

                {/* Right Side Pod with Cyan Ring */}
                <rect x="82" y="36" width="12" height="28" rx="6" fill="#10254B" />
                <rect x="82" y="38" width="3" height="24" rx="1.5" fill="#19BFFF" />

                {/* Main Body with Arch & Legs */}
                <path
                  d="M 22,30 L 78,30 Q 80,50 80,82 L 62,82 Q 60,60 50,60 Q 40,60 38,82 L 20,82 Q 20,50 22,30 Z"
                  fill="#10254B"
                />

                {/* Luminous Square Eyes */}
                <rect
                  x="33"
                  y="44"
                  width="11"
                  height={currentState === 'happy' ? '6' : '11'}
                  rx="2"
                  fill="#FFFFFF"
                  className={currentState === 'thinking' ? 'animate-pulse' : ''}
                />
                <rect
                  x="56"
                  y="44"
                  width="11"
                  height={currentState === 'happy' ? '6' : '11'}
                  rx="2"
                  fill="#FFFFFF"
                  className={currentState === 'thinking' ? 'animate-pulse' : ''}
                />

                {/* Subtle D monogram */}
                <path
                  d="M 72,66 L 72,74 Q 76,74 76,70 Q 76,66 72,66 Z"
                  fill="none"
                  stroke="#1C3F78"
                  strokeWidth="1.2"
                />
              </svg>
            </div>
            <span className="text-xs text-slate-400 mt-2 font-medium">Dwirro 3D Assistant</span>
          </div>
        )}
      </div>

      {/* Bottom Subtitle / Interaction Hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-mono tracking-wider uppercase pointer-events-none">
        {currentState === 'listening'
          ? 'Listening to your voice...'
          : currentState === 'thinking'
            ? 'Processing context...'
            : currentState === 'speaking'
              ? 'Synthesizing response...'
              : 'Dwirro v1.0 • 3D Agent'}
      </div>
    </div>
  );
};
