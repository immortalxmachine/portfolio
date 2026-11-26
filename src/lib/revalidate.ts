/**
 * Constant-time-ish comparison of the provided revalidation secret against the
 * configured one. Pure and unit-tested. If no secret is configured, access is
 * denied (fail closed).
 */
export function isValidSecret(
  provided: string | null | undefined,
  expected: string | undefined,
): boolean {
  if (!expected || !provided) return false;
  if (provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
