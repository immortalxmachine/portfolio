/**
 * Constant-time-ish comparison of the provided revalidation secret against the
 * configured one. Pure and unit-tested. If no secret is configured, access is
 * denied (fail closed).
 */
export function isValidSecret(
  provided: string | null | undefined,
  expected: string | undefined,
): boolean {
  // Trim so a stray trailing newline (common when setting env vars via CLI)
  // or query whitespace doesn't cause a false mismatch.
  const p = provided?.trim();
  const e = expected?.trim();
  if (!e || !p) return false;
  if (p.length !== e.length) return false;
  let diff = 0;
  for (let i = 0; i < e.length; i++) {
    diff |= p.charCodeAt(i) ^ e.charCodeAt(i);
  }
  return diff === 0;
}
