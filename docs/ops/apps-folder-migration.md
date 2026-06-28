# Velynxia Apps Folder Migration

Date: 2026-06-24

## Objective

Unify the website and growth platform source under one repository layout:

- apps/website
- apps/growth-platform

This keeps deployment and updates consistent while reducing drift between environments.

## Current Stage

Completed (safe staged migration):

- Copied website source to apps/website
- Copied app-growth source to apps/growth-platform
- Kept original folders intact to avoid production disruption
- Added Pi deploy scripts for each app:
  - scripts/deploy-pi.ps1 (website)
  - scripts/deploy-pi-growth-platform.ps1 (growth platform)

## New Local Paths

- Website: apps/website
- Growth platform: apps/growth-platform

## Deployment Commands

From repository root:

```powershell
# Website -> /home/sarapriyain/Projects/velynxia-site (PM2: velynxia-site)
./scripts/deploy-pi.ps1

# Growth platform -> /home/sarapriyain/Projects/app-growth (PM2: app-growth)
./scripts/deploy-pi-growth-platform.ps1
```

## Recommended Next Step (Controlled Cutover)

1. Freeze direct edits in legacy roots.
2. Use only apps/website and apps/growth-platform for development.
3. Run both deploy scripts and verify:
   - https://velynxia.com
   - https://app.velynxia.com
4. After one stable cycle, archive legacy roots.

## Notes

- This migration intentionally avoids moving/removing existing live paths in one step.
- Existing PM2 process names and ports remain unchanged.
- Cloudflare tunnel host mappings stay valid with current remote directories.
