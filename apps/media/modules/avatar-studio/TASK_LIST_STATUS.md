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

1. Extend scene planner heuristics for richer scene-role specific assets/backgrounds and domain templates.
2. Add async job model for render tasks (pending/running/completed/failed).
3. Expose job progress API and wire frontend polling.
4. Implement lip-sync adapter interface and stub local runner.
5. Integrate Wav2Lip or MuseTalk execution stage into render pipeline.

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
