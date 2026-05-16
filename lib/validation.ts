export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('Minimal 6 karakter');
  }

  return { valid: errors.length === 0, errors };
}
