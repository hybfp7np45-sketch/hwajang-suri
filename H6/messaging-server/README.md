# H6 SOLAPI integration — preparation, not live sending

2026-11-03: Provider selected. Owner has not created a SOLAPI account yet.

Implemented:
- H6 message tab: onboarding state, persisted SMS/LMS/ATA draft and previous-day hour, reservation preview. No sending and no credential inputs.
- `solapi.mjs`: server-only HMAC signing, validated SMS/LMS/ATA payloads, groups prepare/send/schedule/get/cancel. Injected fetch for offline tests. No credentials committed.
- Tests use only synthetic data and mocked responses. No SOLAPI billable requests have been made.

Activation work still required (do not label current screen as connected):
1. Owner signs up, verifies sender, and for ATA connects Kakao channel and obtains approved template IDs/variables. Securely provision credentials in runtime secrets, never in GitHub Pages, localStorage or chat.
2. Deploy an authenticated server gateway with durable operation storage and per-shop isolation. This adapter is NOT a deployed server and has no public HTTP routes. For the first shop keep testOnly true and enforce the verified owner's testRecipient server-side.
3. Store unique operation IDs before prepare; save group IDs before add/dispatch. A timeout is an uncertain result, not permission to retry. Query the known group and reconcile; never blindly resend. Persist final delivery outcomes separately from API acceptance.
4. Integrate appointment save/update/cancel with server state. Cancel the old scheduled group successfully before replacement; preserve and visibly report failures. Test races, browser closure, network failures, insufficient balance and duplicate clicks before auto-reminders are enabled.
5. Pilot tests: owner's phone immediate SMS, scheduled SMS with app closed, cancellation, then approved ATA and explicit fallback choice. User must confirm actual receipt.
6. Multi-shop release requires registered OAuth2 application, validated state, secure token storage/refresh and tenant authorization. It is not implemented in this single-shop adapter.

Provider docs:
https://solapi.com/developers/api/authentication-api-key
https://solapi.com/developers/api/msg-groups-createMessageGroup
https://solapi.com/developers/api/msg-groups-addGroupMessages
https://solapi.com/developers/api/msg-groups-scheduleGroupMessage
https://solapi.com/developers/api/msg-groups-ancelScheduledGroupMessage
https://solapi.com/developers/api/messages-ata

Run offline checks: node test.mjs
