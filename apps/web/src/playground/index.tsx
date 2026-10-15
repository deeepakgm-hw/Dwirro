import React from 'react';
import { StageViewport } from '../features/stage';

export const Playground: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-xl font-bold text-slate-100">Character & Stage Playground</h1>
      <div className="h-96">
        <StageViewport />
      </div>
    </div>
  );
};

export default Playground;
