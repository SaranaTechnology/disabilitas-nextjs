import { describe, it, expect } from 'vitest';

// Password validation logic (will be extracted to shared util)
function validatePassword(password: string): { valid: boolean; errors: string[] } {
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
    errors.push('Minimal 1 karakter spesial');
  }

  return { valid: errors.length === 0, errors };
}

describe('Password Validation', () => {
  it('should reject empty password', () => {
    const result = validatePassword('');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Minimal 8 karakter');
  });

  it('should reject short password', () => {
    const result = validatePassword('Abc1!');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Minimal 8 karakter');
  });

  it('should reject password without uppercase', () => {
    const result = validatePassword('password1!');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Minimal 1 huruf besar');
  });

  it('should reject password without number', () => {
    const result = validatePassword('Password!');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Minimal 1 angka');
  });

  it('should reject password without special character', () => {
    const result = validatePassword('Password1');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Minimal 1 karakter spesial');
  });

  it('should accept valid strong password', () => {
    const result = validatePassword('MyPassword1!');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should accept password with various special chars', () => {
    expect(validatePassword('Test1234@').valid).toBe(true);
    expect(validatePassword('Test1234#').valid).toBe(true);
    expect(validatePassword('Test1234$').valid).toBe(true);
  });
});
