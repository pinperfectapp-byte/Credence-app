import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  HelpCircle, 
  Award, 
  ArrowRight, 
  BookOpen, 
  ShieldCheck, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  Zap, 
  ChevronDown, 
  ChevronUp,
  Scale,
  Compass,
  FileText
} from 'lucide-react';

export interface QuizQuestion {
  id: string;
  category: 'Bureau Reporting' | 'Utilization & Balances' | 'Accounts & History' | 'Scores & Inquiries';
  statement: string;
  isFact: boolean; // false = Myth, true = Fact
  mythTitle: string;
  verdict: 'MYTH BUSTED' | 'CONFIRMED FACT';
  summary: string;
  deepDive: string;
  bureauTruth: string;
  scoreImpact: string;
  relatedToolId?: string;
  relatedToolName?: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'carrying_balance',
    category: 'Utilization & Balances',
    statement: 'Leaving a small balance of $20 to $50 on your credit card month-to-month improves your credit score faster than paying the card in full.',
    isFact: false,
    mythTitle: 'Carrying a balance builds credit faster',
    verdict: 'MYTH BUSTED',
    summary: 'Carrying a balance month-to-month does NOT help your score and only costs you money in interest.',
    deepDive: 'Major credit scoring algorithms look at your reported statement balance and on-time payment history. They do NOT reward you for paying interest to a bank. In fact, carrying revolving balances increases your utilization ratio and costs you 20% to 29% in annual interest charges.',
    bureauTruth: 'The credit bureaus only receive a monthly snapshot of your balance and payment status. They have no record of whether you paid interest or paid in full during the grace period.',
    scoreImpact: '0 pts gained. Average loss: $180-$400/year in unnecessary interest charges.',
    relatedToolId: 'debt_payoff',
    relatedToolName: 'Debt Payoff Calculator'
  },
  {
    id: 'soft_inquiries',
    category: 'Scores & Inquiries',
    statement: 'Checking your own credit score through monitoring apps or AnnualCreditReport.com causes your score to drop by 3 to 5 points.',
    isFact: false,
    mythTitle: 'Checking your own credit hurts your score',
    verdict: 'MYTH BUSTED',
    summary: 'Checking your own credit is a Soft Inquiry with exactly ZERO negative impact on your scores.',
    deepDive: 'Federal regulations and bureau algorithms categorize personal credit checks as "Soft Inquiries" (soft pulls). Soft inquiries are completely invisible to potential lenders and never factor into score calculations. You can check your score daily without losing a single point.',
    bureauTruth: 'Only "Hard Inquiries" (hard pulls) from lender loan or credit card applications affect scores, and typically only subtract 2 to 5 points temporarily for up to 12 months.',
    scoreImpact: '0.00 pts lost. Soft inquiries never alter your score.',
    relatedToolId: 'score_checker',
    relatedToolName: 'Credit Score Checker'
  },
  {
    id: 'closing_cards',
    category: 'Accounts & History',
    statement: 'Closing an old, paid-off credit card that you no longer use will instantly clean up your report and boost your credit score.',
    isFact: false,
    mythTitle: 'Closing old cards boosts your score',
    verdict: 'MYTH BUSTED',
    summary: 'Closing an older card usually lowers your score by shrinking your available credit and spiking your utilization.',
    deepDive: 'When you close an account, your total available credit limit immediately decreases. For example, if you have $1,000 balance across $10,000 credit (10% utilization), closing a $5,000 card instantly jumps your utilization to 20% ($1,000 / $5,000), which directly drops your score.',
    bureauTruth: 'Standard scoring models continue to count closed accounts in good standing toward your Average Age of Accounts (AAoA) for up to 10 years after closure, but the credit limit loss hits immediately.',
    scoreImpact: 'Loss of 10 to 35 points if credit utilization ratio spikes as a result.',
    relatedToolId: 'statement_optimizer',
    relatedToolName: 'AZEO Statement Optimizer'
  },
  {
    id: 'income_in_score',
    category: 'Scores & Inquiries',
    statement: 'A significant pay raise at your job or a large balance in your personal checking account directly increases your credit score.',
    isFact: false,
    mythTitle: 'Income & savings directly determine credit scores',
    verdict: 'MYTH BUSTED',
    summary: 'Credit bureaus do NOT track your salary, hourly wage, bank savings, or net worth.',
    deepDive: 'Credit scores measure credit risk and repayment reliability, not personal wealth. Equifax, Experian, and TransUnion have no access to your employer payroll or bank account balances. A person making $35,000/year can easily have an 820 credit score, while a multimillionaire who misses bill payments can have a 580.',
    bureauTruth: 'Lenders evaluate your income separately using Debt-to-Income (DTI) ratio during loan underwriting, but income is completely excluded from credit reports.',
    scoreImpact: 'Zero direct score correlation. Debt management determines 100% of score math.',
    relatedToolId: 'loan_comparison',
    relatedToolName: 'Loan Comparison & APR'
  },
  {
    id: 'three_bureaus_identical',
    category: 'Bureau Reporting',
    statement: 'Equifax, Experian, and TransUnion are part of the same federal system and always hold identical credit files and scores.',
    isFact: false,
    mythTitle: 'All 3 credit bureaus share identical data',
    verdict: 'MYTH BUSTED',
    summary: 'The 3 bureaus are independent, competing, private for-profit companies with separate databases.',
    deepDive: 'Creditors and collection agencies pay fees to furnish data to bureaus. Many small banks, credit unions, and medical billing offices only furnish data to one or two bureaus to save on data fees. Furthermore, when you apply for a credit card, the issuer may only pull Experian or TransUnion, creating inquiries on only that bureau.',
    bureauTruth: 'Because each bureau has different tradelines, inquiries, and public records, your score can vary by 20 to 60+ points between Experian, TransUnion, and Equifax at any given moment.',
    scoreImpact: 'Bureaus frequently differ by 15 to 45+ points for the same consumer.',
    relatedToolId: 'dispute_hub',
    relatedToolName: 'Bureau Tradeline Dispute Hub'
  },
  {
    id: 'paid_collections_deletion',
    category: 'Bureau Reporting',
    statement: 'Once you pay off an old debt in collections, the credit bureau is legally required to immediately delete the negative collection record.',
    isFact: false,
    mythTitle: 'Paying a collection automatically deletes it',
    verdict: 'MYTH BUSTED',
    summary: 'Under the FCRA, collections remain on your credit report for up to 7 years, even after being paid.',
    deepDive: 'Paying a collection account updates its status from "Unpaid Collection" to "Paid Collection" with a $0 balance. While newer scoring models ignore paid collections, older models still penalize paid collections for up to 7 years from the date of first delinquency.',
    bureauTruth: 'To get a collection removed before the 7-year mark, you must negotiate a written "Pay-for-Delete" agreement before paying, or file a formal dispute citing inaccuracies under FCRA § 609.',
    scoreImpact: 'Standard scores may see minimal or zero score recovery from paying without a delete.',
    relatedToolId: 'legal_toolkit',
    relatedToolName: 'FCRA § 609 Legal Dispute Generator'
  },
  {
    id: 'debit_card_credit',
    category: 'Accounts & History',
    statement: 'Selecting the "Credit" button at the grocery store checkout when using a bank debit card builds your credit history with the bureaus.',
    isFact: false,
    mythTitle: 'Debit cards build credit if you press "Credit"',
    verdict: 'MYTH BUSTED',
    summary: 'Debit transactions pull money from your checking account and are NEVER reported to credit bureaus.',
    deepDive: 'Pressing "Credit" at checkout only changes how the payment is routed across merchant processing networks (signature vs. PIN network). It is still a debit card tied to your personal checking account. No credit line is extended, and the bank sends zero data to Experian, TransUnion, or Equifax.',
    bureauTruth: 'To build credit with your daily spending, you must use a revolving credit product: such as a secured credit card, authorized user tradeline, or credit-builder installment loan.',
    scoreImpact: '0 pts built. 100% of debit card activity is invisible to credit bureaus.',
    relatedToolId: 'credit_builder',
    relatedToolName: 'Credit Builder for Beginners'
  },
  {
    id: 'single_credit_score',
    category: 'Scores & Inquiries',
    statement: 'Every consumer has exactly one true, official credit score that all lenders and banks use.',
    isFact: false,
    mythTitle: 'You only have one single credit score',
    verdict: 'MYTH BUSTED',
    summary: 'You have dozens of credit scores across multiple scoring algorithms and specialized industry models.',
    deepDive: 'National scoring systems use standard consumer models, plus industry-specific variants: Auto Scores (weights past vehicle loan history), Bankcard Scores, and mortgage models. In addition, alternative consumer models are separate formulas used by many free apps.',
    bureauTruth: 'A free score shown on a banking app is often an alternative educational model, whereas 90% of top US mortgage and auto lenders use commercial underwriting algorithms.',
    scoreImpact: 'Scores can vary by 30 to 70 points between different scoring formulas.',
    relatedToolId: 'track',
    relatedToolName: 'Score Tracker Line Chart'
  },
  {
    id: 'statement_vs_due_date',
    category: 'Utilization & Balances',
    statement: 'Paying your credit card balance to $0 by the payment due date guarantees a 0% credit card balance will be reported to the bureaus.',
    isFact: false,
    mythTitle: 'Due date is the same as statement closing date',
    verdict: 'MYTH BUSTED',
    summary: 'Most issuers report your balance on your STATEMENT DATE, which is 21 to 25 days before your due date!',
    deepDive: 'This is the most common credit score trap in America. If your statement closes on the 5th with a $2,000 balance on a $2,500 limit (80% utilization), that 80% utilization is reported to bureaus on the 5th! Even if you pay the entire $2,000 on your due date on the 28th, your score remains depressed for the entire month.',
    bureauTruth: 'Under the AZEO (All Zero Except One) strategy, paying 2 to 3 days BEFORE the statement closing date forces the issuer to report <3% utilization to bureaus, boosting scores by +20 to +45 points.',
    scoreImpact: 'Potential +20 to +45 point swing purely by changing the timing of your payment.',
    relatedToolId: 'statement_optimizer',
    relatedToolName: 'AZEO Statement Optimizer'
  },
  {
    id: 'cosigning_risk',
    category: 'Accounts & History',
    statement: 'Co-signing an auto loan or personal loan for a friend or relative has zero effect on your credit profile as long as they never miss a payment.',
    isFact: false,
    mythTitle: 'Co-signing does not affect your credit if payments are on time',
    verdict: 'MYTH BUSTED',
    summary: '100% of co-signed debt appears on YOUR credit report, impacting your debt load and DTI from day one.',
    deepDive: 'When you co-sign, you are legally 100% liable for the debt. The full loan balance and monthly payment appear directly on your credit report. This increases your reported liabilities and spikes your Debt-to-Income (DTI) ratio, which can cause you to be rejected for your own mortgage or car loan. If the borrower misses a single payment, your score plunges by 50 to 100+ points instantly.',
    bureauTruth: 'Credit bureaus treat co-signers as primary joint obligors. There is no special "co-signer shield" in credit reporting.',
    scoreImpact: 'Immediate increase in debt liabilities; single late payment can wipe 60-110 points.',
    relatedToolId: 'loan_comparison',
    relatedToolName: 'Loan Comparison Engine'
  }
];

interface CreditMythsQuizTabProps {
  onNavigateTab?: (tab: string) => void;
}

export const CreditMythsQuizTab: React.FC<CreditMythsQuizTabProps> = ({ onNavigateTab }) => {
  const [mode, setMode] = useState<'quiz' | 'library'>('quiz');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, boolean>>({}); // index -> user picked true (Fact) or false (Myth)
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const currentQuestion = QUIZ_QUESTIONS[currentIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;

  // Calculate score
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = Object.entries(userAnswers).reduce((acc, [idxStr, pickedVal]) => {
    const qIdx = parseInt(idxStr, 10);
    const q = QUIZ_QUESTIONS[qIdx];
    return q && q.isFact === pickedVal ? acc + 1 : acc;
  }, 0);

  const handlePickAnswer = (pickedFact: boolean) => {
    if (userAnswers[currentIndex] !== undefined) return; // already answered
    setUserAnswers(prev => ({ ...prev, [currentIndex]: pickedFact }));
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
    setQuizFinished(false);
  };

  const toggleExpandCard = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Categories for filter in library mode
  const categories = ['All', 'Utilization & Balances', 'Scores & Inquiries', 'Bureau Reporting', 'Accounts & History'];

  const filteredQuestions = selectedCategory === 'All'
    ? QUIZ_QUESTIONS
    : QUIZ_QUESTIONS.filter(q => q.category === selectedCategory);

  // Score badge evaluation
  const getScoreRating = (score: number) => {
    if (score === 10) return { title: 'Credit Mythbuster Master', color: 'text-emerald-500', desc: 'Flawless 10/10! You possess professional-grade credit literacy and cannot be tricked by common credit myths.' };
    if (score >= 8) return { title: 'Credit Savvy Veteran', color: 'text-emerald-500', desc: 'Outstanding job! You know the real credit bureau rules and understand how to protect your score.' };
    if (score >= 6) return { title: 'Solid Fundamentals', color: 'text-amber-500', desc: 'Good foundation, but a few dangerous misconceptions could still be costing you points or dollars.' };
    return { title: 'Credit Novice — Time to Level Up!', color: 'text-rose-500', desc: 'These 10 misconceptions are heavily exploited by predatory lenders. Review the cheat sheet below to boost your score.' };
  };

  return (
    <div className="space-y-5 pb-8 animate-fade-in w-full max-w-full overflow-x-hidden">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[11px] font-black uppercase tracking-wider font-mono-numeric">
                Tools Menu · Educational Engine
              </span>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                10 Scenarios
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Credit Myths & Realities
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
              Separate fact from fiction on credit algorithms, statement reporting dates, and credit bureau secrets that save thousands in real dollars.
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shrink-0">
            <HelpCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setMode('quiz')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'quiz'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Zap className="w-4 h-4 stroke-[2.5]" />
            <span>Interactive Quiz</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/20 ml-1 font-mono-numeric">
              {answeredCount}/{totalQuestions}
            </span>
          </button>

          <button
            onClick={() => setMode('library')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'library'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4 stroke-[2.5]" />
            <span>Myth Library (10)</span>
          </button>
        </div>
      </div>

      {/* QUIZ MODE */}
      {mode === 'quiz' && (
        <div className="space-y-4">
          {!quizFinished ? (
            <>
              {/* Question Progress & Category Bar */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono-numeric">
                      Question {currentIndex + 1} of {totalQuestions}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {currentQuestion.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-black font-mono-numeric">
                    <span className="text-slate-500 dark:text-slate-400">Score:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {correctCount}
                    </span>
                    <span className="text-slate-400">/</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {answeredCount}
                    </span>
                  </div>
                </div>

                {/* Progress track */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                  {QUIZ_QUESTIONS.map((q, idx) => {
                    const isAnswered = userAnswers[idx] !== undefined;
                    const isCorrect = isAnswered && userAnswers[idx] === q.isFact;
                    const isCurrent = idx === currentIndex;

                    let bgClass = 'bg-slate-200 dark:bg-slate-700';
                    if (isAnswered) {
                      bgClass = isCorrect ? 'bg-emerald-500' : 'bg-rose-500';
                    } else if (isCurrent) {
                      bgClass = 'bg-emerald-400/60';
                    }

                    return (
                      <div
                        key={q.id}
                        className={`h-full flex-1 border-r border-white dark:border-slate-900 last:border-0 transition-colors ${bgClass}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Main Question Card */}
              <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-wider font-mono-numeric">
                      Myth #{currentIndex + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                      Common Belief in America
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                    "{currentQuestion.statement}"
                  </h2>
                </div>

                {/* Choice Buttons: MYTH vs FACT */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Is this statement a Myth or a Fact?
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Button 1: It's a MYTH (False) */}
                    <button
                      onClick={() => handlePickAnswer(false)}
                      disabled={userAnswers[currentIndex] !== undefined}
                      className={`p-4 rounded-2xl border-2 font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        userAnswers[currentIndex] === false
                          ? currentQuestion.isFact === false
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300'
                          : userAnswers[currentIndex] !== undefined
                          ? 'opacity-40 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed'
                          : 'border-slate-200 dark:border-slate-800 hover:border-rose-400 hover:bg-rose-50/30 dark:hover:bg-rose-950/20 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                        <XCircle className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <span className="text-sm font-black tracking-wide">
                        MYTH (False)
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        Total misconception
                      </span>
                    </button>

                    {/* Button 2: It's a FACT (True) */}
                    <button
                      onClick={() => handlePickAnswer(true)}
                      disabled={userAnswers[currentIndex] !== undefined}
                      className={`p-4 rounded-2xl border-2 font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        userAnswers[currentIndex] === true
                          ? currentQuestion.isFact === true
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300'
                          : userAnswers[currentIndex] !== undefined
                          ? 'opacity-40 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed'
                          : 'border-slate-200 dark:border-slate-800 hover:border-emerald-400 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <span className="text-sm font-black tracking-wide">
                        FACT (True)
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        Proven bureau rule
                      </span>
                    </button>
                  </div>
                </div>

                {/* Answer Reveal & Explanation Box */}
                {showExplanation && (
                  <div className="space-y-4 pt-3 border-t-2 border-slate-100 dark:border-slate-800 animate-fade-in">
                    {/* Result Banner */}
                    <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                      userAnswers[currentIndex] === currentQuestion.isFact
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                        : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                    }`}>
                      <div className="mt-0.5">
                        {userAnswers[currentIndex] === currentQuestion.isFact ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                        ) : (
                          <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 stroke-[2.5]" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase tracking-wider font-mono-numeric">
                            {userAnswers[currentIndex] === currentQuestion.isFact ? 'Correct! You got it right' : 'Incorrect — Common Trap!'}
                          </span>
                          <span className="px-2 py-0.2 rounded-md bg-white dark:bg-slate-900 text-[10px] font-black border border-slate-200 dark:border-slate-700">
                            {currentQuestion.verdict}
                          </span>
                        </div>
                        <p className="text-sm font-extrabold leading-snug">
                          {currentQuestion.summary}
                        </p>
                      </div>
                    </div>

                    {/* Detailed Analysis */}
                    <div className="bg-slate-50 dark:bg-slate-800/70 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono-numeric">
                          How Credit Scoring Actually Works
                        </span>
                        <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                          {currentQuestion.deepDive}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                            Credit Bureau Operational Reality
                          </span>
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
                            {currentQuestion.bureauTruth}
                          </p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="text-[11px] font-black text-amber-800 dark:text-amber-200">
                            Score / Dollar Impact:
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {currentQuestion.scoreImpact}
                        </span>
                      </div>
                    </div>

                    {/* Action Shortcut to relevant app tool */}
                    {currentQuestion.relatedToolId && onNavigateTab && (
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs font-black text-slate-900 dark:text-white">
                            Put into action: {currentQuestion.relatedToolName}
                          </span>
                        </div>
                        <button
                          onClick={() => onNavigateTab(currentQuestion.relatedToolId!)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>Open</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Next Question Button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleNextQuestion}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                      >
                        <span>
                          {currentIndex < totalQuestions - 1 ? 'Next Question' : 'View Final Score & Results'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Quiz Completed View */
            <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 shadow-md space-y-6 animate-fade-in text-center">
              <div className="inline-flex p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <Award className="w-12 h-12 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-black font-mono-numeric uppercase tracking-wider">
                  Quiz Completed
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Your Score: {correctCount} / {totalQuestions}
                </h2>
                <div className={`text-base sm:text-lg font-black ${getScoreRating(correctCount).color}`}>
                  {getScoreRating(correctCount).title}
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  {getScoreRating(correctCount).desc}
                </p>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80">
                  <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 font-mono-numeric block">
                    Myths Busted
                  </span>
                  <span className="text-xl font-black text-slate-900 dark:text-white font-mono-numeric">
                    {correctCount} / {totalQuestions}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mt-0.5">
                    {Math.round((correctCount / totalQuestions) * 100)}% Accuracy
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 font-mono-numeric block">
                    Financial Armor
                  </span>
                  <span className="text-xl font-black text-slate-900 dark:text-white font-mono-numeric">
                    100% Free
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mt-0.5">
                    Zero Bureau Traps
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleRestartQuiz}
                  className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Quiz</span>
                </button>
                <button
                  onClick={() => setMode('library')}
                  className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read 10 Myths Cheat Sheet</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* LIBRARY / STUDY CHEAT SHEET MODE */}
      {mode === 'library' && (
        <div className="space-y-4">
          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white font-black shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {filteredQuestions.map((q, idx) => {
              const isExpanded = expandedCards[q.id] ?? false;

              return (
                <div
                  key={q.id}
                  className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition-all"
                >
                  <div
                    onClick={() => toggleExpandCard(q.id)}
                    className="p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 flex items-start justify-between gap-3 select-none"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-wider font-mono-numeric">
                          {q.verdict}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                          {q.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                        {q.mythTitle}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 line-clamp-2">
                        "{q.statement}"
                      </p>
                    </div>

                    <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 mt-1">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>

                  {/* Expanded deep dive */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-fade-in text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono-numeric">
                            The Algorithm Reality
                          </span>
                          <p className="font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                            {q.deepDive}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block font-mono-numeric">
                            Credit Bureau Rule
                          </span>
                          <p className="font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
                            {q.bureauTruth}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <span className="text-[11px] font-black text-amber-800 dark:text-amber-200">
                          Impact on Score & Finances:
                        </span>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {q.scoreImpact}
                        </span>
                      </div>

                      {q.relatedToolId && onNavigateTab && (
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            CHIDONIQ Tool: {q.relatedToolName}
                          </span>
                          <button
                            onClick={() => onNavigateTab(q.relatedToolId!)}
                            className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Open Tool</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Educational Disclosure */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
        <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Regulatory Authority Grounding
          </span>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-normal">
            Information based on statutory requirements under the Fair Credit Reporting Act (15 U.S.C. § 1681), Fair Credit Billing Act (15 U.S.C. § 1666), and verified nationwide scoring engine mechanics.
          </p>
        </div>
      </div>
    </div>
  );
};
