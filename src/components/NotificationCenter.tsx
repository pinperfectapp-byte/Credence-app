import React, { useState, useRef, useEffect } from 'react';
import { InAppNotification } from '../types/notification';
import { 
  Bell, 
  X, 
  Calendar, 
  Scale, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Clock,
  Check
} from 'lucide-react';

interface NotificationCenterProps {
  notifications: InAppNotification[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
  onNavigate: (tabId: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onDismiss,
  onClearAll,
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (tabId?: string, notificationId?: string) => {
    if (notificationId) {
      onDismiss(notificationId);
    }
    setIsOpen(false);
    if (tabId) {
      onNavigate(tabId);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-colors border cursor-pointer ${
          unreadCount > 0
            ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
        }`}
        title="In-app alerts &amp; notifications"
        aria-label="Toggle notifications menu"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs font-mono-numeric animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-fadeIn text-xs">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-slate-900 dark:text-white text-xs">
                In-App Alerts
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold font-mono-numeric">
                  {unreadCount} active
                </span>
              )}
            </div>

            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 dark:text-slate-400 space-y-1.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                <span className="font-bold text-slate-700 dark:text-slate-300 block text-xs">
                  All Clear!
                </span>
                <p className="text-[11px] leading-relaxed">
                  No approaching statement closing dates or pending derogatory items right now.
                </p>
              </div>
            ) : (
              notifications.map((n) => {
                const isStatement = n.type === 'statement_approaching';
                const isSuccess = n.severity === 'success';
                const isWarning = n.severity === 'warning';

                return (
                  <div
                    key={n.id}
                    className={`p-3.5 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/60 ${
                      !n.read ? 'bg-emerald-50/20 dark:bg-emerald-950/10' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                            isSuccess
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                              : isWarning
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                              : 'bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400'
                          }`}
                        >
                          {isStatement ? (
                            <Calendar className="w-3.5 h-3.5" />
                          ) : (
                            <Scale className="w-3.5 h-3.5" />
                          )}
                        </div>

                        <div className="space-y-1 flex-1">
                          <span className="font-bold text-slate-900 dark:text-white block text-xs leading-tight">
                            {n.title}
                          </span>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                            {n.message}
                          </p>

                          {n.actionTab && (
                            <button
                              onClick={() => handleAction(n.actionTab, n.id)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-0.5 cursor-pointer"
                            >
                              <span>{n.actionLabel || 'View Details'}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => onDismiss(n.id)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 shrink-0 cursor-pointer"
                        title="Dismiss notification"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Notice */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 text-center">
            <span>Alerts update dynamically with your statement dates &amp; dispute items</span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Toast Notification Banner that slides in temporarily when an event occurs
 */
interface NotificationToastProps {
  notification: InAppNotification | null;
  onDismiss: () => void;
  onNavigate: (tabId: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onDismiss,
  onNavigate,
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 6000);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  if (!notification) return null;

  const isStatement = notification.type === 'statement_approaching';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white dark:bg-slate-900 border-2 border-emerald-500 rounded-2xl shadow-2xl p-4 text-xs animate-fadeIn select-none no-print">
      <div className="flex items-start justify-between gap-3">
        <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 shrink-0">
          {isStatement ? <Calendar className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
        </div>

        <div className="space-y-1 flex-1">
          <span className="font-extrabold text-slate-900 dark:text-white block text-xs">
            {notification.title}
          </span>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {notification.message}
          </p>

          {notification.actionTab && (
            <button
              onClick={() => {
                onDismiss();
                onNavigate(notification.actionTab!);
              }}
              className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-1 cursor-pointer text-xs"
            >
              <span>{notification.actionLabel || 'Take Action'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
