import React, { useState } from 'react';
import { InAppNotification } from '../types/notification';
import { LegalModalTab } from './FooterLegalModal';
import { DownbaseFooter } from './DownbaseFooter';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Scale, 
  ShieldCheck, 
  Calculator,
  Award,
  BookOpen,
  Building2,
  Compass, 
  User, 
  Settings, 
  Search, 
  ArrowRight,
  Bell,
  Printer,
  FileDown,
  X,
  CheckCircle2,
  AlertCircle,
  ShoppingCart,
  Sliders
} from 'lucide-react';

interface MenuPageProps {
  onNavigate: (pageId: string) => void;
  onOpenLegal?: (tab: LegalModalTab) => void;
  notifications?: InAppNotification[];
  onDismissNotification?: (id: string) => void;
  onClearAllNotifications?: () => void;
}

interface ToolMenuItem {
  id: string;
  name: string;
  category: 'Problem Solvers' | 'Legal & Disputes' | 'System & Reports';
  description: string;
  icon: React.ReactNode;
  badge?: string;
}

export const MenuPage: React.FC<MenuPageProps> = ({ 
  onNavigate, 
  onOpenLegal,
  notifications = [],
  onDismissNotification,
  onClearAllNotifications
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const tools: ToolMenuItem[] = [
    {
      id: 'score_checker',
      name: '1. Credit Score Checker',
      category: 'Problem Solvers',
      description: 'Enter your credit score to see the best cards you qualify for and highest rewards.',
      icon: <Award className="w-4 h-4 text-emerald-500" />,
      badge: 'Best Cards',
    },
    {
      id: 'debt_payoff',
      name: '2. Debt Payoff Calculator',
      category: 'Problem Solvers',
      description: 'Snowball vs. Avalanche strategy comparison — shows exact date debt-free and dollar savings.',
      icon: <DollarSign className="w-4 h-4 text-emerald-500" />,
      badge: 'Debt-Free Date',
    },
    {
      id: 'credit_builder',
      name: '3. Credit Builder for Beginners',
      category: 'Problem Solvers',
      description: 'For 18–21 year olds with zero credit — secured cards, authorized user boost & fast tracks.',
      icon: <BookOpen className="w-4 h-4 text-sky-500" />,
      badge: 'Ages 18-21',
    },
    {
      id: 'loan_comparison',
      name: '4. Loan Comparison',
      category: 'Problem Solvers',
      description: 'Personal loans comparison engine — compare top US lenders, best APRs & interest saved.',
      icon: <Building2 className="w-4 h-4 text-amber-500" />,
      badge: 'Best APR',
    },
    {
      id: 'grocery_saver',
      name: 'Grocery Card Saver (Pure Math)',
      category: 'Problem Solvers',
      description: 'Find which card saves most on groceries from 12-card sheet (Save $193–$240/yr).',
      icon: <ShoppingCart className="w-4 h-4 text-[#00C853]" />,
      badge: 'Grocery $',
    },
    {
      id: 'compare',
      name: 'Real-Time Dollar Credit & APR Calculator',
      category: 'Problem Solvers',
      description: 'Calculate live dollar savings by dropping card APR (Save $200+/year in real cash).',
      icon: <Calculator className="w-4 h-4 text-emerald-500" />,
      badge: 'Real Dollars',
    },
    {
      id: 'track',
      name: 'Score Tracker (Line Chart)',
      category: 'Problem Solvers',
      description: 'FICO® score line chart (300-850), 750 goal line, and monthly trajectory.',
      icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
      badge: 'Goal 750',
    },
    {
      id: 'statement_optimizer',
      name: 'AZEO Statement Date Optimizer',
      category: 'Problem Solvers',
      description: 'Report < 3% utilization by paying before statement close for +20 to +45 pts.',
      icon: <Calendar className="w-4 h-4 text-sky-500" />,
      badge: '+45 Pts',
    },
    {
      id: 'dispute_hub',
      name: 'Bureau Tradeline Dispute Hub',
      category: 'Legal & Disputes',
      description: 'Track negative tradelines, 30-day statutory clocks, and register deletions.',
      icon: <ShieldCheck className="w-4 h-4 text-rose-500" />,
      badge: '+48 Pts',
    },
    {
      id: 'legal_toolkit',
      name: 'FCRA § 609 Legal Dispute Generator',
      category: 'Legal & Disputes',
      description: 'Draft attorney-standard certified mail dispute letters citing 15 U.S.C. § 1681i.',
      icon: <Scale className="w-4 h-4 text-amber-500" />,
      badge: 'Statutory',
    },
    {
      id: 'simulator',
      name: 'What-If Score Simulator',
      category: 'Problem Solvers',
      description: 'Model future score jumps and mortgage/auto loan dollar interest savings.',
      icon: <Sliders className="w-4 h-4 text-teal-500" />,
    },
    {
      id: 'notifications_tool',
      name: 'In-App Alerts & Notification Center',
      category: 'System & Reports',
      description: 'Working feature: monitor statement closing dates and derogatory status alerts.',
      icon: <Bell className="w-4 h-4 text-emerald-500" />,
      badge: notifications.length > 0 ? `${notifications.length} Active` : 'Working',
    },
    {
      id: 'export_report_tool',
      name: 'Export Credit Profile Dossier (PDF)',
      category: 'System & Reports',
      description: 'Triggers formatted browser PDF download via print system.',
      icon: <FileDown className="w-4 h-4 text-emerald-500" />,
      badge: 'PDF',
    },
    {
      id: 'settings',
      name: 'Settings, Privacy Mode & Backup',
      category: 'System & Reports',
      description: 'Toggle Light/Dark mode, public screen shield blur, and data backups.',
      icon: <Settings className="w-4 h-4 text-slate-500" />,
      badge: 'Settings',
    },
    {
      id: 'profile',
      name: 'Personal Credit Profile',
      category: 'System & Reports',
      description: 'Manage personal details, scores across all 3 bureaus, and card accounts.',
      icon: <User className="w-4 h-4 text-slate-500" />,
    },
  ];

  const filteredTools = tools.filter((tool) => {
    return (
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleToolClick = (toolId: string) => {
    if (toolId === 'notifications_tool') {
      setShowNotificationModal(true);
      return;
    }
    if (toolId === 'export_report_tool') {
      window.print();
      return;
    }
    onNavigate(toolId);
  };

  return (
    <div className="space-y-4 w-full max-w-full overflow-x-hidden">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono-numeric font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider block">
              Directory &amp; Features
            </span>
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              Credence Tools Menu
            </h2>
          </div>
          <Compass className="w-5 h-5 text-emerald-500" />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tools, APR, AZEO, disputes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-mono-numeric"
          />
        </div>
      </div>

      {/* Tools List */}
      <div className="space-y-2">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => handleToolClick(tool.id)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-2xl p-3 shadow-xs cursor-pointer flex items-center justify-between gap-3 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                {tool.icon}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-xs">
                    {tool.name}
                  </h3>
                  {tool.badge && (
                    <span className="text-[9px] font-mono-numeric font-bold px-1.5 py-0.5 rounded-sm bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {tool.description}
                </p>
              </div>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>
        ))}
      </div>

      {/* Downbase Footer Features */}
      {onOpenLegal && (
        <DownbaseFooter
          onOpenLegal={onOpenLegal}
          onNavigateTab={onNavigate}
          showThreeBadges={true}
        />
      )}

      {/* Working Feature: In-App Alerts & Notification Center Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-4 shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-emerald-500" />
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  In-App Alerts &amp; Statement Warnings
                </h4>
              </div>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="py-6 text-center space-y-1 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  All Systems Clear
                </span>
                <p className="text-[11px] text-slate-400">
                  No statement dates closing in the next 3 days, and no derogatory status changes.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 dark:text-white text-xs">
                        {notif.title}
                      </span>
                      {onDismissNotification && (
                        <button
                          onClick={() => onDismissNotification(notif.id)}
                          className="text-[10px] text-slate-400 hover:text-slate-600"
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      {notif.message}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              {notifications.length > 0 && onClearAllNotifications && (
                <button
                  onClick={onClearAllNotifications}
                  className="text-[11px] font-bold text-rose-500 hover:underline cursor-pointer"
                >
                  Clear All Alerts
                </button>
              )}
              <button
                onClick={() => setShowNotificationModal(false)}
                className="ml-auto px-4 py-1.5 rounded-xl font-black text-xs bg-slate-900 dark:bg-slate-800 text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
