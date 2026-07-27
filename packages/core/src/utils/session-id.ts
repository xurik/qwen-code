/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */

export const SESSION_ID_MAX_LENGTH = 128;

const UUID_PATTERN =
  '[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
const SESSION_ID_PATTERN = new RegExp(
  `^${UUID_PATTERN}(?:-agent-[a-z0-9_.-]+)?$`,
  'i',
);
const LEGACY_SESSION_ID_PATTERN = /^[0-9a-f-]{32,36}$/i;

export function isValidSessionId(value: string): boolean {
  return (
    value.length <= SESSION_ID_MAX_LENGTH && SESSION_ID_PATTERN.test(value)
  );
}

export function isValidSessionFileName(value: string): boolean {
  if (!value.endsWith('.jsonl')) return false;
  const sessionId = value.slice(0, -'.jsonl'.length);
  return (
    LEGACY_SESSION_ID_PATTERN.test(sessionId) || isValidSessionId(sessionId)
  );
}
