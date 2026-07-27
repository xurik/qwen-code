/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */

export {
  isValidSessionId,
  SESSION_ID_MAX_LENGTH,
} from '@qwen-code/qwen-code-core';

export const SESSION_ID_EXISTS_RPC_CODE = -32024;
export const SESSION_ID_EXISTS_ERROR_KIND = 'session_id_exists' as const;
export const SESSION_ID_EXISTS_MESSAGE =
  'The requested session ID already exists.';

export class SessionIdExistsError extends Error {
  override readonly name = 'SessionIdExistsError';
  readonly rpcCode = SESSION_ID_EXISTS_RPC_CODE;
  readonly errorKind = SESSION_ID_EXISTS_ERROR_KIND;
  readonly httpStatus = 409;

  constructor(readonly sessionId: string) {
    super(SESSION_ID_EXISTS_MESSAGE);
  }
}
