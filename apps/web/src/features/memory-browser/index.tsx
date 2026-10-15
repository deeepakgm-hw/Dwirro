import React from 'react';

export const MemoryBrowser: React.FC = () => {
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
      <h2 className="text-lg font-semibold text-slate-100 mb-2">Memory Browser</h2>
      <p className="text-sm text-slate-400">View and manage long-term facts extracted from conversations.</p>
    </div>
  );
};

export default MemoryBrowser;
