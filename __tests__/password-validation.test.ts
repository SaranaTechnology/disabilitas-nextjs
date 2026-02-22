import { describe, it, expect } from 'vitest';
import { validatePassword } from '@/lib/validation';

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
