import React, { useState } from 'react';
import { CreditProfile } from '../types/credit';
import { 
  Scale, 
  ShieldAlert, 
  PhoneCall, 
  Compass, 
  Copy, 
  Printer, 
  Check, 
  FileText, 
  AlertCircle,
  BookOpen
} from 'lucide-react';

interface LegalDisputeToolkitTabProps {
  profile: CreditProfile;
}

export const LegalDisputeToolkitTab: React.FC<LegalDisputeToolkitTabProps> = ({ profile }) => {
  const [activeSubTool, setActiveSubTool] = useState<'dispute' | 'decode' | 'negotiate' | 'rules'>('dispute');

  // Tool 1: Dispute Letter Builder State
  const [bureau, setBureau] = useState<'Experian' | 'TransUnion' | 'Equifax'>('Experian');
  const [creditorName, setCreditorName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [balance, setBalance] = useState('');
  const [disputeCategory, setDisputeCategory] = useState<
    'medical' | 'obsolete' | 'inquiry' | 'unverified' | 'inaccurate_late' | 'identity_theft' | 'goodwill'
  >('medical');
  const [disputeNotes, setDisputeNotes] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [copiedLetter, setCopiedLetter] = useState(false);

  // Tool 2: Bureau Stall Decoder State
  const [selectedStallTactic, setSelectedStallTactic] = useState<
    'eoscar_verified' | 'frivolous' | 'id_stall' | 'updated_date' | 'exceeded_30_days'
  >('eoscar_verified');
  const [copiedEscalation, setCopiedEscalation] = useState(false);

  // Tool 3: Debt Settlement Calculator State
  const [debtAmount, setDebtAmount] = useState<string>('1200');
  const [debtAgeYears, setDebtAgeYears] = useState<string>('2');
  const [stateOfResidence, setStateOfResidence] = useState<string>('Texas');
  const [copiedScript, setCopiedScript] = useState(false);

  // Bureau Mailing Addresses
  const bureauAddresses: Record<string, string> = {
    Experian: 'Experian Consumer Dispute Center\nP.O. Box 4500\nAllen, TX 75013',
    TransUnion: 'TransUnion Consumer Solutions\nP.O. Box 2000\nChester, PA 19016',
    Equifax: 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Generate legal dispute letter deterministically
  const handleGenerateDisputeLetter = (e: React.FormEvent) => {
    e.preventDefault();

    let legalGrounds = '';
    let demandAction = '';

    if (disputeCategory === 'medical') {
      legalGrounds = `1. CFPB NATIONWIDE MEDICAL DEBT RULE: Under current federal guidelines and joint Consumer Reporting Agency directives, medical collection debt with an original or reporting balance under $500 is categorically prohibited from appearing on consumer credit disclosures. The reported balance of $${balance || '0'} falls squarely within this mandatory suppression threshold.`;
      demandAction = 'Because federal directives prohibit the reporting of medical collections below $500, this account is unreportable as a matter of law. I demand the immediate and permanent deletion of this tradeline from my consumer file within thirty (30) days.';
    } else if (disputeCategory === 'obsolete') {
      legalGrounds = `1. FCRA 15 U.S.C. § 1681c (SECTION 605 OBSOLETE INFORMATION): Under federal statute, adverse information, collections, and charge-offs cannot be reported beyond seven (7) years from the original Date of First Delinquency (DOFD). Re-aging this account by updating the reporting date or transfer date violates federal law.`;
      demandAction = 'The statutory 7-year obsolescence period has elapsed. Continued reporting of this tradeline constitutes a willful non-compliance violation under 15 U.S.C. § 1681n. Immediately purge and suppress this account.';
    } else if (disputeCategory === 'inquiry') {
      legalGrounds = `1. FCRA 15 U.S.C. § 1681b (PERMISSIBLE PURPOSE): Under Section 604 of the Fair Credit Reporting Act, consumer reporting agencies may furnish consumer reports only under strict permissible statutory purposes. I did not provide explicit written authorization for this entity to initiate a hard inquiry against my file.`;
      demandAction = 'Demand that the furnisher provide physical documentary evidence of written authorization and permissible purpose. If proof cannot be provided within 30 days, delete this hard inquiry immediately.';
    } else if (disputeCategory === 'unverified') {
      legalGrounds = `1. FCRA 15 U.S.C. § 1681i (REASONABLE REINVESTIGATION MANDATE): Under Cushman v. Trans Union Corp., 115 F.3d 220, your agency is mandated to conduct a meaningful, physical reinvestigation of disputed items. Merely transmitting automated two-digit electronic computer codes through e-OSCAR without verifying original signed contracts or source documentation fails the federal standard of a reasonable reinvestigation.`;
      demandAction = 'I demand that you either produce verifiable original documentation bearing my physical signature or permanently delete this tradeline from my consumer disclosure within thirty (30) calendar days.';
    } else if (disputeCategory === 'inaccurate_late') {
      legalGrounds = `1. FCRA 15 U.S.C. § 1681s-2 (FURNISHER ACCURACY DUTIES): Furnishers are legally prohibited from reporting information they know or have reasonable cause to believe is inaccurate. The late payment notation reported on this account is incorrect and contradicts the underlying payment records.`;
      demandAction = 'I demand that you verify the exact accounting ledgers for the disputed billing cycles with the furnisher or update this account to reflect "Paid As Agreed / Current" with zero late notations.';
    } else if (disputeCategory === 'identity_theft') {
      legalGrounds = `1. FCRA 15 U.S.C. § 1681c-2 (SECTION 605B BLOCK OF INFORMATION RESULTING FROM IDENTITY THEFT): I have notified your agency that this account is fraudulent and resulted from unauthorized identity theft. By federal statute, consumer reporting agencies must block information identified by the consumer within four (4) business days of receipt of notice.`;
      demandAction = 'Block and suppress this fraudulent account within four (4) business days as required by 15 U.S.C. § 1681c-2.';
    } else {
      legalGrounds = `1. GOODWILL COURTESY REQUEST: I am writing to respectfully request a goodwill adjustment regarding a one-time late payment mark. I have maintained a consistent on-time payment track record across this account, and request that you submit an automated Universal Data Deletion to remove the solitary late remark.`;
      demandAction = 'I respectfully ask that as a gesture of customer goodwill, your office submit a deletion update (Code 01) to Experian, TransUnion, and Equifax.';
    }

    const letter = `${profile.name || '[Your Full Name]'}
${profile.address || '[Your Street Address]'}
${profile.cityStateZip || '[City, State ZIP]'}
SSN: XXX-XX-${profile.ssnLast4 || 'XXXX'}

Date: ${currentDate}

SENT VIA USPS CERTIFIED MAIL WITH RETURN RECEIPT REQUESTED

${bureauAddresses[bureau]}

RE: FORMAL NOTICE OF DISPUTE PURSUANT TO 15 U.S.C. § 1681i (FCRA SECTION 611)
Creditor / Agency Name: ${creditorName || '[Creditor Name]'}
Account Number: ${accountNumber || '[Account Number / Masked]'}
Reported Balance: $${balance || '0'}

To the Compliance & Consumer Reinvestigation Division:

I am exercising my statutory rights under Section 609 (15 U.S.C. § 1681g) and Section 611 (15 U.S.C. § 1681i) of the Fair Credit Reporting Act to formally dispute the accuracy and validity of the above-referenced account appearing on my credit disclosure.

SPECIFIC FACTUAL AND STATUTORY GROUNDS:
${legalGrounds}

${disputeNotes ? `ADDITIONAL CONSUMER STATEMENT:\n"${disputeNotes}"\n` : ''}
REQUIRED ACTION:
${demandAction}

Under federal law (15 U.S.C. § 1681i(a)(1)), your agency has thirty (30) calendar days from receipt of this notice to complete your reinvestigation and furnish written notice of the results. If this item cannot be physically verified with original contract documentation, Section 611(a)(5)(A) mandates its prompt deletion.

Sincerely,

__________________________________________
${profile.name || '[Your Full Name]'}

ENCLOSURES ATTACHED FOR IDENTITY VERIFICATION:
1. Copy of Government-Issued Photo Identification (Driver's License / State ID)
2. Copy of Proof of Address (Recent Utility Bill / Bank Statement)
3. Documentation / Supporting Records (if applicable)`;

    setGeneratedLetter(letter);
  };

  // Bureau Stall Decoder Data
  const stallTacticsData = {
    eoscar_verified: {
      title: 'Generic "We Verified With Furnisher via e-OSCAR" Stall',
      description: 'The credit bureau sent an automated letter claiming the creditor verified the information, without providing copies of the contract or investigating original source files.',
      violation: 'FCRA § 611(a)(6)(B)(iii) & Cushman v. Trans Union Corp. Under federal law, the consumer is entitled to the Method of Verification (MOV). Merely forwarding a computer code through e-OSCAR does not meet the legal standard of a reasonable reinvestigation.',
      escalationDemand: `DEMAND FOR METHOD OF VERIFICATION PURSUANT TO 15 U.S.C. § 1681i(a)(6)(B)(iii)

To: ${bureauAddresses[bureau]}

RE: FORMAL DEMAND FOR METHOD OF VERIFICATION
Disputed Account: ${creditorName || '[Account Name]'}

I am in receipt of your correspondence stating that you have "verified" my disputed account. Under Section 611(a)(6)(B)(iii) of the Fair Credit Reporting Act (15 U.S.C. § 1681i), I hereby formally demand that you provide in writing:
1. The business name, physical address, and telephone number of every individual contacted to verify this alleged debt.
2. The specific original documentation reviewed that confirms the legal validity of the reporting.

Under federal statute, you are required to furnish this Method of Verification within fifteen (15) days. If your agency cannot produce this verifiable method of proof, you must immediately delete the tradeline from my consumer file.`,
    },
    frivolous: {
      title: 'Bureau Deemed Dispute "Frivolous or Irrelevant"',
      description: 'The bureau dismissed your dispute under Section 611(a)(3), often claiming you used a template or failed to provide sufficient information.',
      violation: 'FCRA § 611(a)(3)(B). Bureaus may not deem a dispute frivolous unless they specifically identify what information is missing. Blanket rejections violate federal law.',
      escalationDemand: `NOTICE OF IMPROPER FRIVOLOUS DETERMINATION & NOTICE OF INTENT TO SUE

To: ${bureauAddresses[bureau]}

RE: IMPROPER FRIVOLOUS CLASSIFICATION OF DISPUTE

I am in receipt of your notice refusing to investigate my dispute under the pretext that it is "frivolous or irrelevant." Under 15 U.S.C. § 1681i(a)(3)(B), if a consumer reporting agency terminates an investigation, it MUST notify the consumer within five (5) business days and state the SPECIFIC reasons why the dispute was deemed frivolous.

Your boilerplate response failed to provide statutory grounds. I have provided clear factual discrepancies. You are legally required to complete a reinvestigation or face formal complaints with the Consumer Financial Protection Bureau (CFPB) and legal claims for willful non-compliance under FCRA § 616.`,
    },
    id_stall: {
      title: 'Demanding Excessive ID & Utility Bills (Identity Stall)',
      description: 'The bureau demands that you re-send your driver\'s license, utility bill, or social security card within 10 days to delay the 30-day statutory clock.',
      violation: 'FCRA § 611(a)(1). Bureaus frequently use ID requests as an unlawful delay mechanism. The 30-day investigation clock begins upon initial delivery of the dispute.',
      escalationDemand: `NOTICE REGARDING STATUTORY TIMELINE AND IDENTITY VERIFICATION

To: ${bureauAddresses[bureau]}

RE: INADMISSIBLE DELAY TACTIC – STATUTORY 30-DAY CLOCK REMAINS ACTIVE

I am in receipt of your letter requesting redundant identity documentation. My original dispute enclosed legitimate government-issued photo identification and proof of address.

Please be advised that under 15 U.S.C. § 1681i(a)(1), your thirty (30) calendar day statutory clock began on the date my original dispute was delivered to your facility via USPS Certified Mail. Requests for redundant identity documents do not toll or pause the 30-day statutory deadline. You must complete your investigation by the original statutory date or purge the tradeline.`,
    },
    updated_date: {
      title: 'Creditor Simply Updated Date / Balance (Re-Aging)',
      description: 'The creditor updated the date of reporting or last activity, artificially extending the negative item on your credit file.',
      violation: 'FCRA § 605(c) / 15 U.S.C. § 1681c. The 7-year obsolescence clock runs strictly from the Date of First Delinquency (DOFD) and can NEVER be legally re-aged by selling or updating the account.',
      escalationDemand: `FORMAL COMPLAINT: ILLEGAL RE-AGING OF OBSOLETE ACCOUNT

To: ${bureauAddresses[bureau]}

RE: WILLFUL RE-AGING VIOLATION UNDER 15 U.S.C. § 1681c

Your recent disclosure reflects an updated reporting date on an account that originated over seven (7) years ago. Under FCRA Section 605(c), the 7-year obsolescence period is strictly calculated from the commencement of the delinquency that preceded the collection or charge-off.

Updating the date of report or assignment to artificially prolong negative reporting is an actionable federal violation. Remove this obsolete tradeline immediately.`,
    },
    exceeded_30_days: {
      title: 'Bureau Failed to Respond Within 30 Statutory Days',
      description: 'Thirty calendar days have elapsed since the bureau received your USPS Certified Mail delivery, and no written reinvestigation results have arrived.',
      violation: 'FCRA § 611(a)(5)(A). By federal statute, if an item is not verified within 30 days, the bureau MUST permanently delete it. Failure to do so incurs statutory damages up to $1,000 per violation under FCRA § 616.',
      escalationDemand: `FINAL DEMAND FOR IMMEDIATE DELETION: 30-DAY STATUTORY DEADLINE EXPIRED

To: ${bureauAddresses[bureau]}

RE: MANDATORY DELETION UNDER 15 U.S.C. § 1681i(a)(5)(A)
USPS Certified Mail Delivery Date: [Insert Certified Mail Delivery Date]
Tracking Number: [Insert Tracking Number]

More than thirty (30) calendar days have elapsed since your office received my formal dispute via USPS Certified Mail. Under Section 611(a)(5)(A) of the Fair Credit Reporting Act, if disputed information cannot be verified within the statutory 30-day period, the consumer reporting agency MUST promptly delete that item of information from the file of the consumer.

Your statutory investigation window has closed. You have no legal discretion to maintain this tradeline. Delete this account immediately and send confirmation of deletion within five (5) business days.`,
    },
  };

  const selectedStall = stallTacticsData[selectedStallTactic];

  // Debt Settlement Calculations
  const numericDebt = parseFloat(debtAmount) || 0;
  const anchorOffer = Math.round(numericDebt * 0.25);
  const targetOffer = Math.round(numericDebt * 0.40);
  const ceilingOffer = Math.round(numericDebt * 0.50);
  const savings = Math.max(0, numericDebt - targetOffer);

  return (
    <div className="space-y-8 pb-8">
      {/* 1. Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>Federal Consumer Rights Toolkit</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Legal Dispute &amp; Debt Settlement Toolkit
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Standardized statutory generators grounded in the Fair Credit Reporting Act (15 U.S.C. § 1681) and CFPB regulations. Build formal certified mail dispute letters, decode bureau stall tactics, and calculate cash debt settlements.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-lg self-start md:self-center border border-slate-700">
            <span className="text-[11px] font-mono-numeric font-medium text-emerald-400 px-2 py-0.5">
              100% Client-Side &amp; Private
            </span>
          </div>
        </div>

        {/* Sub-tool Segmented Control */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTool('dispute')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTool === 'dispute'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Dispute Letter Builder</span>
          </button>

          <button
            onClick={() => setActiveSubTool('decode')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTool === 'decode'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Bureau Stall Decoder</span>
          </button>

          <button
            onClick={() => setActiveSubTool('negotiate')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTool === 'negotiate'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Debt Settlement Calculator</span>
          </button>

          <button
            onClick={() => setActiveSubTool('rules')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTool === 'rules'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>FCRA Consumer Rights Guide</span>
          </button>
        </div>
      </div>

      {/* 2. SUB-TOOL: DISPUTE LETTER BUILDER */}
      {activeSubTool === 'dispute' && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6 transition-colors">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Official FCRA Section 609 Legal Dispute Letter Builder</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select your legal dispute ground and enter the account details. Generates an attorney-standard formal letter formatted for USPS Certified Mail with Return Receipt.
            </p>
          </div>

          <form onSubmit={handleGenerateDisputeLetter} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Target Credit Bureau</label>
                <select
                  value={bureau}
                  onChange={(e) => setBureau(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-2 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Experian">Experian (Allen, TX)</option>
                  <option value="TransUnion">TransUnion (Chester, PA)</option>
                  <option value="Equifax">Equifax (Atlanta, GA)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Creditor / Collection Agency</label>
                <input
                  type="text"
                  placeholder="e.g. Portfolio Recovery / Mercy Hospital"
                  value={creditorName}
                  onChange={(e) => setCreditorName(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-750"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Account Number (or Masked)</label>
                <input
                  type="text"
                  placeholder="e.g. 4912XXXX"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-750"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Reported Balance ($)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono-numeric focus:bg-white dark:focus:bg-slate-750"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Legal Dispute Category</label>
                <select
                  value={disputeCategory}
                  onChange={(e) => setDisputeCategory(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-2 text-slate-900 dark:text-white font-medium"
                >
                  <option value="medical">CFPB Medical Debt Exemption (&lt; $500 balance prohibited)</option>
                  <option value="obsolete">FCRA § 605 Obsolete Information (Exceeds 7-year statutory limit)</option>
                  <option value="inquiry">FCRA § 604 Impermissible Hard Inquiry (No written consent)</option>
                  <option value="unverified">FCRA § 611 / Cushman v. Trans Union (Unverified Tradeline)</option>
                  <option value="inaccurate_late">FCRA § 623 Inaccurate Late Mark / Contradicting Ledger</option>
                  <option value="identity_theft">FCRA § 605B Identity Theft Block Request</option>
                  <option value="goodwill">Goodwill Courtesy Deletion Request (On-time history)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Additional Consumer Statement / Specific Facts (Optional):
              </label>
              <textarea
                rows={3}
                placeholder="Include any specific details (e.g. 'I was hospitalized during Hurricane Helene', 'The insurance paid the claim in full', etc.)..."
                value={disputeNotes}
                onChange={(e) => setDisputeNotes(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-750 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Formats formal USPS Certified Mail header with bureau address &amp; signature line
              </span>

              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Generate Official Dispute Letter</span>
              </button>
            </div>
          </form>

          {generatedLetter && (
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Generated Dispute Letter Document
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedLetter);
                      setCopiedLetter(true);
                      setTimeout(() => setCopiedLetter(false), 2000);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedLetter ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLetter ? 'Copied' : 'Copy Letter'}</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Print Letter</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-6 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto shadow-inner">
                {generatedLetter}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 3. SUB-TOOL: BUREAU STALL DECODER */}
      {activeSubTool === 'decode' && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6 transition-colors">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Credit Bureau Stall Tactic &amp; Rejection Decoder</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select the response or delay tactic received from Experian, TransUnion, or Equifax to view the statutory violation and generate your formal escalation demand.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Select Bureau Response Letter Tactic:
              </label>
              <select
                value={selectedStallTactic}
                onChange={(e) => setSelectedStallTactic(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-semibold"
              >
                <option value="eoscar_verified">1. Generic "We Verified With Creditor via e-OSCAR" (No Documents)</option>
                <option value="frivolous">2. "Your Dispute Has Been Deemed Frivolous or Irrelevant"</option>
                <option value="id_stall">3. Demanding Excessive ID &amp; Utility Bills (Identity Stall Tactic)</option>
                <option value="updated_date">4. Creditor Simply Updated Reporting Date (Re-Aging Obsolete Debt)</option>
                <option value="exceeded_30_days">5. Bureau Failed to Respond Within 30 Statutory Calendar Days</option>
              </select>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-white text-sm block">
                  {selectedStall.title}
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedStall.description}
                </p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-900 dark:text-amber-300 space-y-1">
                <span className="font-bold text-amber-950 dark:text-amber-200 block">Applicable Federal Violation:</span>
                <p className="leading-relaxed">
                  {selectedStall.violation}
                </p>
              </div>
            </div>

            {/* Escalation Letter */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Formal Escalation Demand Letter
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedStall.escalationDemand);
                    setCopiedEscalation(true);
                    setTimeout(() => setCopiedEscalation(false), 2000);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedEscalation ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedEscalation ? 'Copied' : 'Copy Escalation Letter'}</span>
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-5 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
                {selectedStall.escalationDemand}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. SUB-TOOL: DEBT SETTLEMENT CALCULATOR */}
      {activeSubTool === 'negotiate' && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6 transition-colors">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Debt Settlement Calculator &amp; Phone Script Playbook</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Calculate realistic cash lump-sum settlement targets for collection accounts and view your word-for-word negotiation script.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Alleged Debt Balance ($)</label>
                <input
                  type="number"
                  min="0"
                  value={debtAmount}
                  onChange={(e) => setDebtAmount(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono-numeric font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Approximate Age of Debt (Years)</label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={debtAgeYears}
                  onChange={(e) => setDebtAgeYears(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono-numeric"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Your State of Residence</label>
                <input
                  type="text"
                  value={stateOfResidence}
                  onChange={(e) => setStateOfResidence(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Target Settlement Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-400 block uppercase font-bold">1. Initial Anchor Offer (25%)</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono-numeric block mt-1">
                  ${anchorOffer.toLocaleString()}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Your opening bid. Debt buyers purchased this paper for 4¢–8¢ on the dollar.
                </p>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-300 dark:border-emerald-800">
                <span className="text-[11px] text-emerald-800 dark:text-emerald-300 block uppercase font-bold">2. Realistic Target (40%)</span>
                <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono-numeric block mt-1">
                  ${targetOffer.toLocaleString()}
                </span>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-400 mt-1 font-semibold">
                  Saves you ${savings.toLocaleString()} in cash.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-400 block uppercase font-bold">3. Walk-Away Ceiling (50%)</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono-numeric block mt-1">
                  ${ceilingOffer.toLocaleString()}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Maximum payment threshold. Never exceed 50% for non-judgment collection debt.
                </p>
              </div>
            </div>

            {/* Warning Box */}
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg text-rose-900 dark:text-rose-200 text-xs space-y-1">
              <span className="font-bold text-rose-950 dark:text-rose-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Statute of Limitations Warning for {stateOfResidence}:</span>
              </span>
              <p className="leading-relaxed">
                Most states have a 3 to 6-year statute of limitations on written credit debt. <strong>CRITICAL</strong>: Never make even a $5 partial payment without a signed written settlement agreement, as an unconditioned payment can legally restart the statute of limitations clock.
              </p>
            </div>

            {/* Word for Word Script */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Verbatim Phone Negotiation Script
                </span>
                <button
                  onClick={() => {
                    const scriptText = `Script for Calling Debt Collector:
You: "Hello, I am calling regarding alleged reference number. I am not acknowledging liability or ownership of this debt, but I have a designated cash settlement budget of $${targetOffer} to settle this account in full today. I am willing to remit this immediately ONLY in exchange for a signed written agreement promising complete trade-line deletion from Equifax, Experian, and TransUnion."

Collector: "We cannot delete accounts, credit reporting is required by law."
You: "Under the Fair Credit Reporting Act, credit reporting is entirely voluntary. Furnishers have universal authority to request Universal Data Deletion (Code 01). If your agency is unwilling to furnish complete deletion in writing, I will allocate my cash settlement funds to another creditor. Please mail your decision in writing to my address."`;
                    navigator.clipboard.writeText(scriptText);
                    setCopiedScript(true);
                    setTimeout(() => setCopiedScript(false), 2000);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedScript ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedScript ? 'Copied' : 'Copy Script'}</span>
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-5 text-xs text-slate-800 dark:text-slate-200 space-y-3 leading-relaxed shadow-inner">
                <div>
                  <strong className="text-slate-900 dark:text-white block mb-0.5">Opening Statement:</strong>
                  <p className="italic bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                    "Hello, I am calling regarding alleged reference number. I am not acknowledging liability or ownership of this debt, but I have a designated cash settlement budget of <span className="font-bold font-mono-numeric text-emerald-700 dark:text-emerald-400">${targetOffer}</span> to settle this account in full today. I am willing to remit this immediately ONLY in exchange for a signed written agreement promising complete trade-line deletion from Equifax, Experian, and TransUnion."
                  </p>
                </div>

                <div>
                  <strong className="text-slate-900 dark:text-white block mb-0.5">When the Collector Claims They Cannot Delete:</strong>
                  <p className="italic bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                    "Under the Fair Credit Reporting Act, credit reporting is entirely voluntary. Data furnishers have universal authority under CDIA guidelines to submit Universal Data Deletion (Code 01). If your company is unwilling to provide complete deletion in writing, I will not allocate my settlement funds to this account. Send your decision in writing to my address."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. SUB-TOOL: FCRA CONSUMER RIGHTS GUIDE */}
      {activeSubTool === 'rules' && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4 text-xs text-slate-700 dark:text-slate-300 transition-colors">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Core Consumer Credit Laws Every American Must Know</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Federal statutes enacted by Congress to shield consumers from bureau negligence and creditor abuses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white block text-sm">
                FCRA 15 U.S.C. § 1681i — The 30-Day Clock
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                When you dispute an item with Experian, TransUnion, or Equifax, the bureau has exactly 30 calendar days to conduct a physical reinvestigation. If the item cannot be verified within 30 days, it MUST be permanently purged from your credit file.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white block text-sm">
                FCRA 15 U.S.C. § 1681c — 7-Year Obsolescence
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Late payments, collections, and charge-offs can only remain on your report for 7 years from the original Date of First Delinquency (DOFD). Any debt collector that updates the date to re-age the account is in willful statutory violation.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white block text-sm">
                FDCPA 15 U.S.C. § 1692g — Debt Validation
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Within 30 days of initial contact by a debt collector, you can demand written debt validation. The collector must cease all collection activity until they provide documentation verifying the debt amount and original creditor.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white block text-sm">
                CFPB 2023 Medical Debt Exemption Rule
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                All paid medical debts, as well as any unpaid medical collection debts with an initial balance under $500, are legally prohibited from appearing on consumer credit disclosures across all three major credit bureaus.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
