# Velynxia Engineering Strategy (Within Commerce Platform)

Status: Approved direction draft
Date: 2026-07-03

## Positioning

Velynxia Engineering is the engineering simulation pillar of Velynxia.

Market message:
- Velynxia Engineering: AI-powered physics-based simulation for rotating machinery.

First flagship module:
- Velynxia Torsional

This document keeps implementation inside Commerce Platform execution scope while opening a clear path to a dedicated engineering module family.

## Long-Term Module Family

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

## Product Model Alignment

To stay aligned with Commerce Platform architecture rules, all engineering workflows attach to a Product context.

Engineering mapping:
- Product = Engineering Asset Product (machine, train, or system)
- Product Workspace = Engineering Workspace
- Product lifecycle = model definition -> simulation -> validation -> release -> operations

No standalone disconnected app pages should be created. Engineering capabilities are integrated as workspace modules and tabs.

## V1 Scope: Velynxia Torsional

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
- Gear trains (basic)
- Campbell diagrams (initial)
- Shaft stress calculation
- Safety factor
- PDF engineering reports

Target use cases:
- Synchronous condensers
- Generators
- Motors
- Compressors
- Pumps
- Marine propulsion
- Industrial drive trains

## Technical Architecture

### Backend

- Python
- FastAPI
- NumPy
- SciPy
- Pandas
- Plotly (image/export or JSON traces)

### Simulation Engines

- Lumped-mass solver
- Matrix solver
- Eigenvalue solver
- Time-domain transient solver
- FFT post-processing

### Frontend

- React (Next.js)
- TypeScript
- Tailwind CSS
- Interactive shaft and drivetrain builder
- Live charts and mode shape views

### Data

- PostgreSQL (deployment)
- SQLite (local dev/test profile)
- Libraries: materials, bearings, couplings, templates

### AI Boundary

Engineering assistant is consumed through shared Agent Platform adapters only. No direct model-vendor calls inside app modules.

## Differentiator Workflow

User intent example:
- "I have a 200 MVA, 3600 rpm synchronous condenser with a 25,000 kg.m2 flywheel."

Assistant workflow:
1. Build initial drivetrain model from templates.
2. Estimate missing parameters with explicit confidence tags.
3. Run torsional simulation set.
4. Highlight critical modes and overloaded shaft segments.
5. Propose design alternatives with impact estimates.
6. Generate engineering report draft with assumptions and limits.

## Roadmap

### Version 1.0

- Shaft builder
- Lumped-mass modeling
- Modal analysis
- Transient solver
- Stress and safety-factor checks
- PDF report generation

### Version 2.0

- Advanced gear trains
- Flexible couplings and dampers
- Multi-branch drivetrains
- Full Campbell workflow

### Version 3.0

- Finite-element shaft modeling
- Electromagnetic torque import
- Bearing dynamics
- External simulation API connectors

### Version 4.0

- Hybrid digital twin runtime
- Real-time sensor integration
- Remaining life estimation
- Predictive maintenance and optimization

## Delivery Plan (Next 6 Weeks)

1. Create Engineering workspace module shell under Commerce Platform navigation.
2. Define canonical data contracts:
   - shaft segments
   - inertias
   - couplings
   - load cases
   - simulation runs
   - result sets
3. Implement V1 solver service package:
   - stiffness matrix
   - modal analysis
   - transient response
4. Add report generator endpoint with assumptions and standards section.
5. Add benchmark validation suite with known textbook/reference cases.
6. Ship internal alpha with sample machine templates.

## Quality and Governance

- Every run stores input snapshot, solver version, and result hash for traceability.
- Validation reports include assumptions, units, and numerical limits.
- No hidden AI changes to core physics outputs.
- AI suggestions must cite source assumptions and confidence.

## Decision

Proceed with Velynxia Torsional as the first Velynxia Engineering module, implemented within Commerce Platform as the immediate execution path.
