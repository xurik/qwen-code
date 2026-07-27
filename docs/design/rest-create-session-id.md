# Caller-supplied REST session IDs

## Problem

`POST /session` accepted a `sessionId` field but silently discarded it. The CLI configuration path already supports caller-supplied IDs, including validation and writer-lease conflict detection, but the REST, bridge, and ACP agent layers did not carry the value to that path.

## Design

The REST route validates `sessionId` with the same rules as `--session-id` and adds it to `BridgeSpawnRequest`. The bridge carries it through ACP `session/new` using the shared `qwen-code.sessionId` `_meta` extension because ACP has no standard request field for a caller-supplied ID. The ACP agent reads that extension and supplies the ID to its existing new-session configuration path.

The ID affects only a fresh session. Under `sessionScope: "single"`, an existing session is attached only when the requested ID is absent or matches; a different requested ID is rejected instead of being ignored. Callers that require a fresh session use `sessionScope: "thread"`.

## Compatibility

Omitting `sessionId` preserves random UUID generation. Existing ACP clients that do not send the extension are unchanged, and invalid REST values fail before the bridge starts or attaches a session.
