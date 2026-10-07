import React, { useState } from 'react';
import { 
  DollarSign, 
  Percent, 
  X,
  CreditCard,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';

interface CardCompareTabProps {
  initialBalance?: number;
  initialApr?: number;
}

interface CardItem {
  id: string;
  name: string;
  bank: string;
  apr: number;
}

// 3 comparison cards in database
const COMPARISON_CARDS: CardItem[] = [
  {
    id: 'card-1',
    name: 'Prime Rate Shield Card',
    bank: 'Federal Credit Union',
    apr: 19.0, // Exactly 19% APR -> Saves $200/yr at $2000 balance & 29% APR
  },
  {
    id: 'card-2',
    name: 'Citi Simplicity® Balance Card',
    bank: 'Citibank',
    apr: 10.79, // Saves $384/yr at $2000 balance & 29.99% APR ($364/yr at 29% APR)
  },
  {
    id: 'card-3',
    name: 'Discover it® Transfer Card',
    bank: 'Discover',
    apr: 14.0, // Saves $300/yr at $2000 balance & 29% APR
  },
];

export const CardCompareTab: React.FC<CardCompareTabProps> = ({
  initialBalance = 2000,
  initialApr = 29.0,
}) => {
  const [balance, setBalance] = useState<number>(initialBalance);
  const [currentApr, setCurrentApr] = useState<number>(initialApr);
  const [selectedCardForMath, setSelectedCardForMath] = useState<CardItem | null>(null);

  // Exact Formulas:
  // Formula: Monthly_Interest_Old = User_Balance * (User_Current_APR/100/12)
  // Formula: Monthly_Interest_New = User_Balance * (Card_APR/100/12)
  // Formula: Monthly_Saving = Monthly_Interest_Old - Monthly_Interest_New
  // Formula: Yearly_Saving = Monthly_Saving * 12
  const calculateSavings = (cardApr: number) => {
    const monthlyOld = balance * (currentApr / 100 / 12);
    const monthlyNew = balance * (cardApr / 100 / 12);
    const monthlySaving = monthlyOld - monthlyNew;
    const yearlySaving = Math.round(monthlySaving * 12);
    return {
      monthlyOld,
      monthlyNew,
      monthlySaving,
      yearlySaving: Math.max(0, yearlySaving),
    };
  };

  return (
    <div className="space-y-4 w-full max-w-full overflow-x-hidden">
      {/* Top Interactive Controls Panel: Live APR input & Live Balance Slider */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-4">
        
        {/* Input 1: User_Current_APR */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1 font-mono-numeric">
              <Percent className="w-3.5 h-3.5 text-rose-500" />
              <span>Current Card APR</span>
            </label>
            <span className="font-mono-numeric font-black text-rose-600 dark:text-rose-400 text-lg">
              {currentApr}%
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <input
              type="number"
              step="0.01"
              min="1"
              max="50"
              value={currentApr}
              onChange={(e) => setCurrentApr(parseFloat(e.target.value) || 0)}
              className="w-24 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-900 dark:text-white font-mono-numeric font-black text-center focus:outline-hidden focus:ring-1 focus:ring-emerald-500 text-xs"
            />
            <div className="flex gap-1 flex-1">
              {[24.99, 29.0, 29.99, 32.99].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setCurrentApr(rate)}
                  className={`px-1.5 py-1.5 rounded-lg border text-[10px] font-mono-numeric font-bold transition-all cursor-pointer flex-1 ${
                    currentApr === rate
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input 2: User_Balance Slider ($500 to $10,000, default $2000) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1 font-mono-numeric">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              <span>Debt Balance</span>
            </label>
            <span className="font-mono-numeric font-black text-slate-900 dark:text-white text-xl">
              ${balance.toLocaleString()}
            </span>
          </div>

          <input
            type="range"
            min="500"
            max="10000"
            step="100"
            value={balance}
            onChange={(e) => setBalance(parseInt(e.target.value))}
            className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />

          <div className="flex justify-between text-[10px] font-mono-numeric text-slate-400">
            <span>$500</span>
            <span>$2.5k</span>
            <span>$5k</span>
            <span>$7.5k</span>
            <span>$10k</span>
          </div>
        </div>

      </div>

      {/* 3 Cards Stacked Vertically in 9:16 Stagnant Layout: Real Math Engine */}
      <div className="space-y-3">
        {COMPARISON_CARDS.map((card) => {
          const { yearlySaving, monthlySaving } = calculateSavings(card.apr);

          return (
            <div
              key={card.id}
              className="bg-white dark:bg-slate-900 border-2 border-emerald-500/70 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3 hover:border-emerald-500 transition-all"
            >
              {/* TOP: Card name in bold */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-sm">
                    {card.name}
                  </h3>
                  <span className="text-[10px] font-semibold text-slate-400 font-mono-numeric">
                    {card.bank} · APR {card.apr}%
                  </span>
                </div>
                <CreditCard className="w-4 h-4 text-emerald-500 shrink-0" />
              </div>

              {/* MIDDLE: BIG GREEN NUMBER */}
              <div className="text-center py-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-500/30">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block font-mono-numeric">
                  Annual Interest Reduction
                </span>
                <span className="text-3xl sm:text-4xl font-black text-emerald-500 font-mono-numeric tracking-tight block mt-0.5">
                  Save ${yearlySaving}/year
                </span>
                <span className="text-[11px] font-mono-numeric font-bold text-slate-600 dark:text-slate-400 block mt-0.5">
                  ${monthlySaving.toFixed(2)}/month saved
                </span>
              </div>

              {/* BOTTOM: Progress bar Old APR (red) 29% ---------> New APR (green) 19% */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono-numeric font-bold">
                  <span className="text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded-md border border-rose-200 dark:border-rose-900">
                    Old APR (red) {currentApr}%
                  </span>
                  <span className="text-slate-400 font-bold tracking-widest">
                    ---------&gt;
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900">
                    New APR (green) {card.apr}%
                  </span>
                </div>

                {/* Visual Dual Progress Track */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden flex border border-slate-200 dark:border-slate-700">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-200"
                    style={{ width: `${Math.min(100, (card.apr / (currentApr || 1)) * 100)}%` }}
                    title={`New APR: ${card.apr}%`}
                  />
                  <div
                    className="bg-rose-500 h-full transition-all duration-200 flex items-center justify-center text-[8px] text-white font-mono font-bold"
                    style={{ width: `${Math.max(0, 100 - (card.apr / (currentApr || 1)) * 100)}%` }}
                    title={`Interest Drop: ${(currentApr - card.apr).toFixed(1)}%`}
                  >
                    -{(currentApr - card.apr).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* BUTTON: Green "See How I Calculated This" */}
              <button
                onClick={() => setSelectedCardForMath(card)}
                className="w-full py-2.5 px-3 rounded-xl font-black text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <DollarSign className="w-4 h-4 text-slate-950 stroke-[3]" />
                <span>See How I Calculated This</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Real Math Breakdown Modal: Pure Math Formulas, Zero AI, Zero Text Paragraphs */}
      {selectedCardForMath && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Math Calculation Steps
                </h4>
              </div>
              <button
                onClick={() => setSelectedCardForMath(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step-by-Step Math Engine Output */}
            {(() => {
              const { monthlyOld, monthlyNew, monthlySaving, yearlySaving } = calculateSavings(selectedCardForMath.apr);
              return (
                <div className="space-y-2.5 font-mono-numeric text-xs">
                  
                  {/* Step 1 */}
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-0.5">
                    <span className="text-slate-400 text-[9px] uppercase font-bold block">
                      Formula: Monthly_Interest_Old = User_Balance * (User_Current_APR/100/12)
                    </span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold block text-xs">
                      ${balance} × ({currentApr}% / 12) = ${monthlyOld.toFixed(2)}/mo
                    </span>
                  </div>

                  {/* Step 2 */}
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-0.5">
                    <span className="text-slate-400 text-[9px] uppercase font-bold block">
                      Formula: Monthly_Interest_New = User_Balance * (Card_APR/100/12)
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold block text-xs">
                      ${balance} × ({selectedCardForMath.apr}% / 12) = ${monthlyNew.toFixed(2)}/mo
                    </span>
                  </div>

                  {/* Step 3 */}
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-0.5">
                    <span className="text-slate-400 text-[9px] uppercase font-bold block">
                      Formula: Monthly_Saving = Monthly_Interest_Old - Monthly_Interest_New
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold block text-xs">
                      ${monthlyOld.toFixed(2)} − ${monthlyNew.toFixed(2)} = ${monthlySaving.toFixed(2)}/mo
                    </span>
                  </div>

                  {/* Step 4: Final Result */}
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500 rounded-xl text-center space-y-0.5">
                    <span className="text-emerald-700 dark:text-emerald-400 text-[10px] uppercase font-bold block">
                      Formula: Yearly_Saving = Monthly_Saving * 12
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-500 block">
                      ${monthlySaving.toFixed(2)} × 12 = ${yearlySaving}/year
                    </span>
                  </div>

                </div>
              );
            })()}

            <button
              onClick={() => setSelectedCardForMath(null)}
              className="w-full py-2 rounded-xl font-bold text-xs bg-slate-900 dark:bg-slate-800 text-white cursor-pointer hover:bg-slate-850"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
