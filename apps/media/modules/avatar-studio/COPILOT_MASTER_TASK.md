# GitHub Copilot Master Task

## Project
Velynxia Avatar Studio

## Goal
Transform the current application into a professional AI Avatar Studio similar to HeyGen, but without depending on HeyGen.

The application must use AI providers such as OpenAI (ChatGPT) or Google Gemini for intelligence, while using local open-source AI models for avatar animation and video generation.

The application must run entirely on Raspberry Pi 5.

Do not use Docker.

## Primary User Experience
The application should work like ChatGPT.

The user types:

- Create a product demo for my CRM.
- Create a YouTube Short explaining predictive maintenance.
- Create a talking presentation from this PowerPoint.

The application should automatically perform all steps.

The user should not manually create scenes.

The AI should orchestrate everything.

## Workflow
```text
User Prompt

↓

AI Understanding

↓

Script Generation

↓

Scene Planning

↓

Avatar Selection

↓

Voice Selection

↓

Video Generation

↓

Preview

↓

Export
```

Everything must happen automatically.

## AI Provider Layer
Create a provider architecture.

Never hardcode OpenAI.

Support multiple providers.

```text
AI Provider
├── OpenAI
├── Gemini
└── Future Local LLM
```

Each provider must implement:

- Generate Script
- Generate Scene Plan
- Rewrite
- Summarize
- Translate
- Generate Captions

The provider should be selected from configuration.

## Avatar Engine
Do not integrate HeyGen.

Build a local Avatar Engine.

Pipeline:

```text
Portrait Image
↓
Face Detection
↓
Head Pose
↓
Expression Generation
↓
Lip Synchronization
↓
Video Rendering
↓
MP4
```

The implementation should use open-source AI models.

Preferred models:

- LivePortrait
- MuseTalk
- Wav2Lip

Use FFmpeg to render the final video.

## Voice Engine
Create a provider interface.

Support:

- OpenAI TTS
- Future ElevenLabs
- Future Local Voice Model

The user should be able to choose a voice or clone one later.

## AI Orchestrator
Create a central orchestrator.

Responsibilities:

- Understand the prompt
- Decide what the user wants
- Call the AI provider
- Generate a script
- Create scenes
- Select an avatar
- Configure voice
- Start rendering
- Track progress
- Return the completed video

All workflows should pass through the orchestrator.

## Scene Planner
Automatically convert the AI-generated script into scenes.

Each scene should contain:

- Avatar
- Voice
- Background
- Duration
- Captions
- Camera movement
- Transition
- Assets

The user should be able to edit scenes before rendering.

## Video Renderer
Create a rendering pipeline.

```text
Scene
↓
Avatar Animation
↓
Background
↓
Captions
↓
Music
↓
Transitions
↓
FFmpeg
↓
Final Video
```

## Frontend Layout
Use a ChatGPT-style interface.

Left Sidebar:

- Dashboard
- Avatars
- Avatar Training
- Voice Studio
- Video Creator
- Shorts Studio
- Presentation Studio
- Screen Recorder
- Media Library
- Projects
- Templates
- Analytics
- Settings

Center:

- Dynamic workspace

Bottom:

- Large AI prompt box

Right Sidebar:

- Dynamic properties

Examples:

- Avatar
- Voice
- Background
- Camera
- Animation
- Timeline
- Export

## Shorts Studio
Create a dedicated module.

The user enters:

- Create a 30-second LinkedIn video.

The AI should automatically:

- Write the script
- Divide it into scenes
- Add captions
- Animate the avatar
- Produce a vertical video (1080x1920)

Provide templates for:

- YouTube Shorts
- Instagram Reels
- TikTok
- Facebook Reels
- LinkedIn

## Presentation Studio
Allow users to upload:

- PowerPoint
- PDF
- Images

The AI should:

- Read the content
- Generate narration
- Create scenes
- Produce a narrated presentation

## Product Demo Studio
Allow users to provide:

- Product description
- Website URL
- Screenshots
- Documentation

The AI should generate:

- Product demo script
- Feature highlights
- Voice-over
- Avatar presentation
- Call-to-action
- Final marketing video

## Storage
Store all media locally.

```text
storage/
uploads/
avatars/
voices/
projects/
renders/
exports/
training/
logs/
backups/
```

Create folders automatically if they do not exist.

## Deployment
Run natively on Raspberry Pi 5.

Frontend:

- Next.js
- PM2

Backend:

- FastAPI
- Python virtual environment

Database:

- PostgreSQL

Reverse Proxy:

- Nginx

No Docker.

No Kubernetes.

## Performance
Optimize for Raspberry Pi.

Use:

- Lazy loading
- Background jobs
- Streaming uploads
- Efficient caching
- Minimal memory usage

## Code Quality
Use:

- TypeScript
- Python type hints
- SOLID principles
- Modular architecture
- Dependency injection where appropriate
- Reusable services
- Reusable React components

## Future Expansion
Design the architecture so it can later support:

- Real-time avatars
- Live streaming
- Voice cloning
- Avatar training from uploaded videos
- API access
- Team collaboration
- Enterprise workspaces

without requiring a redesign.

## Final Requirement
The finished application should feel like a modern AI platform where the user simply describes what they want in natural language, and the system automatically plans, generates, renders, and exports professional avatar videos.

The architecture must remain modular so that AI providers, avatar engines, voice engines, and rendering technologies can be replaced or upgraded independently in the future.
