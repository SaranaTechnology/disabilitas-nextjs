export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Minimal 8 karakter');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Minimal 1 huruf besar');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Minimal 1 angka');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Minimal 1 karakter spesial (!@#$%...)');
  }

  return { valid: errors.length === 0, errors };
}
