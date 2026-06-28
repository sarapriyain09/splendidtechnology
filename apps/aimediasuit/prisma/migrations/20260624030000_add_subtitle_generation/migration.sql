-- CreateEnum
CREATE TYPE "SubtitleFormat" AS ENUM ('srt', 'vtt', 'captions');

-- CreateEnum
CREATE TYPE "SubtitleTone" AS ENUM ('verbatim', 'readable', 'engaging');

-- Alter enum values only when legacy ModuleType exists in this database.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ModuleType') THEN
        ALTER TYPE "ModuleType" ADD VALUE IF NOT EXISTS 'SUBTITLE';
        ALTER TYPE "ModuleType" ADD VALUE IF NOT EXISTS 'BACKGROUND_MUSIC';
    END IF;
END
$$;

-- CreateTable
CREATE TABLE "SubtitleGeneration" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "format" "SubtitleFormat" NOT NULL,
    "tone" "SubtitleTone" NOT NULL,
    "sourceText" TEXT NOT NULL,
    "outputText" TEXT NOT NULL,
    "cueCount" INTEGER NOT NULL DEFAULT 0,
    "includeTimestamps" BOOLEAN NOT NULL DEFAULT true,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "status" "GenerationStatus" NOT NULL DEFAULT 'COMPLETED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubtitleGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubtitleGeneration_userId_createdAt_idx" ON "SubtitleGeneration"("userId", "createdAt");
