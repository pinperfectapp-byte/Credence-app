export interface InAppNotification {
  id: string;
  type: 'statement_approaching' | 'derogatory_changed';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionTab?: string;
  actionLabel?: string;
  severity: 'info' | 'warning' | 'success';
}
