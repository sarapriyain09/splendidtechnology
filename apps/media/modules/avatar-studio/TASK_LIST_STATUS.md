# Avatar Studio Task List and Status

Last updated: 2026-07-19

## Status update protocol

Use this tracker as the single source of truth after every change batch.

Update rules:

1. Update Last updated date.
2. Move task state in Task board.
3. Add one line under Recent changes.
4. If a milestone state changed, update Milestone status.
5. If priorities changed, refresh Immediate next 5 tasks.

Status values:

- Not Started
- In Progress
- Blocked
- Complete

## Current delivery status

- Overall Phase 1 progress: In Progress (PR2 active)
- Provider architecture: Partially Complete
- Gemini-only runtime path: Complete
- Local render reliability: Complete
- True AI lip-sync engine integration: Not Started

## Task board

| ID | Task | Status | Notes |
|---|---|---|---|
| T1 | Enforce provider abstraction for avatar generation | Complete | Factory routing is active and configuration-driven. |
| T2 | Switch to Gemini-first image provider flow | Complete | Gemini provider returns real image path when API response succeeds. |
| T3 | Remove rectangle fallback overlays on portrait renders | Complete | Portrait pipeline no longer applies silhouette overlays to real portraits. |
| T4 | Ensure female voice preference in local TTS | Complete | Windows TTS selects female voice when available. |
| T5 | Stabilize ffmpeg render fallback behavior | Complete | Retry path added when advanced filters are unsupported. |
| T6 | Add visible pseudo lip animation for MVP preview | Complete | Mouth-region animation added as interim effect. |
| T7 | Implement true AI lip-sync model stage (Wav2Lip or MuseTalk) | Not Started | Required for production-grade mouth movement. |
| T8 | Add LivePortrait head-motion stage | Not Started | Needed for natural face/head dynamics. |
| T9 | Add orchestrator endpoint for full auto workflow | In Progress | Render orchestration moved from timeline router into orchestrator; additional workflow decomposition still pending. |
| T10 | Add scene planner service with structured output schema | In Progress | Dedicated planner module now includes hook/body/CTA segmentation, inferred background/assets by prompt context, and persisted camera/transition/caption/voice/assets metadata in scene APIs; remaining work is planner intelligence depth. |
| T11 | Add background jobs for render/training pipelines | Not Started | Queue and progress states required. |
| T12 | Add progress APIs and frontend polling | Not Started | Needed for async UX and long-running tasks. |
| T13 | Add storage lifecycle policies and cleanup jobs | Not Started | Needed for Raspberry Pi SSD longevity. |
| T14 | Add test suite for provider contracts and render pipeline | In Progress | Some validations exist; full contract and integration coverage pending. |

## Milestone status

### M1: Provider modularity

- Status: In Progress
- Done:
  - Avatar provider factory path implemented
  - Gemini provider path working
- Remaining:
  - Formal AIProvider and VoiceProvider contract packages
  - End-to-end provider swap tests

### M2: Local avatar engine MVP

- Status: In Progress
- Done:
  - Gemini portrait generation
  - Local TTS
  - ffmpeg output pipeline
- Remaining:
  - LivePortrait integration
  - Wav2Lip or MuseTalk integration

### M3: Full orchestrated generation UX

- Status: In Progress
- Remaining:
  - Scene planner enrichment
  - Jobs/progress tracking
  - Chat-style full workflow state machine

## Immediate next 5 tasks

1. Add async job model for render tasks (pending/running/completed/failed).
2. Expose job progress API and wire frontend polling.
3. Implement lip-sync adapter interface and stub local runner.
4. Integrate Wav2Lip or MuseTalk execution stage into render pipeline.
5. Expand timeline editor controls for caption style, voice preset, transition, and assets editing.

## Risks and blockers

- Raspberry Pi performance constraints for real-time inference and render throughput.
- GPU/accelerator availability for lip-sync models may affect latency.
- Model packaging size and runtime dependencies must be optimized for native Pi deployment.

## Definition of done for Phase 1 MVP

- User enters one natural-language prompt.
- System auto-generates script and scene plan.
- Local avatar pipeline runs with real AI lip-sync (no fake mouth animation).
- Final MP4 is generated and downloadable.
- Providers remain swappable through configuration only.

## Recent changes

- 2026-07-19: Completed Phase 4 upload matrix validation through training resumable APIs (JPG, PNG, WAV, MP3), each with completed chunk ingestion, persisted storage URL, and completion log entries.
- 2026-07-19: Fixed local avatar renderer runtime NameError by importing subprocess for voice synthesis execution path; strict outage probe now returns failed + strictMode=true + no fallback payload.
- 2026-07-19: Enhanced neural animation request quality contract with natural-face motion options (lip sync strength, expression intensity, head motion scale, blink cadence, neck stabilization, transition awareness) and added test assertions.
- 2026-07-19: Enabled automatic neural animation provider selection when endpoint is configured, added readiness-aware strict/fallback behavior, and added explicit caption plus branding overlays in FFmpeg render command builders.
- 2026-07-19: Added Avatar Studio frontend unit-test harness (Vitest + Testing Library) and a Timeline SceneCard regression test that verifies full metadata patch payloads are sent on save.
- 2026-07-19: Split Avatar Studio backend CI into a fast preset-contract/planner check job plus a dependent full backend pytest gate for quicker signal on config drift.
- 2026-07-19: Added GitHub Actions workflow for Avatar Studio backend CI to run pytest on backend changes and on frontend scene preset config changes so cross-layer contract checks run in PRs.
- 2026-07-19: Expanded frontend-backend scene preset contract coverage to include option vocab and baseline defaults (music/camera/transition/caption/voice), plus backend constants to keep planner fallbacks aligned.
- 2026-07-19: Added a backend contract test that parses frontend scene config and asserts domain detection order, domain keyword sets, and role-duration presets remain aligned across frontend and backend.
- 2026-07-19: Centralized backend scene planner domain detection keywords/order and role-duration presets into a shared config module, then refactored planner inference to consume those constants.
- 2026-07-19: Moved scene-domain keyword detection order/sets and role-duration presets into shared frontend config, then refactored scene default inference to consume these constants for easier tuning.
- 2026-07-19: Centralized scene option/default vocabulary into shared frontend config and wired timeline UI plus studio API fallbacks to the same constants to prevent preset drift.
- 2026-07-19: Added timeline scene editor controls for camera, transition, caption style, voice preset, and comma-separated assets; save path now persists the full scene metadata contract.
- 2026-07-19: Aligned manual timeline Add Scene defaults with planner presets via shared frontend helper (domain/role-aware duration/background/voice/caption/assets) and extended scene API/type contracts for camera/transition/caption/voice/assets plus project prompt context.
- 2026-07-19: Expanded next-phase planner templates with domain/role duration defaults and voice presets (social, commerce, finance, industrial), with regression-safe planner test coverage.
- 2026-07-19: Started next phase by enriching scene planner domain heuristics (social/commerce/finance/saas/industrial) with role-aware backgrounds, assets, and caption style defaults; added planner coverage for commerce and finance prompts.
- 2026-07-19: Added strict queued-render failure lifecycle sequence test coverage to assert deterministic stage order (queued -> preparing -> rendering -> failed) and final progress=100 for failed jobs.
- 2026-07-19: Added strict queued-render lifecycle sequence test coverage to assert deterministic stage order (queued -> preparing -> rendering -> persisting -> completed) and final progress=100.
- 2026-07-19: Added deterministic stage-based progress mapping for async render jobs (queued 10, preparing 25, rendering 70, persisting 90, completed/failed 100) and wired explicit lifecycle stages in worker/sync flows.
- 2026-07-19: Started Phase 5 by adding file-backed render job metadata with stage/error/timestamps in render status API and wiring stage/error display in timeline progress UI.
- 2026-07-19: Exposed render telemetry in timeline render UI cards (attempt count, fallback used, duration) and updated frontend render payload typings.
- 2026-07-19: Added structured render telemetry (attemptCount, fallbackUsed, durationMs) from FFmpeg executor and persisted it via orchestrator to per-video metadata files under storage/projects/{projectId}/render-meta.
- 2026-07-19: Extracted FFmpeg execution and retry logic into a dedicated render executor service with unit tests for retry/failure behavior.
- 2026-07-19: Isolated FFmpeg command construction into a dedicated command builder module and added direct command-contract tests.
- 2026-07-19: Added deterministic idempotency-based render output basename propagation (render service -> render plan metadata -> local renderer) and added render service unit tests.
- 2026-07-19: Started PR4 render pipeline separation by extracting render-plan assembly and render execution/status mapping into a dedicated render service, then validated timeline idempotency and avatar tests.
- 2026-07-19: Added Copilot prompt documents for architecture and PR-sized execution plans.
- 2026-07-19: Added README guidance to use Copilot prompt documents.
- 2026-07-19: Added this status update protocol for continuous task tracking.
- 2026-07-19: Implemented PR1 provider contracts and config-driven AI/avatar/voice factories; orchestrator now returns scene plan and captions.
- 2026-07-19: Started PR2 by adding dedicated scene planner service and moving timeline render orchestration into AIOrchestrator.
- 2026-07-19: Enriched PR2 scene planner to output multi-scene hook/body/CTA plans and fixed Gemini script model fallback handling.
- 2026-07-19: Added SceneSettings persistence and timeline API metadata round-trip for camera, transition, caption style, voice, and assets.
- 2026-07-19: Validated planner-inferred background/assets through live /api/chat/prompt and timeline metadata persistence; updated Gemini script model defaults/fallback order to reduce text-model 404 retries.
- 2026-07-19: Added role-aware scene planner normalization for provider-returned raw scenes (hook/body/CTA defaults for background/camera/transition and asset normalization), plus dedicated scene planner tests.
- 2026-07-19: Wired scene metadata into render path (orchestrator -> avatar provider -> local renderer), applying camera/transition/assets-informed ffmpeg behavior and adding coverage in timeline idempotency tests.
