# GitHub Copilot Execution Prompt (PR-Sized)

## Context
You are working on Velynxia Avatar Studio.

Refactor the current codebase into a modular AI Avatar Platform with replaceable providers and local avatar rendering.

Hard constraints:

- No HeyGen runtime dependency
- No Docker
- Must run natively on Raspberry Pi 5
- Keep existing API behavior working while refactoring

Tech baseline:

- Backend: FastAPI + Python
- Frontend: Next.js + TypeScript
- Rendering: FFmpeg
- AI: OpenAI or Gemini through provider interfaces

## Architecture Target
Implement or align modules under backend app:

- orchestrator
- providers
- script
- scene
- avatar
- voice
- render
- storage
- projects
- jobs
- api

All business flows must go through orchestrator, not direct provider calls.

## Provider Contracts
Define explicit interfaces (Protocol or abstract base classes):

AIProvider:

- generate_script
- generate_scene_plan
- rewrite
- summarize
- translate
- generate_captions

AvatarProvider:

- generate_video
- train_avatar
- list_avatars
- delete_avatar

VoiceProvider:

- text_to_speech
- clone_voice
- list_voices

Select active providers by config only.

## Local Avatar Pipeline
Target pipeline:

- portrait image
- face and motion stage (LivePortrait-ready abstraction)
- lip-sync stage (Wav2Lip or MuseTalk-ready abstraction)
- ffmpeg assembly
- final MP4

Important:

- no CSS fake mouth animation
- no provider-specific logic in API routers

## Deliver in Small PRs
Implement this in order, each step production-safe and testable.

### PR 1: Contracts + Config Isolation

- Create provider interfaces for AI, avatar, voice
- Add config-driven provider factory for each domain
- Move any hardcoded provider selection into factories
- Keep existing endpoints unchanged

Acceptance:

- Existing prompt to video endpoint still works
- Provider selection changes via env without code edits

### PR 2: Orchestrator-Centric Workflow

- Add or refine orchestrator service as single entrypoint
- Orchestrator performs: prompt understanding, script generation, scene planning, avatar selection, voice selection, render request
- Routers call orchestrator only

Acceptance:

- API returns project, scenes, video metadata through orchestrator path
- No direct provider calls from routers

### PR 3: Scene Planner Module

- Add scene planner service producing structured scene plan
- Scene schema includes avatar, voice, duration, background, captions, transition, camera
- Provide defaults when model output is partial

Acceptance:

- Prompt generates editable scene list
- Validation prevents invalid scene payloads

### PR 4: Render Pipeline Separation

- Move rendering logic into render service module
- Keep ffmpeg command construction isolated and testable
- Add clear intermediate file layout in storage folders

Acceptance:

- Render service can be called independently with scene plan
- Output MP4 path is deterministic and logged

### PR 5: Jobs and Progress Tracking

- Add background job execution for long tasks
- Track states: pending, running, completed, failed
- Expose lightweight progress endpoint

Acceptance:

- Render request returns job id for async runs
- Frontend can poll progress and fetch final output

### PR 6: Frontend Chat Workflow Alignment

- Keep ChatGPT-style input flow
- Add progress states and preview lifecycle
- Preserve backward compatibility in existing UI routes

Acceptance:

- User enters one prompt and gets generated preview without manual scene creation

## Storage Rules
Use local storage root only, never source folders.

Required structure:

- storage/uploads
- storage/avatars
- storage/voices
- storage/projects
- storage/renders
- storage/exports
- storage/training
- storage/logs
- storage/backups

Auto-create folders at startup if missing.

## Non-Functional Requirements

- Typed Python and TypeScript
- Minimal memory usage for Pi 5
- Background processing for heavy jobs
- Bounded retries and clear errors
- Correlation id in logs

## Guardrails

- Do not introduce vendor lock-in
- Do not break existing API contracts unless explicitly versioned
- Do not place media artifacts inside app source directories

## Output Format For Each PR
For each PR step you implement, provide:

1. Files changed
2. What was refactored
3. Compatibility notes
4. How to test locally
5. Next PR step
