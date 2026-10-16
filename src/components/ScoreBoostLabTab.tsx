import React, { useState } from 'react';
import {
  Zap,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  CreditCard,
  CheckCircle,
  HelpCircle,
  Info,
  RotateCcw,
  ArrowLeft
} from 'lucide-react';

interface ScoreBoostLabTabProps {
  initialScore?: number;
  initialUtilization?: number;
  onNavigateTab?: (tabId: string) => void;
  onGoBack?: () => void;
  isEmbedded?: boolean;
}

interface SimulatorOutcome {
  id: 'pay200' | 'missPayment' | 'keepUnder30' | 'openNewCard';
  title: string;
  pointsDelta: number;
  pointsText: string;
  isPositive: boolean;
  colorHex: string;
  explanation: string;
  timeline: string;
}

export const ScoreBoostLabTab: React.FC<ScoreBoostLabTabProps> = ({
  initialScore = 680,
  initialUtilization = 34,
  onNavigateTab,
  onGoBack,
  isEmbedded = false
}) => {
  const [currentScore, setCurrentScore] = useState<number>(initialScore);
  const [currentUtilization, setCurrentUtilization] = useState<number>(initialUtilization);
  const [activeSimulation, setActiveSimulation] = useState<SimulatorOutcome | null>(null);

  // Logic for Button A: "What if I pay $200 off balance?"
  // If current utilization > 30%, show "+15 pts possible" in green #00C851, else "+5 pts"
  const handlePay200 = () => {
    const isOver30 = currentUtilization > 30;
    const pts = isOver30 ? 15 : 5;
    setActiveSimulation({
      id: 'pay200',
      title: 'Pay $200 Off Card Balance',
      pointsDelta: pts,
      pointsText: `+${pts} pts possible`,
      isPositive: true,
      colorHex: '#00C851',
      explanation: isOver30
        ? 'Your revolving utilization drops down across credit tiers, unlocking rapid algorithmic point recoveries on credit score models.'
        : 'Even with healthy utilization, reducing aggregate debt shows credit bureaus disciplined month-over-month debt reduction.',
      timeline: 'Visible within 15–30 days upon next bureau statement reporting cycle.'
    });
  };

  // Logic for Button B: "What if I miss a payment?"
  // Show "-80 pts" in red #FF4D4D
  const handleMissPayment = () => {
    setActiveSimulation({
      id: 'missPayment',
      title: 'Miss a Scheduled 30-Day Payment',
      pointsDelta: -80,
      pointsText: '-80 pts',
      isPositive: false,
      colorHex: '#FF4D4D',
      explanation: 'Payment history comprises 35% of your credit score. A single 30+ day late delinquency can inflict devastating immediate drops that take 12–24 months of on-time payments to rehabilitate.',
      timeline: 'Reports immediately to Experian, TransUnion & Equifax upon 30-day delinquency.'
    });
  };

  // Logic for Button C: "What if I keep utilization under 30%?"
  // Show "+25 pts in 30 days"
  const handleKeepUnder30 = () => {
    setActiveSimulation({
      id: 'keepUnder30',
      title: 'Maintain Aggregate Utilization Below 30%',
      pointsDelta: 25,
      pointsText: '+25 pts in 30 days',
      isPositive: true,
      colorHex: '#00C851',
      explanation: 'Amounts owed account for 30% of your credit score. Lowering and keeping balances under the golden 30% (or ideally under 10%) maximizes revolving credit health metrics.',
      timeline: 'Directly calculated as soon as each card issuer reports balance to the bureaus.'
    });
  };

  // Logic for Button D: "What if I open a new card?"
  // Show "-10 pts now, +20 later"
  const handleOpenNewCard = () => {
    setActiveSimulation({
      id: 'openNewCard',
      title: 'Open a New Credit Card Account',
      pointsDelta: 10,
      pointsText: '-10 pts now, +20 later',
      isPositive: true,
      colorHex: '#00C851',
      explanation: 'The new hard inquiry and slightly lower average age of accounts causes an instant temporary dip (-10 pts), but the higher overall credit line immediately dilutes utilization (+20 pts recovery over 3–6 months).',
      timeline: 'Temporary 5–10 pt inquiry drop for 60 days, followed by +20 point net gain.'
    });
  };

  const simulatedProjectedScore = activeSimulation
    ? Math.min(850, Math.max(300, currentScore + activeSimulation.pointsDelta))
    : currentScore;

  return (
    <div className={`w-full ${isEmbedded ? '' : 'min-h-full bg-[#0A1931] text-slate-100 p-3 sm:p-4 pb-24'} select-none`}>
      <div className="w-full max-w-md mx-auto space-y-4">

        {/* Header Bar */}
        {!isEmbedded && (
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              {onGoBack && (
                <button
                  type="button"
                  onClick={onGoBack}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
                  title="Go Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-400">
                <Zap className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-extrabold uppercase tracking-widest text-emerald-400">
                  Feature 3 · Interactive Simulator
                </span>
                <h1 className="text-xl font-black text-white tracking-tight">
                  ScoreBoost Lab
                </h1>
              </div>
            </div>
            {activeSimulation && (
              <button
                onClick={() => setActiveSimulation(null)}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                title="Reset Simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        )}

        {isEmbedded && (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Zap className="w-4 h-4" />
              </span>
              <h3 className="text-base font-black text-white">ScoreBoost Lab - What If Simulator</h3>
            </div>
            {activeSimulation && (
              <button
                onClick={() => setActiveSimulation(null)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        )}

        {/* Current Score Input & Utilization Display */}
        <div className="bg-white text-slate-900 rounded-3xl p-5 shadow-xl border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-mono-numeric font-black uppercase tracking-wider text-slate-400">
                Baseline Financial Profile
              </span>
              <h3 className="text-base font-black text-slate-900">
                Your Current Score
              </h3>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 font-mono-numeric">Score:</span>
              <input
                type="number"
                min="300"
                max="850"
                value={currentScore}
                onChange={(e) => setCurrentScore(Math.min(850, Math.max(300, Number(e.target.value) || 300)))}
                className="w-16 font-mono-numeric text-lg font-black text-slate-900 bg-transparent text-right focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-mono-numeric">
              <span className="text-slate-500">Current Credit Card Utilization:</span>
              <span className={`font-black ${currentUtilization > 30 ? 'text-[#FF4D4D]' : 'text-emerald-600'}`}>
                {currentUtilization}% {currentUtilization > 30 ? '(High)' : '(Optimal)'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="95"
              value={currentUtilization}
              onChange={(e) => setCurrentUtilization(Number(e.target.value))}
              className="w-full accent-[#1E90FF] h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono-numeric">
              <span>0% (Ideal)</span>
              <span className="font-bold text-amber-600">30% Threshold</span>
              <span>100% (Maxed)</span>
            </div>
          </div>
        </div>

        {/* 4 BIG BUTTONS */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono-numeric font-bold uppercase text-slate-400 px-1 block">
            Choose A "What If" Scenario:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* BUTTON A: "What if I pay $200 off balance?" */}
            <button
              onClick={handlePay200}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-sm ${
                activeSimulation?.id === 'pay200'
                  ? 'bg-emerald-500/20 border-emerald-400 text-white ring-2 ring-emerald-400'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 font-mono-numeric">
                  Button A
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-black font-mono-numeric bg-emerald-100 text-emerald-800">
                  {currentUtilization > 30 ? '+15 pts' : '+5 pts'}
                </span>
              </div>
              <h4 className="text-sm font-extrabold leading-snug">
                "What if I pay $200 off balance?"
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                {currentUtilization > 30 ? 'Utilization >30% unlocks max reward' : 'Steady balance paydown'}
              </p>
            </button>

            {/* BUTTON B: "What if I miss a payment?" */}
            <button
              onClick={handleMissPayment}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-sm ${
                activeSimulation?.id === 'missPayment'
                  ? 'bg-rose-500/20 border-[#FF4D4D] text-white ring-2 ring-[#FF4D4D]'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black uppercase text-rose-600 font-mono-numeric">
                  Button B
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-black font-mono-numeric bg-rose-100 text-[#FF4D4D]">
                  -80 pts
                </span>
              </div>
              <h4 className="text-sm font-extrabold leading-snug">
                "What if I miss a payment?"
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Major severe 30-day delinquency shock
              </p>
            </button>

            {/* BUTTON C: "What if I keep utilization under 30%?" */}
            <button
              onClick={handleKeepUnder30}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-sm ${
                activeSimulation?.id === 'keepUnder30'
                  ? 'bg-emerald-500/20 border-emerald-400 text-white ring-2 ring-emerald-400'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 font-mono-numeric">
                  Button C
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-black font-mono-numeric bg-emerald-100 text-emerald-800">
                  +25 pts
                </span>
              </div>
              <h4 className="text-sm font-extrabold leading-snug">
                "What if I keep utilization under 30%?"
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Golden benchmark for fast score climbs
              </p>
            </button>

            {/* BUTTON D: "What if I open a new card?" */}
            <button
              onClick={handleOpenNewCard}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-sm ${
                activeSimulation?.id === 'openNewCard'
                  ? 'bg-sky-500/20 border-sky-400 text-white ring-2 ring-sky-400'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black uppercase text-sky-600 font-mono-numeric">
                  Button D
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-black font-mono-numeric bg-sky-100 text-sky-800">
                  -10 then +20
                </span>
              </div>
              <h4 className="text-sm font-extrabold leading-snug">
                "What if I open a new card?"
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Inquiry dip vs higher available credit
              </p>
            </button>
          </div>
        </div>

        {/* RESULT CARD: Changes color based on good/bad */}
        {activeSimulation && (
          <div
            style={{
              backgroundColor: activeSimulation.isPositive ? '#00C85115' : '#FF4D4D15',
              borderColor: activeSimulation.colorHex,
            }}
            className="rounded-3xl p-5 border-2 shadow-2xl space-y-3 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between">
              <span
                style={{ color: activeSimulation.colorHex }}
                className="text-xs font-mono-numeric font-black uppercase tracking-wider"
              >
                Simulation Result
              </span>
              <span
                style={{
                  backgroundColor: activeSimulation.colorHex,
                  color: '#FFFFFF'
                }}
                className="px-3 py-1 rounded-full text-xs font-black font-mono-numeric shadow-sm"
              >
                {activeSimulation.pointsText}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">
                  {activeSimulation.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {activeSimulation.explanation}
                </p>
              </div>
            </div>

            <div className="p-3 bg-black/30 rounded-2xl border border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-300 font-mono-numeric">
                Projected New Score:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-400 line-through font-mono-numeric">
                  {currentScore}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <span
                  style={{ color: activeSimulation.colorHex }}
                  className="text-xl font-black font-mono-numeric"
                >
                  {simulatedProjectedScore}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-mono-numeric">
              Timeline: {activeSimulation.timeline}
            </div>
          </div>
        )}

        {/* Prompt requirement: Add disclaimer small text: "Estimates for education only" */}
        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-400 font-mono-numeric">
            Estimates for education only
          </p>
        </div>

      </div>
    </div>
  );
};
