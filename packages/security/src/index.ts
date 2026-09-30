export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function maskSensitiveData(input: string): string {
  if (!input) return '';
  let result = input;

  // Mask 16-digit credit card numbers (e.g. 1234-5678-9012-3456 or 1234567890123456)
  result = result.replace(
    /\b(?:\d{4}[ -]?){3}(\d{4})\b/g,
    '•••• •••• •••• $1'
  );

  // Mask OTPs / 6-digit verification codes following keywords
  result = result.replace(
    /(?:otp|code|verification code|pin|2fa)[:\s]+(\d{4,8})/gi,
    (match, code) => match.replace(code, '••••••')
  );

  // Mask password fields in json/key-value text
  result = result.replace(
    /(["']?(?:password|passcode|secret|api_key|token)["']?\s*[:=]\s*["']?)([^"',\s}]+)(["']?)/gi,
    '$1••••••••$3'
  );

  return result;
}

export function sanitizeCsvField(field: string | number | null | undefined): string {
  if (field === null || field === undefined) return '""';
  let str = String(field);

  // CSV Injection prevention: Prefix formula-starting characters (=, +, -, @, \t, \r) with an apostrophe
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  // Escape internal double quotes by doubling them
  str = str.replace(/"/g, '""');

  return `"${str}"`;
}

export function exportToSafeCsv<T extends Record<string, unknown>>(
  data: T[],
  headers: { key: keyof T; label: string }[]
): string {
  const headerRow = headers.map((h) => sanitizeCsvField(h.label)).join(',');
  const rows = data.map((row) =>
    headers.map((h) => sanitizeCsvField(row[h.key] as string | number)).join(',')
  );
  return [headerRow, ...rows].join('\r\n');
}

export function detectPromptInjection(text: string): { isInjected: boolean; reason?: string } {
  if (!text) return { isInjected: false };

  const suspiciousPatterns = [
    /ignore (?:all )?previous instructions/i,
    /system override/i,
    /forward (?:all )?(?:files|emails|data|credentials) to/i,
    /send (?:my |all )?(?:passwords|keys|secrets) to/i,
    /export (?:all )?contacts to/i,
    /reveal (?:the )?system prompt/i,
    /bypass security/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(text)) {
      return {
        isInjected: true,
        reason: `Potential prompt injection detected: matches security rule`,
      };
    }
  }

  return { isInjected: false };
}
