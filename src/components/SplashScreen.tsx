import React, { useEffect } from 'react';
import { CredenceLogo } from './CredenceLogo';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  // 5-second duration handled internally in the code ("visible at the backend only")
  useEffect(() => {
    // Backend/developer runtime initialization log
    console.log('[Credence Engine] Initializing sovereign client environment (5000ms boot)...');
    
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className="fixed inset-0 z-50 bg-[#fafafc] flex items-center justify-center select-none cursor-pointer transition-colors overflow-hidden"
      title="Click to enter Credence"
    >
      {/* Subtle soft ambient light background glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Centered Credence logo in motion with VERY CLEAR, BIG, AND BOLD app name */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center transform transition-transform duration-700 space-y-6 px-4">
        {/* Animated Credence Logo */}
        <div className="transform hover:scale-105 transition-transform duration-500">
          <CredenceLogo size={160} animated={true} />
        </div>

        {/* Very Clear, Big, and Bold App Name */}
        <div className="space-y-2">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight font-sans select-none drop-shadow-xs">
            Credence
          </h1>
          <p className="text-xs sm:text-sm font-extrabold tracking-[0.25em] uppercase text-emerald-600 font-mono-numeric">
            Consumer Credit Empowerment
          </p>
        </div>
      </div>
    </div>
  );
};
