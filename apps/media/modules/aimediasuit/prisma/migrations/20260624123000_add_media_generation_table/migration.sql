DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'GenerationStatus') THEN
    CREATE TYPE "GenerationStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'VoiceType') THEN
    CREATE TYPE "VoiceType" AS ENUM ('alloy', 'ash', 'ballad', 'coral', 'echo', 'sage', 'shimmer');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ModuleType') THEN
    CREATE TYPE "ModuleType" AS ENUM ('VOICE', 'SCRIPT', 'PODCAST', 'VIDEO', 'AVATAR');
  END IF;
END
$$;

ALTER TYPE "ModuleType" ADD VALUE IF NOT EXISTS 'SUBTITLE';
ALTER TYPE "ModuleType" ADD VALUE IF NOT EXISTS 'BACKGROUND_MUSIC';

CREATE TABLE IF NOT EXISTS "MediaGeneration" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "moduleType" "ModuleType" NOT NULL,
  "title" TEXT NOT NULL,
  "inputText" TEXT NOT NULL,
  "voice" "VoiceType" NOT NULL,
  "speed" DECIMAL(3,2) NOT NULL,
  "duration" INTEGER,
  "outputUrl" TEXT,
  "status" "GenerationStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "MediaGeneration_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "MediaGeneration_userId_moduleType_createdAt_idx"
  ON "MediaGeneration"("userId", "moduleType", "createdAt");
