# Velynxia AI Media Suite - Phase 3 GitHub Issue

Date: 2026-06-27

## Issue 3 - Phase 3: Voice AI (STT, TTS, Voice Profiles)

Title:
Phase 3 - Voice AI Stack (Transcribe, Speak, Profiles)

Labels:
ai-media, voice, stt, tts, phase-3, priority-high

Assignees (suggested):
- Owner: Voice/Media Engineer
- Support: AI Platform Lead
- Support: Pi/Automation Engineer

Body:

### Objective
Ship production voice capabilities for transcription, speech synthesis, and reusable voice profiles.

### Scope
- /voice/transcribe (Whisper/Faster-Whisper style adapter).
- /voice/speak (Piper/XTTS style adapter).
- Voice profile management and secure media asset storage.
- Consent/audit controls for cloning workflows.

### Engineering checklist
- [ ] Implement /voice/transcribe endpoint with async option for long files.
- [ ] Implement /voice/speak endpoint with selectable voice profile.
- [ ] Implement voice profile CRUD API.
- [ ] Add secure upload handling for reference audio.
- [ ] Add object storage integration for source and generated audio.
- [ ] Add signed URL access with short TTL for downloads.
- [ ] Add consent capture fields and immutable audit log for cloning actions.
- [ ] Add worker queue for long-running STT/TTS jobs.
- [ ] Add webhook/callback or polling endpoint for async job status.

### Acceptance criteria
- [ ] Uploaded speech is transcribed with timestamps and confidence scores.
- [ ] Text input produces playable audio output in target formats.
- [ ] Voice profile can be created and used in synthesis requests.
- [ ] Cross-tenant media access is blocked by policy.
- [ ] Consent is mandatory for clone-enabled workflows.

### Non-functional requirements
- [ ] Throughput baseline captured for 30-second and 5-minute audio samples.
- [ ] Queue retries and dead-letter behavior validated.
- [ ] Audio processing error taxonomy documented and monitored.

### Dependencies
- Phase 1 gateway auth/quota/metering.
- Storage bucket and lifecycle policy.
- Queue infrastructure (Redis Streams or RabbitMQ).

### Risks
- High compute cost for long audio workloads.
- Legal/compliance edge cases for voice cloning.

### Definition of done
- [ ] End-to-end demo passes: upload sample -> create profile -> generate speech.
- [ ] Compliance wording and consent UX signed off.
- [ ] Staging and production rollouts completed with monitoring.
