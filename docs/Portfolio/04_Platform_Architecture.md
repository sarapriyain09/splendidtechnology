# Platform Architecture

## Top-Level Structure

```text
VELYNXIA

Platform Services
- Admin
- Authentication
- PostgreSQL
- Prisma
- Licensing
- Subscription Management
- User Management
- Tenant Management
- Notifications
- Audit Logs
- File Storage
- API Gateway
- Shared Reporting
- Shared Settings

Growth Platform
- CRM
- Sales
- CallCRM
- Marketing
- Automation
- Analytics

AI Media Suite
- Voice Studio
- Script Studio
- Presentation Studio
- Podcast Studio
- Subtitle Studio
- Video Studio
- Background Music Studio
- Avatar Studio

Commerce Platform
- Product Studio
- Product Intelligence
- AI Commerce
- Marketplace Hub
- Orders
- Inventory
- Analytics

Engineering Platform
- Digital Twin
- Simulation
- Engineering AI
- Asset Health
- Reliability
- Diagnostics
- Analytics

Administration Layer (shared management)
- Users
- Billing
- Tenants
- Monitoring
- Settings
- API Keys
```

## Cross-Cutting Service Rule

All product platforms consume platform services through stable contracts and shared governance.

Required shared capabilities:

- Authentication and authorization
- Tenant scoping
- Licensing checks
- Subscription checks
- Notifications
- Audit logging
- Storage and backup controls
- API governance through gateway
- Common settings and policy controls
