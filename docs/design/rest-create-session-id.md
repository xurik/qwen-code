# Caller-supplied REST session IDs

## Problem

`POST /session` accepted a `sessionId` field but silently discarded it. The CLI configuration path already supports caller-supplied IDs, including validation and writer-lease conflict detection, but the REST, bridge, and ACP agent layers did not carry the value to that path.

## Design

The REST route validates `sessionId` with the same rules as `--session-id` and adds it to `BridgeSpawnRequest`. The bridge carries it through ACP `session/new` using the shared `qwen-code.sessionId` `_meta` extension because ACP has no standard request field for a caller-supplied ID. The ACP agent reads that extension and supplies the ID to its existing new-session configuration path. The accepted shape is a UUID with an optional `-agent-` suffix and a maximum total length of 128 characters; every persisted-session reader uses the same filename validator so suffixed sessions remain loadable, archivable, and visible after restart while legacy UUID-like files stay discoverable.

The ID affects only a fresh session. Under `sessionScope: "single"`, an existing session is attached only when the requested ID is absent or matches; a different requested ID is rejected instead of being ignored. Callers that require a fresh session use `sessionScope: "thread"`.

Caller-supplied IDs are daemon-process scoped. The shared multi-workspace admission controller reserves an explicit ID synchronously before the spawn starts and checks every runtime for an existing live owner. The reservation is released after registration or failure, preventing concurrent runtimes from creating an ambiguous owner index entry.

An ID already present in active or archived persistence returns the distinct `session_id_exists` error instead of claiming that another process owns the writer lease. A genuinely live or concurrent owner retains the writer-conflict error.

## Compatibility

Omitting `sessionId` preserves random UUID generation. Existing ACP clients that do not send the extension are unchanged, and invalid REST values fail before the bridge starts or attaches a session. Daemons advertise `session_id_override`; TypeScript and Java SDK callers require that capability before sending the field so older daemons cannot silently ignore it.
