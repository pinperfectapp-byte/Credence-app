import React, { useEffect, useState, useRef } from 'react';
import { ChidoniqLogo } from './ChidoniqLogo';
import { ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(5);
  const onCompleteRef = useRef(onComplete);

  // Keep ref up to date without triggering re-effects
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Reliable 5-second countdown & transition timer
  useEffect(() => {
    // 1-second interval ticker for countdown
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Exact 5000ms transition timeout
    const timeout = setTimeout(() => {
      onCompleteRef.current();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []); // Run once on mount

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCompleteRef.current();
  };

  return (
    <div
      onClick={() => onCompleteRef.current()}
      className="fixed inset-0 z-50 bg-[#FFFFFF] flex flex-col items-center justify-between p-6 select-none cursor-pointer transition-opacity duration-500 overflow-hidden font-sans"
      title="Click anywhere to enter CHIDONIQ"
    >
      {/* Top Bar with Skip Button */}
      <div className="w-full max-w-md flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono-numeric font-bold uppercase tracking-wider text-slate-500">
            CHIDONIQ OS 1.0
          </span>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
        >
          <span>Skip</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Stage: Exact Match to Uploaded Image */}
      <div className="flex flex-col items-center justify-center my-auto space-y-6 text-center transform transition-all duration-700">
        {/* The App Logo Squircle */}
        <div className="relative group">
          <div className="absolute -inset-4 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-700" />
          <ChidoniqLogo size={190} animated={true} />
        </div>

        {/* The Brand Name: CHIDONIQ (Replaces Credence exactly as requested) */}
        <div className="space-y-1">
          <h1
            className="text-4xl sm:text-5xl font-black text-[#0B132B] tracking-tight font-sans uppercase drop-shadow-xs"
            style={{ letterSpacing: '0.04em' }}
          >
            CHIDONIQ
          </h1>
          <p className="text-xs sm:text-sm font-bold text-emerald-600 tracking-[0.2em] uppercase font-mono-numeric pt-1">
            Sovereign Credit & Financial Engine
          </p>
        </div>
      </div>

      {/* Bottom Area: 5-Second Progress Meter & Guidance */}
      <div className="w-full max-w-xs flex flex-col items-center space-y-3 pb-6">
        {/* Animated 5-Second Linear Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-[#2563EB] rounded-full"
            style={{
              animation: 'splashProgress 5000ms linear forwards',
            }}
          />
        </div>

        <div className="flex items-center justify-between w-full text-[11px] font-mono-numeric text-slate-400 font-semibold px-1">
          <span>Loading client environment</span>
          <span className="text-slate-600 font-bold">{secondsRemaining}s</span>
        </div>
      </div>

      {/* CSS Keyframe for the 5-Second Progress Bar */}
      <style>{`
        @keyframes splashProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
