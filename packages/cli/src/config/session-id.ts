/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Accepts a standard UUID, or a UUID followed by `-agent-{suffix}` for
 * deterministic Arena agent sessions.
 */
export function isValidSessionId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}(-agent-[a-zA-Z0-9_.-]+)?$/i.test(
    value,
  );
}
