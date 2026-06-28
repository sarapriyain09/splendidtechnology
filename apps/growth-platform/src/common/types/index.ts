// Shared platform domain types.
//
// Apps (crm, sales, callcrm, marketing, automation, analytics) import the shared
// Company / Contact / Activity / Task / Note / Document / User / Tag / Attachment
// types from here — NOT directly from @prisma/client — so the "common owns the
// shared entities" boundary is explicit and stable.

export type {
  User,
  Company,
  Contact,
  Activity,
  Task,
  Note,
  Document,
  Tag,
  Attachment,
  UserRole,
  ActivityType,
  TaskStatus,
  TaskPriority,
} from "@prisma/client";
