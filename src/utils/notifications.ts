import { CreditCardAccount, DerogatoryItem } from '../types/credit';
import { InAppNotification } from '../types/notification';

/**
 * Checks cards for approaching statement closing dates.
 * Most credit card issuers report balance on the statement closing day,
 * so paying 2-3 days before this date ensures optimal AZEO reporting.
 */
export function getApproachingStatementNotifications(
  cards: CreditCardAccount[],
  warningDays: number = 3
): InAppNotification[] {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const notifications: InAppNotification[] = [];

  cards.forEach((card) => {
    let daysUntilClosing = card.statementClosingDay - currentDay;
    if (daysUntilClosing < 0) {
      daysUntilClosing += daysInCurrentMonth;
    }

    if (daysUntilClosing <= warningDays) {
      const isToday = daysUntilClosing === 0;
      const isTomorrow = daysUntilClosing === 1;
      const urgencyText = isToday ? 'TODAY' : isTomorrow ? 'tomorrow' : `in ${daysUntilClosing} days`;

      notifications.push({
        id: `statement-${card.id}-${currentMonth}-${currentDay}`,
        type: 'statement_approaching',
        severity: isToday ? 'warning' : 'info',
        title: isToday
          ? `Statement Closes Today: ${card.name}`
          : `Statement Closing in ${daysUntilClosing} Days: ${card.name}`,
        message: `${card.name} (${card.bank}) statement closing date is ${urgencyText} (Day ${card.statementClosingDay}). ${
          card.isPaidForStatement
            ? '✓ Marked as pre-paid for AZEO optimization!'
            : `Current balance: $${card.balance.toLocaleString()}. Pay down now to report < 3% utilization to bureaus.`
        }`,
        timestamp: Date.now(),
        read: false,
        actionTab: 'statement_optimizer',
        actionLabel: 'Open Statement Optimizer',
      });
    }
  });

  return notifications;
}

/**
 * Creates an alert notification when a derogatory item status changes.
 */
export function createDerogatoryStatusNotification(
  item: DerogatoryItem,
  newStatus: 'Reported' | 'Disputed' | 'Pending Verification' | 'Removed'
): InAppNotification {
  const isRemoved = newStatus === 'Removed';
  const isDisputed = newStatus === 'Disputed';

  let title = `Dispute Status Updated: ${item.accountName}`;
  let message = `${item.accountName} status is now marked as "${newStatus}".`;
  let severity: 'info' | 'warning' | 'success' = 'info';

  if (isRemoved) {
    title = `Derogatory Item Removed (+48 Pts)!`;
    message = `Congratulations! ${item.accountName} (${item.itemType.replace('_', ' ')}) was purged from bureau files. Estimated credit score boost of +48 points!`;
    severity = 'success';
  } else if (isDisputed) {
    title = `FCRA § 609 Reinvestigation Clock Started`;
    message = `Formal dispute submitted for ${item.accountName}. Credit bureaus must conclude investigation within 30 days under 15 U.S.C. § 1681i.`;
    severity = 'warning';
  }

  return {
    id: `derog-${item.id}-${Date.now()}`,
    type: 'derogatory_changed',
    severity,
    title,
    message,
    timestamp: Date.now(),
    read: false,
    actionTab: 'dispute_hub',
    actionLabel: 'View Dispute Hub',
  };
}
