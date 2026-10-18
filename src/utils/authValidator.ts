/**
 * Strict Email & Strong Password Validator for CHIDONIQ Sovereign Vault
 * Fully supports valid Google Gmail accounts and authentic personal/business domains.
 * Blocks fake, disposable, and temporary emails.
 * Enforces strong passwords with instant feedback.
 */

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  'guerrillamail.com',
  'yopmail.com',
  'trashmail.com',
  'getairmail.com',
  'throwawaymail.com',
  'fakemailgenerator.com',
  'dispostable.com',
  'sharklasers.com',
  'generator.email',
  'inboxkitten.com',
  'mytemp.email',
  'crazymailing.com',
  'burnermail.io',
  'mohmal.com',
  'fakeinbox.com',
  'maildrop.cc',
  'nada.ltd',
  'getnada.com',
  'discard.email',
  'trashmail.net',
  'tempail.com',
  'fakemail.net',
]);

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Weak' | 'Fair' | 'Good' | 'Strong';
  hasMinLength: boolean;
  hasLetter: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

/**
 * Check if the email is a valid Google Gmail address
 */
export function isGoogleGmail(email: string): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return clean.endsWith('@gmail.com') || clean.endsWith('@googlemail.com');
}

/**
 * Validate that an email is a real, authentic email address.
 * Fully supports valid Google Gmail accounts (@gmail.com, @googlemail.com) and real domains.
 * Strictly rejects fake, disposable, and garbage emails.
 */
export function validateRealEmail(rawEmail: string): ValidationResult {
  if (!rawEmail || typeof rawEmail !== 'string') {
    return { valid: false, error: 'Email address is required.' };
  }

  const email = rawEmail.trim().toLowerCase();

  // Basic RFC compliant structure check
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(email)) {
    return { 
      valid: false, 
      error: 'Please enter a valid email address (e.g. name@gmail.com).' 
    };
  }

  const parts = email.split('@');
  if (parts.length !== 2) {
    return { valid: false, error: 'Invalid email address format.' };
  }

  const [localPart, domain] = parts;

  // Username must be at least 3 characters
  if (localPart.length < 3) {
    return { 
      valid: false, 
      error: 'Email username must be at least 3 characters long.' 
    };
  }

  // Reject disposable temporary email domains
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { 
      valid: false, 
      error: 'Temporary or disposable email domains are not allowed. Please use your real Google Gmail or authentic personal email.' 
    };
  }

  // Obvious fake domains
  const fakeDomains = ['test.com', 'fake.com', 'example.com', 'none.com', 'invalid.com', 'dummy.com', 'asdf.com', 'foobar.com'];
  if (fakeDomains.includes(domain)) {
    return { 
      valid: false, 
      error: 'Please enter a real email address registered with Google Gmail or a valid provider.' 
    };
  }

  // Obvious fake exact usernames (only for non-gmail or exact pure garbage)
  if (['fake', 'asdf', 'qwerty', 'nobody', 'noone'].includes(localPart)) {
    return {
      valid: false,
      error: 'Please enter your genuine personal or Google Gmail address.',
    };
  }

  // Domain TLD check (must have at least 2 chars, e.g. .com, .ng, .org, .edu, .io)
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
    return { 
      valid: false, 
      error: 'Please enter an email with a valid domain extension (e.g. gmail.com).' 
    };
  }

  return { valid: true };
}

/**
 * Calculate password strength metrics
 */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      label: 'Weak',
      hasMinLength: false,
      hasLetter: false,
      hasNumber: false,
      hasSpecial: false,
    };
  }

  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  let score = 0;
  if (hasMinLength) score++;
  if (hasLetter) score++;
  if (hasNumber) score++;
  if (hasSpecial || password.length >= 12) score++;

  let label: 'Weak' | 'Fair' | 'Good' | 'Strong' = 'Weak';
  if (score === 2) label = 'Fair';
  else if (score === 3) label = 'Good';
  else if (score >= 4) label = 'Strong';

  return {
    score,
    label,
    hasMinLength,
    hasLetter,
    hasNumber,
    hasSpecial,
  };
}

/**
 * Validate that a password satisfies strong security criteria:
 * - Minimum 8 characters
 * - Contains at least one letter (a-z, A-Z)
 * - Contains at least one number (0-9) or special symbol
 * - Not a trivial sequence
 */
export function validateStrongPassword(password: string): ValidationResult {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'A strong password is required.' };
  }

  if (password.length < 8) {
    return { 
      valid: false, 
      error: 'Strong password required: minimum 8 characters long.' 
    };
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  if (!hasLetter || !hasNumberOrSymbol) {
    return { 
      valid: false, 
      error: 'Strong password required: must contain both letters and numbers.' 
    };
  }

  const commonWeak = ['12345678', 'password', 'qwerty123', 'password1', '123456789', 'admin123', 'iloveyou', 'password123'];
  if (commonWeak.includes(password.toLowerCase())) {
    return { 
      valid: false, 
      error: 'This password is too common. Please create a unique strong password.' 
    };
  }

  return { valid: true };
}
