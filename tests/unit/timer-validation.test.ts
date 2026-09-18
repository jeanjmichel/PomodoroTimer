import { describe, expect, it } from 'vitest';

import { validateCustomDuration, normalizeCustomDuration } from '@/domain/timer/timer-validation';

describe('timer validation', () => {
  it('accepts a valid custom duration within the allowed range', () => {
    const result = validateCustomDuration({ minutes: 10, seconds: 30 });

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(normalizeCustomDuration({ minutes: 10, seconds: 30 })).toBe(630);
  });

  it('rejects durations below the minimum', () => {
    const result = validateCustomDuration({ minutes: 0, seconds: 30 });

    expect(result.isValid).toBe(false);
    expect(result.errors.join(' ')).toContain('at least');
  });

  it('rejects durations above the maximum', () => {
    const result = validateCustomDuration({ minutes: 119, seconds: 59 });

    expect(result.isValid).toBe(false);
    expect(result.errors.join(' ')).toContain('exceed');
  });
});
