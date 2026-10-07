import { BureauInfo, CreditProfile, DerogatoryItem, DisputeLetterType } from '../types/credit';

export const BUREAUS: BureauInfo[] = [
  {
    name: 'Experian',
    department: 'Experian Consumer Dispute Center',
    address: 'P.O. Box 4500',
    cityStateZip: 'Allen, TX 75013',
  },
  {
    name: 'Equifax',
    department: 'Equifax Information Services LLC',
    address: 'P.O. Box 740256',
    cityStateZip: 'Atlanta, GA 30374-0256',
  },
  {
    name: 'TransUnion',
    department: 'TransUnion Consumer Solutions',
    address: 'P.O. Box 2000',
    cityStateZip: 'Chester, PA 19016-2000',
  },
];

export interface GeneratedLetter {
  type: DisputeLetterType;
  title: string;
  recipientBureau: BureauInfo;
  subject: string;
  legalNotice: string;
  body: string;
  enclosures: string[];
}

export function generateDisputeLetter(
  profile: CreditProfile,
  item: DerogatoryItem,
  bureauName: 'Experian' | 'Equifax' | 'TransUnion',
  type: DisputeLetterType,
  settlementOfferAmount?: number
): GeneratedLetter {
  const bureau = BUREAUS.find((b) => b.name === bureauName) || BUREAUS[0];
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (type === 'cfpb_medical') {
    return {
      type,
      title: 'CFPB Medical Debt Removal Demand (< $500 Rule)',
      recipientBureau: bureau,
      subject: `FORMAL NOTICE: Mandatory Removal of Medical Collection Account Under CFPB Directives - Account ${item.accountNumberMasked}`,
      legalNotice: 'Pursuant to 12 CFR Part 1022 and joint nationwide CRA policies effective 2023, medical collections with initial balance under $500 are categorically prohibited from consumer credit files.',
      body: `${profile.name}
${profile.address}
${profile.cityStateZip}
SSN: XXX-XX-${profile.ssnLast4}

Date: ${currentDate}

SENT VIA USPS CERTIFIED MAIL WITH RETURN RECEIPT

${bureau.department}
${bureau.address}
${bureau.cityStateZip}

RE: DEMAND FOR EXPEDITED REMOVAL OF MEDICAL DEBT UNDER $500
Account Name: ${item.accountName}
Original Creditor: ${item.originalCreditor}
Account Number (Masked): ${item.accountNumberMasked}
Reported Balance: $${item.balance}

To Whom It May Concern at ${bureau.name}:

I am writing to formally dispute the medical collection account referenced above, currently appearing on my consumer credit file maintained by ${bureau.name}.

Under the Consumer Financial Protection Bureau (CFPB) regulatory framework and the unanimous nationwide Credit Reporting Agency policy enacted in 2023:
1. All medical debt collection accounts with an initial balance under $500 are barred from reporting on consumer credit reports.
2. All paid medical debts of any amount must be completely deleted, rather than marked as "paid collection".

The account in question reflects a reported balance of $${item.balance}, which falls strictly below the $500 federal threshold. Continued reporting of this tradeline constitutes a direct violation of federal credit reporting guidelines and causes substantial financial prejudice.

I hereby demand that ${bureau.name} immediately and permanently suppress and delete this entire tradeline from my consumer file within thirty (30) calendar days of receipt of this notice, and issue an updated copy of my consumer disclosure.

Thank you for your prompt compliance with federal standards.

Sincerely,

__________________________________________
${profile.name}
Phone / Email: ${profile.email}`,
      enclosures: [
        "Copy of State Driver's License (Government Photo ID)",
        "Copy of Current Utility Bill (Proof of Residence)",
        "Copy of Credit Report excerpt highlighting the prohibited $380 medical tradeline",
      ],
    };
  }

  if (type === 'goodwill_late') {
    return {
      type,
      title: 'Goodwill Adjustment Request (30-Day Late Forgiveness)',
      recipientBureau: bureau,
      subject: `Goodwill Adjustment Request for Account: ${item.accountNumberMasked}`,
      legalNotice: 'Goodwill adjustments appeal to the creditor\'s customer loyalty discretion and do not contest transaction validity.',
      body: `${profile.name}
${profile.address}
${profile.cityStateZip}
SSN: XXX-XX-${profile.ssnLast4}

Date: ${currentDate}

Customer Service & Credit Bureau Reporting Department
${item.accountName}
c/o ${bureau.department}

RE: Goodwill Adjustment Request for 30-Day Late Mark
Creditor: ${item.originalCreditor}
Account Number: ${item.accountNumberMasked}

Dear Customer Relations & Credit Committee,

I am writing to you today with great respect and appreciation for our long-standing relationship. I have been a loyal and conscientious account holder with ${item.originalCreditor}, and I take immense pride in maintaining a responsible financial track record.

Upon reviewing my recent credit disclosure from ${bureau.name}, I noticed a singular 30-day late payment recorded on ${item.dateReported}. 

During this particular period, I encountered an unforeseen personal and family emergency that disrupted my ordinary billing routines. The moment I recognized this oversight, I promptly brought the account current in full, and I have maintained a consecutive, flawless on-time payment record ever since.

Because this isolated mark represents an anomaly in my overall history and does not reflect my ongoing creditworthiness, I am humbly requesting a one-time "Goodwill Adjustment" to update the late mark to "Paid On Time" or delete the late reporting notation from my file.

I am preparing to apply for significant life financing (such as a mortgage) in the near future, and this goodwill gesture would make an extraordinary positive impact on my family's financial future.

Thank you deeply for your time, understanding, and gracious consideration.

Warm regards,

__________________________________________
${profile.name}
${profile.email}`,
      enclosures: [
        "Proof of subsequent consecutive on-time payments",
        "Copy of Driver's License",
      ],
    };
  }

  if (type === 'pay_for_delete') {
    const offer = settlementOfferAmount || Math.round(item.balance * 0.45);
    return {
      type,
      title: 'Pay-For-Delete Settlement Agreement',
      recipientBureau: bureau,
      subject: `OFFER OF SETTLEMENT IN FULL WITH MUTUAL AGREEMENT FOR TRADE-LINE DELETION: ${item.accountNumberMasked}`,
      legalNotice: 'This letter constitutes an offer under Federal Rule of Evidence 408 and is not an admission of liability or validity.',
      body: `${profile.name}
${profile.address}
${profile.cityStateZip}

Date: ${currentDate}

SENT VIA USPS CERTIFIED MAIL

Collections / Compliance Division
${item.accountName}

RE: Compromise Settlement & Full Deletion Agreement
Account Number: ${item.accountNumberMasked}
Original Creditor: ${item.originalCreditor}
Alleged Balance: $${item.balance}

To Whom It May Concern:

This letter is a formal offer to compromise and settle the above-referenced account. This letter does not constitute an admission of liability, validity, or ownership of the alleged debt.

I am prepared to offer an immediate single lump-sum payment of $${offer}.00 as full and final satisfaction of this account, subject to the following explicit written covenants:

1. ${item.accountName} agrees that upon receipt of the agreed sum of $${offer}.00, the account shall be deemed satisfied in full, and no remaining balance or deficiency shall ever be pursued, sold, or transferred.
2. ${item.accountName} agrees to submit a formal universal deletion request (Code 01 / Delete Tradeline) to all nationwide consumer credit bureaus (Equifax, Experian, TransUnion) within ten (10) business days of funds receipt, removing all historical reporting of this account entirely.
3. Neither party will report this account as "paid collection" or "settled for less than full balance", but will rather remove the trade-line completely.

If this mutual agreement is acceptable to your office, please have an authorized representative sign the duplicate copy of this letter on company letterhead and return it to my address above. Upon receipt of your signed confirmation, I will remit a cashier's check for $${offer}.00 within 5 business days.

Thank you for your professionalism.

Respectfully,

__________________________________________
${profile.name}
${profile.email}`,
      enclosures: [
        "Pre-drafted Mutual Settlement Sign-off page",
      ],
    };
  }

  // Default: FCRA Section 609 Formal Verification Letter
  return {
    type: 'fcra_609',
    title: 'FCRA Section 609 / 611 Formal Verification Demand',
    recipientBureau: bureau,
    subject: `FORMAL REQUEST FOR VERIFICATION UNDER FCRA 15 U.S.C. § 1681i - Account ${item.accountNumberMasked}`,
    legalNotice: 'Under Section 609 & 611 of the Fair Credit Reporting Act, consumer reporting agencies are legally obligated to conduct a reasonable investigation and provide physical proof of verification within 30 statutory days.',
    body: `${profile.name}
${profile.address}
${profile.cityStateZip}
SSN: XXX-XX-${profile.ssnLast4}

Date: ${currentDate}

SENT VIA USPS CERTIFIED MAIL WITH RETURN RECEIPT REQUESTED

${bureau.department}
${bureau.address}
${bureau.cityStateZip}

RE: FORMAL VERIFICATION REQUEST UNDER FAIR CREDIT REPORTING ACT
Account Name: ${item.accountName}
Original Creditor: ${item.originalCreditor}
Account Number (Masked): ${item.accountNumberMasked}

To the Consumer Dispute Officer:

I am exercising my rights under the Fair Credit Reporting Act, 15 U.S.C. § 1681g (Section 609) and 15 U.S.C. § 1681i (Section 611), to formally dispute the accuracy and validity of the above-referenced account appearing on my credit disclosure.

I have reason to believe this information is inaccurate, unverified, and incomplete. 

Under federal statute, you are required to conduct a reasonable reinvestigation within thirty (30) days of receipt of this notice. Merely performing an automated electronic verification (e-OSCAR check) does not satisfy the statutory mandate for reasonable reinvestigation (Cushman v. Trans Union Corp., 115 F.3d 220).

I formally demand that you provide verifiable documentary evidence verifying this account, specifically:
1. A copy of the original signed consumer credit contract or promissory agreement bearing my signature.
2. The complete accounting ledger detailing the date of first delinquency (DOFD) and calculation of all fees and charges.
3. The name, title, and contact details of the certifying furnisher who validated this account.

If ${bureau.name} cannot verify this tradeline with complete, original documentary proof within the mandatory thirty (30) day timeframe, federal law mandates that this item be immediately and permanently expunged from my credit profile.

Please forward an updated copy of my consumer credit report reflecting the deletion or correction once concluded.

Sincerely,

__________________________________________
${profile.name}
Phone / Email: ${profile.email}`,
    enclosures: [
      "Legible photocopy of State Driver's License",
      "Recent Utility Bill showing full name and verified mailing address",
      "Copy of Social Security Card (redacted except last 4 digits)",
    ],
  };
}
