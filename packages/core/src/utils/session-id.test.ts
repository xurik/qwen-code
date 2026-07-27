/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it } from 'vitest';
import {
  isValidSessionFileName,
  isValidSessionId,
  SESSION_ID_MAX_LENGTH,
} from './session-id.js';

const UUID = '123e4567-e89b-12d3-a456-426614174000';

describe('session id validation', () => {
  it('accepts standard and bounded agent session ids', () => {
    expect(isValidSessionId(UUID)).toBe(true);
    expect(
      isValidSessionId(
        `${UUID}-agent-${'a'.repeat(SESSION_ID_MAX_LENGTH - 43)}`,
      ),
    ).toBe(true);
  });

  it('rejects overlong and unsafe agent suffixes', () => {
    expect(
      isValidSessionId(
        `${UUID}-agent-${'a'.repeat(SESSION_ID_MAX_LENGTH - 42)}`,
      ),
    ).toBe(false);
    expect(isValidSessionId(`${UUID}-agent-a/b`)).toBe(false);
  });

  it('recognizes agent session files without hiding legacy files', () => {
    expect(isValidSessionFileName(`${UUID}-agent-worker.1.jsonl`)).toBe(true);
    expect(
      isValidSessionFileName('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.jsonl'),
    ).toBe(true);
    expect(isValidSessionFileName('../session.jsonl')).toBe(false);
  });
});
