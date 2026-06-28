-- AlterTable
ALTER TABLE "sales_opportunities" ADD COLUMN     "pipelineId" TEXT,
ADD COLUMN     "stageId" TEXT;

-- CreateTable
CREATE TABLE "sales_pipelines" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_pipelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_pipeline_stages" (
    "id" TEXT NOT NULL,
    "pipelineId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "defaultProbability" INTEGER NOT NULL DEFAULT 0,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "isWon" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_pipeline_stages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sales_pipeline_stages_pipelineId_idx" ON "sales_pipeline_stages"("pipelineId");

-- CreateIndex
CREATE INDEX "sales_opportunities_pipelineId_idx" ON "sales_opportunities"("pipelineId");

-- CreateIndex
CREATE INDEX "sales_opportunities_stageId_idx" ON "sales_opportunities"("stageId");

-- AddForeignKey
ALTER TABLE "sales_pipeline_stages" ADD CONSTRAINT "sales_pipeline_stages_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "sales_pipelines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_opportunities" ADD CONSTRAINT "sales_opportunities_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "sales_pipelines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_opportunities" ADD CONSTRAINT "sales_opportunities_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "sales_pipeline_stages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
