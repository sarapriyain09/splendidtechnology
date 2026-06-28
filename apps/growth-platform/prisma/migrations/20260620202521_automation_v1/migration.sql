/*
  Warnings:

  - You are about to drop the column `context` on the `workflow_logs` table. All the data in the column will be lost.
  - You are about to drop the column `error` on the `workflow_logs` table. All the data in the column will be lost.
  - You are about to drop the column `finishedAt` on the `workflow_logs` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `workflow_logs` table. All the data in the column will be lost.
  - You are about to drop the column `workflowId` on the `workflow_logs` table. All the data in the column will be lost.
  - You are about to drop the `workflow_definitions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workflow_steps` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `workflow_id` to the `workflow_logs` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `workflow_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "workflow_logs" DROP CONSTRAINT "workflow_logs_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "workflow_steps" DROP CONSTRAINT "workflow_steps_workflowId_fkey";

-- DropIndex
DROP INDEX "workflow_logs_workflowId_idx";

-- AlterTable
ALTER TABLE "workflow_logs" DROP COLUMN "context",
DROP COLUMN "error",
DROP COLUMN "finishedAt",
DROP COLUMN "startedAt",
DROP COLUMN "workflowId",
ADD COLUMN     "executed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "workflow_id" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- DropTable
DROP TABLE "workflow_definitions";

-- DropTable
DROP TABLE "workflow_steps";

-- CreateTable
CREATE TABLE "workflows" (
    "id" TEXT NOT NULL,
    "company_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_triggers" (
    "id" TEXT NOT NULL,
    "workflow_id" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,

    CONSTRAINT "workflow_triggers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_conditions" (
    "id" TEXT NOT NULL,
    "workflow_id" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "workflow_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_actions" (
    "id" TEXT NOT NULL,
    "workflow_id" TEXT NOT NULL,
    "action_type" TEXT NOT NULL,
    "action_data" JSONB,

    CONSTRAINT "workflow_actions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "workflows_company_id_idx" ON "workflows"("company_id");

-- CreateIndex
CREATE INDEX "workflow_triggers_workflow_id_idx" ON "workflow_triggers"("workflow_id");

-- CreateIndex
CREATE INDEX "workflow_triggers_event_name_idx" ON "workflow_triggers"("event_name");

-- CreateIndex
CREATE INDEX "workflow_conditions_workflow_id_idx" ON "workflow_conditions"("workflow_id");

-- CreateIndex
CREATE INDEX "workflow_actions_workflow_id_idx" ON "workflow_actions"("workflow_id");

-- CreateIndex
CREATE INDEX "workflow_actions_action_type_idx" ON "workflow_actions"("action_type");

-- CreateIndex
CREATE INDEX "workflow_logs_workflow_id_idx" ON "workflow_logs"("workflow_id");

-- CreateIndex
CREATE INDEX "workflow_logs_executed_at_idx" ON "workflow_logs"("executed_at");

-- AddForeignKey
ALTER TABLE "workflow_triggers" ADD CONSTRAINT "workflow_triggers_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_conditions" ADD CONSTRAINT "workflow_conditions_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_actions" ADD CONSTRAINT "workflow_actions_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_logs" ADD CONSTRAINT "workflow_logs_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
