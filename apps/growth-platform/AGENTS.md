<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Pi Deployment Target Rule (Critical)

All apps under app-growth are deployed and run from their own Pi folders and PM2 processes. Always update the correct folder and restart the matching process.

- app-growth shell: `/home/sarapriyain/Projects/app-growth` -> pm2 `app-growth`
- CRM: `/home/sarapriyain/Projects/app/crm` -> pm2 `splendid-crm`
- Sales: `/home/sarapriyain/Projects/app/sales` -> pm2 `sales`
- Marketing: `/home/sarapriyain/Projects/app/marketing` -> pm2 `marketing`
- AImedia: `/home/sarapriyain/Projects/app/aimedia` -> pm2 `aimedia`
- Automation: `/home/sarapriyain/Projects/app/automation` -> pm2 `automation`
- Analytics: `/home/sarapriyain/Projects/app/analytics` -> pm2 `analytics`
- CallCRM API: `/home/sarapriyain/Projects/app/callcrm/apps/api` -> pm2 `callcrm-api`
- CallCRM Web: `/home/sarapriyain/Projects/app/callcrm/apps/web` -> pm2 `callcrm-web`

Never deploy one app from another app folder.
