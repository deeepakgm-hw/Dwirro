import React from 'react';

export const OnboardingFlow: React.FC = () => {
  return (
    <div className="p-8 max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-xl text-center">
      <h2 className="text-2xl font-bold text-slate-100 mb-3">Welcome to Dwirro</h2>
      <p className="text-slate-400 text-sm mb-6">
        Your sovereign autonomous companion. Let's calibrate your voice preferences and permissions.
      </p>
    </div>
  );
};

export default OnboardingFlow;
