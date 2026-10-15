import React from 'react';

export interface StageViewportProps {
  modelUrl?: string;
  isSpeaking?: boolean;
}

export const StageViewport: React.FC<StageViewportProps> = ({ modelUrl, isSpeaking }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="text-center p-6">
        <div className={`w-24 h-24 mx-auto rounded-full bg-cyan-500/20 border-2 ${isSpeaking ? 'border-cyan-400 animate-pulse' : 'border-slate-700'} flex items-center justify-center text-cyan-300 font-bold mb-3`}>
          VRM
        </div>
        <p className="text-xs text-slate-400 font-mono">Dwirro 3D Stage Active</p>
      </div>
    </div>
  );
};

export default StageViewport;
