import React, { useState } from 'react';
import { CredenceLogo } from './CredenceLogo';
import { LegalModalTab } from './FooterLegalModal';
import { 
  ArrowRight, 
  DollarSign, 
  TrendingUp, 
  Scale, 
  Check, 
  ShieldCheck,
  Calendar,
  Lock,
  HelpCircle,
  MessageSquare,
  Mail,
  Zap
} from 'lucide-react';

interface WelcomeScreenProps {
  onDismiss: () => void;
  onSetScore?: (score: number) => void;
  currentScore?: number;
  onSelectProblem?: (tabId: string) => void;
  onOpenLegal?: (tab: LegalModalTab) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onDismiss,
  onSetScore,
  currentScore = 0,
  onSelectProblem,
  onOpenLegal,
}) => {
  const [selectedProblem, setSelectedProblem] = useState<'compare' | 'statement_optimizer' | 'dispute_hub'>('compare');
  const [initialScoreInput, setInitialScoreInput] = useState<string>(
    currentScore > 0 ? currentScore.toString() : '640'
  );

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const handleStartSolving = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(initialScoreInput);
    if (!isNaN(parsed) && parsed >= 300 && parsed <= 850) {
      if (onSetScore) onSetScore(parsed);
    }
    if (onSelectProblem) {
      onSelectProblem(selectedProblem);
    }
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 select-none overflow-y-auto animate-fadeIn">
      {/* 9:16 Cropped Professional Welcome Container */}
      <div className="w-full max-w-[420px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh]">
        
        {/* Top Header with Brand & Skip Button */}
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2">
            <CredenceLogo size={30} animated={false} />
            <div>
              <span className="font-black text-slate-900 dark:text-white text-sm tracking-tight block">
                Credence
              </span>
              <span className="text-[10px] font-mono-numeric font-bold text-emerald-600 dark:text-emerald-400 block -mt-0.5">
                Instant Credit Problem Solver
              </span>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="px-3 py-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all flex items-center gap-1 cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <span>Skip to App</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Scrollable Problem Selection Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          
          {/* Main Title Banner */}
          <div className="text-center space-y-1">
            <span className="text-[10px] font-mono-numeric font-extrabold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider block">
              1-Time Strategic Setup
            </span>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              What Credit Problem Are You Facing?
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Select your primary obstacle to start calculating the solution:
            </p>
          </div>

          {/* 3 Interactive Problem-Solving Cards (Tap to Select) */}
          <div className="space-y-2.5">
            
            {/* Problem 1: High APR Interest */}
            <div
              onClick={() => setSelectedProblem('compare')}
              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                selectedProblem === 'compare'
                  ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  selectedProblem === 'compare'
                    ? 'bg-emerald-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  <DollarSign className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono-numeric font-black uppercase text-emerald-600 dark:text-emerald-400">
                      Problem 1
                    </span>
                    <h3 className="font-black text-slate-900 dark:text-white text-xs">
                      I Pay Too Much Card Interest
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono-numeric font-extrabold text-emerald-600 dark:text-emerald-400 block">
                    Save $200–$384+/yr dropping 29% APR
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    Real math engine with live balance sliders
                  </span>
                </div>
              </div>

              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                selectedProblem === 'compare'
                  ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                  : 'border-slate-300 dark:border-slate-700'
              }`}>
                {selectedProblem === 'compare' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            {/* Problem 2: Score Stuck / High Utilization Trap */}
            <div
              onClick={() => setSelectedProblem('statement_optimizer')}
              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                selectedProblem === 'statement_optimizer'
                  ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  selectedProblem === 'statement_optimizer'
                    ? 'bg-emerald-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  <Calendar className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono-numeric font-black uppercase text-sky-600 dark:text-sky-400">
                      Problem 2
                    </span>
                    <h3 className="font-black text-slate-900 dark:text-white text-xs">
                      My Score Is Stuck Below 750
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono-numeric font-extrabold text-sky-600 dark:text-sky-400 block">
                    AZEO Statement Trick gives +20 to +45 pts
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    Pay before statement closing date, report 1% util
                  </span>
                </div>
              </div>

              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                selectedProblem === 'statement_optimizer'
                  ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                  : 'border-slate-300 dark:border-slate-700'
              }`}>
                {selectedProblem === 'statement_optimizer' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            {/* Problem 3: Collections / Negative Marks */}
            <div
              onClick={() => setSelectedProblem('dispute_hub')}
              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                selectedProblem === 'dispute_hub'
                  ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  selectedProblem === 'dispute_hub'
                    ? 'bg-emerald-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  <Scale className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono-numeric font-black uppercase text-rose-600 dark:text-rose-400">
                      Problem 3
                    </span>
                    <h3 className="font-black text-slate-900 dark:text-white text-xs">
                      I Have Errors or Collections
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono-numeric font-extrabold text-rose-600 dark:text-rose-400 block">
                    FCRA § 609 Statutory 30-Day Deletions
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    Restores +48 pts upon verified account removal
                  </span>
                </div>
              </div>

              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                selectedProblem === 'dispute_hub'
                  ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                  : 'border-slate-300 dark:border-slate-700'
              }`}>
                {selectedProblem === 'dispute_hub' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

          </div>

          {/* Quick Baseline Score Selection */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-numeric font-extrabold uppercase text-slate-500 dark:text-slate-400">
                Current FICO® Score Baseline
              </span>
              <span className="text-xs font-mono-numeric font-black text-slate-900 dark:text-white">
                {initialScoreInput} / 850
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 font-mono-numeric">
              {['580', '640', '700', '750'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setInitialScoreInput(val)}
                  className={`py-1.5 rounded-xl border text-[11px] font-black cursor-pointer transition-all ${
                    initialScoreInput === val
                      ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Launch Action Button: Solves chosen problem immediately */}
          <button
            onClick={handleStartSolving}
            className="w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>START SOLVING MY CREDIT PROBLEM</span>
            <ArrowRight className="w-4 h-4 text-slate-950 stroke-[3]" />
          </button>

        </div>

        {/* AT BOTTOM OF FIRST SCREEN: 3 SMALL ICONS WITH TEXT */}
        <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-around text-[10px] font-mono-numeric font-bold text-slate-500 dark:text-slate-400 shrink-0">
          <span className="flex items-center gap-1">🔒 No SSN Needed</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">🚫 No Bank Login</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">💯 100% Private</span>
        </div>

        {/* Quick Downbase Footer Features Access on Welcome Page */}
        {onOpenLegal && (
          <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[10px] font-mono-numeric text-slate-400 shrink-0">
            <button onClick={() => onOpenLegal('privacy')} className="hover:text-emerald-500 cursor-pointer">Privacy Policy</button>
            <span>·</span>
            <button onClick={() => onOpenLegal('terms')} className="hover:text-emerald-500 cursor-pointer">Terms of use</button>
            <span>·</span>
            <button onClick={() => onOpenLegal('faq')} className="hover:text-emerald-500 cursor-pointer">FAQ</button>
            <span>·</span>
            <button onClick={() => onOpenLegal('feedback')} className="hover:text-emerald-500 cursor-pointer">Feedback</button>
            <span>·</span>
            <button onClick={() => onOpenLegal('contact')} className="hover:text-emerald-500 cursor-pointer">Contact us</button>
            <span>·</span>
            <button onClick={() => onOpenLegal('solutions')} className="hover:text-emerald-500 font-bold text-emerald-600 dark:text-emerald-400 cursor-pointer">solutions</button>
          </div>
        )}

      </div>
    </div>
  );
};
