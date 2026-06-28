// Shared platform services.
//
// The single Prisma client is re-exported here so every app reads/writes the
// shared entities through one connection and one source of truth.
export { prisma } from "../../../lib/prisma";

// Add cross-app domain services here (e.g. CompanyService, ContactService) so
// Sales, Marketing, CallCRM, etc. reuse them instead of duplicating logic.
