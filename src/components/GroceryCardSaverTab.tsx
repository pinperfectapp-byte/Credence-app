import React, { useState, useMemo } from 'react';
import { GROCERY_CARDS_SHEET, GroceryCardRow } from '../data/groceryCardsSheet';
import { 
  DollarSign, 
  ArrowRight, 
  ArrowLeft, 
  Share2, 
  ExternalLink, 
  Check, 
  ShoppingCart,
  Store,
  CreditCard,
  Table,
  HelpCircle
} from 'lucide-react';

interface GroceryCardSaverTabProps {
  onBackToDashboard?: () => void;
}

export type GroceryStore = 
  | 'Kroger' 
  | 'Aldi' 
  | 'Whole Foods' 
  | 'Walmart' 
  | 'Costco' 
  | 'Other Supermarket';

export const GroceryCardSaverTab: React.FC<GroceryCardSaverTabProps> = ({
  onBackToDashboard,
}) => {
  // Screen state: 1 = INPUT, 2 = RESULT, 3 = DETAIL
  const [currentScreen, setCurrentScreen] = useState<1 | 2 | 3>(1);

  // SCREEN 1 INPUT STATE
  // Big number input: Default $400, min $50 max $2000
  const [monthlySpend, setMonthlySpend] = useState<number>(400);
  const [selectedStore, setSelectedStore] = useState<GroceryStore>('Kroger');

  // SCREEN 3 DETAIL STATE
  const [selectedCardId, setSelectedCardId] = useState<string>('card-1');
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);
  const [showSheetModal, setShowSheetModal] = useState<boolean>(false);

  // PURE MATH ENGINE (PURE ARITHMETIC, ZERO EXTERNAL APIS, 100% OFFLINE)
  // For each card in sheet, calculate:
  // Monthly_Saving = Monthly_Spend * (Cashback_Percent / 100)
  // Yearly_Saving = Monthly_Saving * 12
  // Net_Saving = Yearly_Saving - Annual_Fee
  // Sort all cards by Net_Saving DESC (highest first)
  const calculatedCards = useMemo(() => {
    return GROCERY_CARDS_SHEET.map((card) => {
      const monthlySaving = monthlySpend * (card.Cashback_Percent / 100);
      const yearlySaving = monthlySaving * 12;
      const netSaving = Math.round(yearlySaving - card.Annual_Fee);

      return {
        ...card,
        monthlySaving,
        yearlySaving,
        netSaving,
      };
    }).sort((a, b) => b.netSaving - a.netSaving);
  }, [monthlySpend]);

  const topCard = calculatedCards[0];
  const top5Cards = calculatedCards.slice(0, 5);
  const debitCard = calculatedCards.find((c) => c.Card_Name.includes('Debit')) || {
    netSaving: 0,
  };
  const debitLoss = Math.max(0, topCard.netSaving - debitCard.netSaving);

  const selectedCard = calculatedCards.find((c) => c.id === selectedCardId) || topCard;

  const handleSelectCardForDetail = (cardId: string) => {
    setSelectedCardId(cardId);
    setCurrentScreen(3);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleShare = async () => {
    const shareText = `I can save $${selectedCard.netSaving} on groceries with CartWise`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Grocery Card Saver',
          text: shareText,
          url: window.location.href,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2500);
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-4 font-sans select-none pb-6">
      
      {/* Top Header Navigation & Sheet Database Inspector */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          {currentScreen > 1 ? (
            <button
              onClick={() => setCurrentScreen(currentScreen === 3 ? 2 : 1)}
              className="p-1 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white cursor-pointer"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : onBackToDashboard ? (
            <button
              onClick={onBackToDashboard}
              className="p-1 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white cursor-pointer"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : null}
          <div>
            <h2 className="text-base font-black text-slate-950 dark:text-white tracking-tight flex items-center gap-1.5">
              <ShoppingCart className="w-4 h-4 text-[#00C853]" />
              <span>Grocery Card Saver</span>
            </h2>
            <span className="text-[10px] font-mono-numeric font-bold text-slate-400 block -mt-0.5">
              Pure Math Calculator · 100% Offline
            </span>
          </div>
        </div>

        {/* View Database Button */}
        <button
          onClick={() => setShowSheetModal(true)}
          className="px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-mono-numeric"
          title="Inspect Google Sheet: Cards"
        >
          <Table className="w-3.5 h-3.5 text-[#00C853]" />
          <span>Sheet (12 Cards)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SCREEN 1 - INPUT */}
      {/* ========================================================================= */}
      {currentScreen === 1 && (
        <div className="space-y-5 animate-fadeIn">
          {/* Main Title */}
          <div className="text-center space-y-1 pt-1">
            <span className="text-[11px] font-black uppercase text-[#00C853] tracking-wider block font-mono-numeric">
              Step 1 of 3 · Grocery Spend
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight">
              How much do you spend on groceries?
            </h1>
          </div>

          {/* Big Number Input Box */}
          <div className="bg-white dark:bg-slate-900 border-2 border-[#00C853] rounded-3xl p-5 text-center shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block font-mono-numeric">
              Monthly Grocery Budget
            </span>

            <div className="flex items-center justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white font-mono-numeric">
                $
              </span>
              <input
                type="number"
                min="50"
                max="2000"
                step="25"
                value={monthlySpend}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) {
                    setMonthlySpend(Math.min(2000, Math.max(0, val)));
                  }
                }}
                className="w-36 text-center text-4xl sm:text-5xl font-black text-slate-950 dark:text-white font-mono-numeric bg-transparent border-b-2 border-slate-300 dark:border-slate-700 focus:border-[#00C853] focus:outline-hidden"
              />
              <span className="text-xs font-bold text-slate-400 self-end mb-2 font-mono-numeric">
                /mo
              </span>
            </div>

            {/* Slider under it: min $50 max $2000, default $400 */}
            <div className="space-y-1 pt-2">
              <input
                type="range"
                min="50"
                max="2000"
                step="25"
                value={monthlySpend}
                onChange={(e) => setMonthlySpend(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#00C853]"
              />
              <div className="flex justify-between text-[10px] font-mono-numeric font-bold text-slate-400">
                <span>$50</span>
                <span>$500</span>
                <span>$1,000</span>
                <span>$1,500</span>
                <span>$2,000</span>
              </div>
            </div>

            {/* Quick Presets for Fast Tap on Low-End Phones */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[200, 400, 600, 800].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setMonthlySpend(preset)}
                  className={`py-1.5 rounded-xl text-xs font-black font-mono-numeric transition-all cursor-pointer border ${
                    monthlySpend === preset
                      ? 'bg-[#00C853] text-black border-[#00C853] shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>
          </div>

          {/* Second question: "Where do you shop?" */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2.5">
            <label className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5 font-mono-numeric">
              <Store className="w-4 h-4 text-[#00C853]" />
              <span>Where do you shop?</span>
            </label>

            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value as GroceryStore)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#00C853] cursor-pointer"
            >
              <option value="Walmart">Walmart</option>
              <option value="Kroger">Kroger</option>
              <option value="Aldi">Aldi</option>
              <option value="Whole Foods">Whole Foods</option>
              <option value="Costco">Costco</option>
              <option value="Other Supermarket">Other Supermarket</option>
            </select>

            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono-numeric block">
              Calculates category eligibility at {selectedStore}.
            </span>
          </div>

          {/* Big Green Button: "Find My Best Card" */}
          <button
            onClick={() => {
              setCurrentScreen(2);
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
            className="w-full h-14 bg-[#00C853] hover:bg-[#00b34a] text-black font-black text-base rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#00b34a]"
          >
            <span>Find My Best Card</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2 - RESULT (Math only) */}
      {/* ========================================================================= */}
      {currentScreen === 2 && (
        <div className="space-y-4 animate-fadeIn">
          {/* Header Action & Spend Recap */}
          <div className="flex items-center justify-between text-xs font-mono-numeric">
            <span className="text-slate-500 dark:text-slate-400">
              Spend: <strong className="text-slate-950 dark:text-white">${monthlySpend}/mo</strong> (${monthlySpend * 12}/yr)
            </span>
            <button
              onClick={() => setCurrentScreen(1)}
              className="text-[#00C853] font-bold hover:underline cursor-pointer"
            >
              Change Spend
            </button>
          </div>

          {/* Top card in BIG GREEN CARD */}
          <div 
            onClick={() => handleSelectCardForDetail(topCard.id)}
            className="bg-[#00C853] text-black p-5 rounded-3xl shadow-lg border border-[#00b34a] space-y-3 cursor-pointer transition-transform active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider bg-black text-[#00C853] px-2.5 py-0.5 rounded-full font-mono-numeric">
                BEST FOR YOU
              </span>
              <span className="text-xs font-mono-numeric font-black">
                {topCard.Cashback_Percent}% Cashback
              </span>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-black text-black leading-tight">
                {topCard.Card_Name}
              </h3>
              <span className="text-xs text-black/80 font-bold block mt-0.5 font-mono-numeric">
                Network: {topCard.Network} · {topCard.Where_Works}
              </span>
            </div>

            {/* BIG NUMBER */}
            <div className="py-2 px-3 bg-black/10 rounded-2xl border border-black/10 text-center">
              <span className="text-3xl sm:text-4xl font-black font-mono-numeric text-black block tracking-tight">
                You Save ${topCard.netSaving}/year
              </span>
              <span className="text-[11px] font-bold text-black/80 font-mono-numeric block mt-0.5">
                Net cash after subtracting ${topCard.Annual_Fee} annual fee
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-black pt-1">
              <span>Tap to see math breakdown</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </div>
          </div>

          {/* Comparison Callout: "Your Debit Card gives $0, you lose $XXX/year" */}
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 text-center space-y-1 font-mono-numeric">
            <span className="text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 block tracking-wider">
              Debit Card Penalty
            </span>
            <p className="text-sm sm:text-base font-black text-rose-700 dark:text-rose-300">
              Your Debit Card gives $0, you lose ${debitLoss}/year
            </p>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
              Paying cash or debit forfeits all grocery merchant interchange rewards.
            </span>
          </div>

          {/* List below: Top 5 cards with: Card Name, % back, Net Saving/year */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono-numeric font-bold text-slate-500">
              <span>Top 5 Ranked Grocery Cards</span>
              <span>Net Saved/Yr</span>
            </div>

            <div className="space-y-2">
              {top5Cards.map((card, index) => {
                const isWinner = index === 0;

                return (
                  <div
                    key={card.id}
                    onClick={() => handleSelectCardForDetail(card.id)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isWinner
                        ? 'border-[#00C853] bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono-numeric font-black text-slate-400">
                          #{index + 1}
                        </span>
                        <h4 className="font-black text-xs sm:text-sm text-slate-950 dark:text-white">
                          {card.Card_Name}
                        </h4>
                      </div>
                      <div className="text-[11px] font-mono-numeric text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span className="font-bold text-[#00C853]">
                          {card.Cashback_Percent}% back
                        </span>
                        <span>·</span>
                        <span>Fee: ${card.Annual_Fee}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-black font-mono-numeric text-[#00C853] block">
                        ${card.netSaving}/yr
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono-numeric">
                        Tap details →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recalculate Button */}
          <button
            onClick={() => setCurrentScreen(1)}
            className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer font-mono-numeric"
          >
            ← Recalculate with different spend
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 3 - DETAIL */}
      {/* ========================================================================= */}
      {currentScreen === 3 && (
        <div className="space-y-4 animate-fadeIn">
          {/* Card Title & Badges */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
            <span className="text-[10px] font-mono-numeric font-black uppercase text-[#00C853] block">
              Card Detail &amp; Verification
            </span>
            <h1 className="text-xl font-black text-slate-950 dark:text-white">
              {selectedCard.Card_Name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-numeric">
              <span className="px-2 py-0.5 rounded-md bg-[#00C853]/15 text-[#00C853] font-bold">
                {selectedCard.Cashback_Percent}% Cashback
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                ${selectedCard.Annual_Fee} Annual Fee
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                Network: {selectedCard.Network}
              </span>
            </div>
          </div>

          {/* Pure Math Breakdown (Deterministic Arithmetic) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 font-mono-numeric">
            <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Exact Math Breakdown
            </h3>

            <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500">Monthly Grocery Spend</span>
                <span className="font-black text-slate-950 dark:text-white">${monthlySpend}</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-500">Cashback Rate</span>
                <span className="font-black text-[#00C853]">{selectedCard.Cashback_Percent}%</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-500">Monthly Cash Saved (${monthlySpend} × {selectedCard.Cashback_Percent}%)</span>
                <span className="font-black text-slate-950 dark:text-white">${selectedCard.monthlySaving.toFixed(2)}/mo</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-500">Yearly Gross Cash (${selectedCard.monthlySaving.toFixed(2)} × 12)</span>
                <span className="font-black text-slate-950 dark:text-white">${selectedCard.yearlySaving.toFixed(2)}/yr</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-rose-600 dark:text-rose-400">Minus Annual Card Fee</span>
                <span className="font-black text-rose-600 dark:text-rose-400">-${selectedCard.Annual_Fee}</span>
              </div>

              {/* Net Result */}
              <div className="flex justify-between items-center pt-3 border-t-2 border-slate-900 dark:border-slate-700">
                <span className="text-sm font-black text-slate-950 dark:text-white uppercase">Net Cash Saved</span>
                <span className="text-2xl font-black text-[#00C853]">${selectedCard.netSaving}/year</span>
              </div>
            </div>
          </div>

          {/* Where it works */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1.5 text-xs">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono-numeric">
              Where It Works
            </span>
            <p className="font-bold text-slate-900 dark:text-white">
              {selectedCard.Where_Works}
            </p>
            <span className="text-[11px] text-slate-500 block font-mono-numeric">
              Verified for shoppers at {selectedStore} and qualifying merchant category codes.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            {/* Button: "Apply for this card" (link) */}
            <a
              href={selectedCard.Apply_Link !== '#' ? selectedCard.Apply_Link : undefined}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (selectedCard.Apply_Link === '#') {
                  e.preventDefault();
                  alert('Debit card requires no credit application.');
                }
              }}
              className="w-full h-14 bg-[#00C853] hover:bg-[#00b34a] text-black font-black text-sm rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#00b34a]"
            >
              <span>Apply for this card</span>
              <ExternalLink className="w-4 h-4 stroke-[2.5]" />
            </a>

            {/* Button: "Share savings" (share text: "I can save $XXX on groceries with CartWise") */}
            <button
              onClick={handleShare}
              className="w-full py-3.5 px-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 hover:border-slate-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer font-mono-numeric"
            >
              {shareSuccess ? (
                <>
                  <Check className="w-4 h-4 text-[#00C853]" />
                  <span>Text Copied: &quot;I can save ${selectedCard.netSaving} on groceries with CartWise&quot;</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  <span>Share savings ($ {selectedCard.netSaving})</span>
                </>
              )}
            </button>

            {/* Back Button */}
            <button
              onClick={() => setCurrentScreen(2)}
              className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-center font-mono-numeric"
            >
              ← Back to ranked results
            </button>
          </div>
        </div>
      )}

      {/* DESIGN FOOTER: "Estimates for educational purposes. Check bank terms." */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-center space-y-1">
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono-numeric">
          Estimates for educational purposes. Check bank terms.
        </p>
        <span className="text-[9px] text-slate-400 font-mono-numeric block">
          Works 100% offline · Low-end Android optimized · Zero external APIs
        </span>
      </div>

      {/* Google Sheets Database Inspector Modal */}
      {showSheetModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-4 shadow-2xl space-y-3 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <Table className="w-4 h-4 text-[#00C853]" />
                <h4 className="font-black text-xs text-slate-950 dark:text-white uppercase font-mono-numeric">
                  Google Sheet: Cards (12 Rows)
                </h4>
              </div>
              <button
                onClick={() => setShowSheetModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto overflow-y-auto flex-1 text-[10px] font-mono-numeric">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500">
                    <th className="p-1.5">Card_Name</th>
                    <th className="p-1.5">Cashback_%</th>
                    <th className="p-1.5">Fee</th>
                    <th className="p-1.5">Where_Works</th>
                    <th className="p-1.5">Network</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {GROCERY_CARDS_SHEET.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-1.5 font-bold text-slate-900 dark:text-white">{r.Card_Name}</td>
                      <td className="p-1.5 text-[#00C853] font-black">{r.Cashback_Percent}%</td>
                      <td className="p-1.5">${r.Annual_Fee}</td>
                      <td className="p-1.5 text-slate-500">{r.Where_Works}</td>
                      <td className="p-1.5 text-slate-500">{r.Network}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setShowSheetModal(false)}
              className="w-full py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Close Database
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
