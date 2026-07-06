# Velynxia Engineering Platform

Velynxia Engineering is a standalone application focused on AI-powered, physics-based simulation for rotating machinery.

Initial flagship module:
- Velynxia Torsional

## Product Vision

Velynxia Engineering
- Torsional Dynamics
- Rotor Dynamics
- Structural Mechanics
- Thermal Analysis
- Electromagnetic Analysis
- Bearing Analysis
- Gear Analysis
- Digital Twin
- Condition Monitoring
- AI Engineering Assistant
- Engineering Knowledge Base

## Phase 1 Focus: Velynxia Torsional

Core capabilities:
- Static torsional analysis
- Shaft stiffness calculation
- Natural frequency calculation
- Mode shapes
- Harmonic response
- Transient analysis
- Three-phase fault simulation
- Load rejection
- Motor starting
- Flywheel systems
- Gear trains
- Campbell diagrams
- Shaft stress calculation
- Safety factor
- PDF engineering reports

## Architecture Direction

Backend
- Python + FastAPI
- NumPy, SciPy, Pandas
- Plotly for chart-ready simulation output

Simulation Core
- Lumped-mass solver
- Matrix solver
- Time-domain solver
- Eigenvalue solver
- FFT analysis

Frontend
- React + TypeScript + Tailwind CSS
- Interactive shaft builder
- Live engineering plots

Data
- PostgreSQL
- Material library
- Bearing library
- Coupling library
- Machine templates

AI Layer (through shared agent platform)
- Engineering reasoning and assistant flows
- Automatic engineering report drafting
- Design recommendation workflows

## App Scope Boundaries

This app is intentionally separate from commerce operations workflows.
It should share common platform services where appropriate (auth, agent platform, events, monitoring) while keeping engineering-domain logic isolated.

## Next Steps

1. Define v1 domain models and API contracts for torsional systems.
2. Implement solver pipeline (modal + transient + stress) with deterministic test fixtures.
3. Build shaft builder UI and report export workflow.
4. Add AI assistant prompts through shared agent-platform adapter.
5. Add benchmark validation against known engineering reference cases.
