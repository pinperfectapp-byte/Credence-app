import { CreditProfile } from '../types/credit';

export const DEFAULT_USER_PROFILE: CreditProfile = {
  id: 'primary_user',
  name: '',
  email: '',
  address: '',
  cityStateZip: '',
  ssnLast4: '',
  persona: 'Personal Credit File',
  baseScore: 0,
  bureaus: {
    experian: 0,
    transUnion: 0,
    equifax: 0,
  },
  creditAgeYears: 0,
  totalInquiries: 0,
  hasInstallmentLoan: false,
  annualIncome: 0,
  cards: [],
  derogatoryItems: [],
};
