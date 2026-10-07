export type ThemeMode = 'light' | 'dark';

export interface AppSettings {
  theme: ThemeMode;
  defaultBureau: 'all' | 'experian' | 'transUnion' | 'equifax';
  statementWarningDays: number;
  privacyMode: boolean;
  autoPrivacyOnBlur: boolean;
  targetScore: number;
}
