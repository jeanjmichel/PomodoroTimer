import { z } from 'zod';

import { MAX_CUSTOM_SECONDS, MIN_CUSTOM_SECONDS } from './timer.constants';
import type { TimerValidationResult } from './timer.types';

const customDurationSchema = z.object({
  minutes: z.number().int().min(0).max(119),
  seconds: z.number().int().min(0).max(59),
});

export function validateCustomDuration(raw: unknown): TimerValidationResult {
  const result: TimerValidationResult = { isValid: false, errors: [] };

  const parsed = customDurationSchema.safeParse(raw);

  if (!parsed.success) {
    result.errors.push('Custom duration must include valid minute and second values.');
    return result;
  }

  const totalSeconds = parsed.data.minutes * 60 + parsed.data.seconds;

  if (totalSeconds < MIN_CUSTOM_SECONDS) {
    result.errors.push(`Custom duration must be at least ${Math.ceil(MIN_CUSTOM_SECONDS / 60)} minute(s).`);
  }

  if (totalSeconds > MAX_CUSTOM_SECONDS) {
    result.errors.push(`Custom duration must not exceed ${Math.floor(MAX_CUSTOM_SECONDS / 60)} minute(s) and ${MAX_CUSTOM_SECONDS % 60} second(s).`);
  }

  if (result.errors.length === 0) {
    result.isValid = true;
  }

  return result;
}

export function normalizeCustomDuration(raw: unknown): number {
  const parsed = customDurationSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error('Custom duration input is invalid.');
  }

  return parsed.data.minutes * 60 + parsed.data.seconds;
}
