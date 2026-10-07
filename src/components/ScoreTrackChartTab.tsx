import React, { useState, useEffect, useMemo } from 'react';
import { ScoreHistoryEntry } from '../types/credit';
import { 
  TrendingUp, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  ShieldCheck, 
  Trash2,
  Calendar
} from 'lucide-react';

const STORAGE_KEY = 'credence_score_history_fresh_v8';

// No mock data: app starts clean and untouched
const DEFAULT_HISTORY: ScoreHistoryEntry[] = [];

interface ScoreTrackChartTabProps {
  currentProfileScore?: number;
}

export const ScoreTrackChartTab: React.FC<ScoreTrackChartTabProps> = ({
  currentProfileScore = 0,
}) => {
  // Data source: Score_History sheet (persisted in localStorage)
  const [history, setHistory] = useState<ScoreHistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return DEFAULT_HISTORY;
  });

  const [inputDate, setInputDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [inputScore, setInputScore] = useState<string>(
    currentProfileScore > 0 ? currentProfileScore.toString() : '680'
  );
  const [inputNote, setInputNote] = useState<string>('Cycle Baseline');
  const [hoveredPoint, setHoveredPoint] = useState<ScoreHistoryEntry | null>(null);

  // Persist history sheet
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Storage unavailable
    }
  }, [history]);

  // Sort history chronologically
  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [history]);

  // Real Calculated Insights (Pure Math, Not AI):
  // Formula: Points_Gained = Latest_Score - First_Score
  // Formula: Avg_Growth_Per_Month = Points_Gained / Months_Since_Start
  const mathInsights = useMemo(() => {
    if (sortedHistory.length === 0) {
      return { pointsGained: 0, avgMonthly: 0, months: 1, latestScore: currentProfileScore || 0 };
    }
    const first = sortedHistory[0];
    const latest = sortedHistory[sortedHistory.length - 1];
    const pointsGained = latest.score - first.score;

    const firstDate = new Date(first.date);
    const latestDate = new Date(latest.date);
    const monthsSinceStart = Math.max(
      1,
      (latestDate.getFullYear() - firstDate.getFullYear()) * 12 +
        (latestDate.getMonth() - firstDate.getMonth()) + 1
    );

    const avgMonthly = Math.round((pointsGained / monthsSinceStart) * 10) / 10;
    return { pointsGained, avgMonthly, months: monthsSinceStart, latestScore: latest.score };
  }, [sortedHistory, currentProfileScore]);

  // Manual Input Form: Writes to database & refreshes graph instantly (No "Thank you" page)
  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const scoreVal = parseInt(inputScore);
    if (isNaN(scoreVal) || scoreVal < 300 || scoreVal > 850) return;

    const newEntry: ScoreHistoryEntry = {
      id: `score-${Date.now()}`,
      date: inputDate || new Date().toISOString().split('T')[0],
      score: scoreVal,
      note: inputNote.trim() || undefined,
    };

    setHistory((prev) => [...prev, newEntry]);
    setInputScore('');
  };

  const handleDeleteEntry = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddQuickBaseline = () => {
    const baselineScore = currentProfileScore > 0 ? currentProfileScore : 680;
    const newEntry: ScoreHistoryEntry = {
      id: `score-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      score: baselineScore,
      note: 'Initial File Verification',
    };
    setHistory([newEntry]);
  };

  // Line Chart Geometry Math for strictly stagnant 9:16 phone width
  // Total viewBox width 360, height 210 (No horizontal scrolling!)
  const chartWidth = 360;
  const chartHeight = 210;
  const padding = { top: 25, right: 25, bottom: 35, left: 38 };
  const graphW = chartWidth - padding.left - padding.right;
  const graphH = chartHeight - padding.top - padding.bottom;

  const minY = 300;
  const maxY = 850;
  const getY = (val: number) => {
    const clamped = Math.min(maxY, Math.max(minY, val));
    return padding.top + graphH - ((clamped - minY) / (maxY - minY)) * graphH;
  };

  const getX = (index: number) => {
    if (sortedHistory.length <= 1) return padding.left + graphW / 2;
    return padding.left + (index / (sortedHistory.length - 1)) * graphW;
  };

  // Dashed gray GOAL line at 750
  const goalY = getY(750);

  // SVG Line path string
  const linePoints = sortedHistory.map((item, idx) => `${getX(idx)},${getY(item.score)}`).join(' ');

  return (
    <div className="space-y-4 w-full max-w-full overflow-x-hidden">
      
      {/* 1. REAL LINE CHART (Color: #00FF85 green, thickness: 3px, dots, 750 goal line) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#00FF85]" />
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              FICO® History Curve (300–850)
            </h3>
          </div>

          {/* Goal & Score Legend */}
          <div className="flex items-center gap-3 text-[11px] font-mono-numeric">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00FF85]" />
              <span className="font-bold text-slate-700 dark:text-slate-300">Score</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <span className="w-3 border-b-2 border-dashed border-slate-400 inline-block" />
              <span>Goal: 750</span>
            </div>
          </div>
        </div>

        {/* Clean Empty State if no points logged yet */}
        {sortedHistory.length === 0 ? (
          <div className="py-8 px-4 text-center space-y-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                No Score History Points Yet
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Record your starting FICO® score to see live trajectory math.
              </p>
            </div>
            <button
              onClick={handleAddQuickBaseline}
              className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Log Starting Score ({currentProfileScore > 0 ? currentProfileScore : 680})</span>
            </button>
          </div>
        ) : (
          /* Stagnant Responsive SVG Chart: strictly fitted into 9:16 mobile width without scrolling */
          <div className="w-full overflow-hidden select-none">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto block select-none"
            >
              {/* Gridlines & Y-Axis Labels (300 to 850) */}
              {[300, 450, 600, 700, 750, 850].map((scoreLevel) => {
                const y = getY(scoreLevel);
                const isGoal = scoreLevel === 750;
                return (
                  <g key={scoreLevel}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={chartWidth - padding.right}
                      y2={y}
                      stroke={isGoal ? '#94a3b8' : '#e2e8f0'}
                      strokeDasharray={isGoal ? '4 4' : undefined}
                      strokeWidth={isGoal ? 1.5 : 0.8}
                      className={isGoal ? 'dark:stroke-slate-500' : 'dark:stroke-slate-800'}
                    />
                    <text
                      x={padding.left - 6}
                      y={y + 3.5}
                      textAnchor="end"
                      className={`text-[9px] font-mono-numeric font-bold ${
                        isGoal ? 'fill-slate-500 font-black' : 'fill-slate-400'
                      }`}
                    >
                      {scoreLevel}
                    </text>
                  </g>
                );
              })}

              {/* Dashed gray GOAL line indicator label */}
              <text
                x={chartWidth - padding.right}
                y={goalY - 4}
                textAnchor="end"
                className="text-[9px] font-mono-numeric font-bold fill-slate-400 uppercase tracking-wider"
              >
                Goal: 750
              </text>

              {/* Main #00FF85 green line (thickness 3px) */}
              {sortedHistory.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#00FF85"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={linePoints}
                />
              )}

              {/* Dot markers for each entry */}
              {sortedHistory.map((item, idx) => {
                const cx = getX(idx);
                const cy = getY(item.score);
                const isHovered = hoveredPoint?.id === item.id;

                return (
                  <g
                    key={item.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(item)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {isHovered && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="8"
                        fill="#00FF85"
                        opacity="0.3"
                      />
                    )}

                    {/* Dot Marker */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 5.5 : 4.5}
                      fill="#00FF85"
                      stroke="#080f1e"
                      strokeWidth="2"
                    />

                    {/* Score Number Above Dot */}
                    <text
                      x={cx}
                      y={cy - 7}
                      textAnchor="middle"
                      className="text-[10px] font-mono-numeric font-black fill-slate-900 dark:fill-white"
                    >
                      {item.score}
                    </text>

                    {/* Short Date on X-Axis */}
                    <text
                      x={cx}
                      y={chartHeight - 8}
                      textAnchor="middle"
                      className="text-[8px] font-mono-numeric fill-slate-400"
                    >
                      {item.date.slice(5)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* Hover inspection pill */}
        {hoveredPoint && (
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between text-xs font-mono-numeric">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {hoveredPoint.date} · <strong className="text-[#00FF85]">{hoveredPoint.score} pts</strong>
            </span>
            <span className="text-slate-400 text-[11px]">{hoveredPoint.note || 'Recorded'}</span>
          </div>
        )}
      </div>

      {/* 2. CALCULATED INSIGHTS BELOW GRAPH: 2 BOXES (Math, Not AI) */}
      <div className="grid grid-cols-2 gap-2.5">
        
        {/* Box 1: Points_Gained = Latest_Score - First_Score */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-500/40 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono-numeric">
            Points Gained
          </span>
          <span
            className={`text-xl sm:text-2xl font-black font-mono-numeric block ${
              mathInsights.pointsGained >= 0
                ? 'text-emerald-500'
                : 'text-rose-500'
            }`}
          >
            {mathInsights.pointsGained >= 0 ? `+${mathInsights.pointsGained}` : mathInsights.pointsGained} pts total
          </span>
          <span className="text-[10px] text-slate-400 font-mono-numeric block">
            Formula: Latest − First
          </span>
        </div>

        {/* Box 2: Avg_Growth_Per_Month = Points_Gained / Months_Since_Start */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-500/40 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono-numeric">
            Monthly Pace
          </span>
          <div className="flex items-center gap-1">
            {mathInsights.avgMonthly >= 0 ? (
              <ArrowUp className="w-5 h-5 text-emerald-500 stroke-[3]" />
            ) : (
              <ArrowDown className="w-5 h-5 text-rose-500 stroke-[3]" />
            )}
            <span
              className={`text-xl sm:text-2xl font-black font-mono-numeric ${
                mathInsights.avgMonthly >= 0
                  ? 'text-emerald-500'
                  : 'text-rose-500'
              }`}
            >
              {mathInsights.avgMonthly >= 0 ? `+${mathInsights.avgMonthly}` : mathInsights.avgMonthly} /mo
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono-numeric block">
            Formula: Pts / Months
          </span>
        </div>

      </div>

      {/* 3. MANUAL INPUT FORM: WRITES TO DATABASE & REFRESHES GRAPH INSTANTLY */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-emerald-500 stroke-[3]" />
          <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
            Log New Score Milestone
          </h4>
        </div>

        <form onSubmit={handleAddEntry} className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            {/* Input: Date */}
            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5 font-mono-numeric">
                Date
              </label>
              <input
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white font-mono-numeric font-bold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Input: Score (300-850) */}
            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5 font-mono-numeric">
                FICO® (300–850)
              </label>
              <input
                type="number"
                min="300"
                max="850"
                placeholder="695"
                value={inputScore}
                onChange={(e) => setInputScore(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white font-mono-numeric font-black text-center focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Input: Action Note */}
          <div>
            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5 font-mono-numeric">
              Maneuver Taken
            </label>
            <input
              type="text"
              placeholder="e.g. Paid Chase statement early"
              value={inputNote}
              onChange={(e) => setInputNote(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 px-3 rounded-xl font-black text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
            <span>Add Point to Curve</span>
          </button>
        </form>

        {/* History points chips */}
        {sortedHistory.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono-numeric">
              Logged Points ({sortedHistory.length})
            </span>
            <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto pr-1">
              {sortedHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-mono-numeric"
                >
                  <div>
                    <span className="font-black text-slate-900 dark:text-white block text-xs">
                      {item.score}
                    </span>
                    <span className="text-[9px] text-slate-400 block">{item.date}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteEntry(item.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                    title="Delete entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
