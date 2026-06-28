---
name: Phase 4 Implementation
about: Track delivery for Velynxia AI Media Suite Phase 4
title: "Phase 4 - "
labels: ["ai-media", "phase-4"]
assignees: []
---

# Velynxia AI Media Suite - Phase 4 GitHub Issue

Date: 2026-06-27

## Issue 4 - Phase 4: Image Generation Pipeline

Title:
Phase 4 - Image Generation Pipeline (Async + Safety + Asset Delivery)

Labels:
ai-media, image-generation, queue, phase-4, priority-high

Assignees (suggested):
- Owner: Voice/Media Engineer
- Support: AI Platform Lead
- Support: Frontend Lead

Body:

### Objective
Deliver a production-grade image pipeline with asynchronous jobs, prompt safety controls, and secure asset delivery.

### Scope
- /image/generate endpoint.
- Async queue workers for generation and post-processing.
- Safety and policy checks.
- Signed URL asset delivery.

### Engineering checklist
- [ ] Implement /image/generate endpoint with request validation.
- [ ] Add async job orchestration and job status endpoints.
- [ ] Integrate model adapters for FLUX and SDXL-compatible backends.
- [ ] Add prompt safety classifier and blocked-category handling.
- [ ] Add post-processing stages:
  - [ ] Upscale
  - [ ] Optional background removal
- [ ] Store generated assets with metadata (model, seed, dimensions, cost).
- [ ] Return short-lived signed URLs for asset access.
- [ ] Add retry strategy and dead-letter handling for failed jobs.

### Acceptance criteria
- [ ] Generation requests return job ID and initial queued status.
- [ ] Job lifecycle transitions are visible (queued -> running -> completed/failed).
- [ ] Unsafe prompts are rejected with policy-aligned responses.
- [ ] Completed jobs return valid image URLs and metadata.
- [ ] Expired signed URLs are unusable after TTL.

### Non-functional requirements
- [ ] Queue throughput baseline documented.
- [ ] Generation failure reasons classified and measurable.
- [ ] Cost-per-image telemetry visible in dashboard.

### Dependencies
- Phase 1 gateway and usage metering.
- Queue infrastructure and object storage.

### Risks
- GPU compute spikes under concurrent generation load.
- False positives in prompt safety filtering.

### Definition of done
- [ ] End-to-end flow validated from dashboard prompt submission to download.
- [ ] Staging load test passes for agreed concurrency target.
- [ ] Production rollout with alerts and rollback plan completed.
