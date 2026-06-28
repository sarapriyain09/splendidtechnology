-- CreateEnum
CREATE TYPE "CloneStatus" AS ENUM ('UPLOADING', 'PENDING', 'PROCESSING', 'TRAINING', 'READY', 'FAILED');

-- CreateTable
CREATE TABLE "AvatarClone" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "status" "CloneStatus" NOT NULL DEFAULT 'UPLOADING',
    "photoFolder" TEXT NOT NULL,
    "trainingVideo" TEXT,
    "avatarModelPath" TEXT,
    "previewImage" TEXT,
    "language" TEXT NOT NULL,
    "accent" TEXT,
    "speakingSpeed" DECIMAL(3,2),
    "gender" TEXT,
    "defaultBackground" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvatarClone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoiceClone" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "audioFolder" TEXT NOT NULL,
    "voiceModelPath" TEXT,
    "duration" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "status" "CloneStatus" NOT NULL DEFAULT 'UPLOADING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoiceClone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CloneProject" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "avatarCloneId" UUID NOT NULL,
    "voiceCloneId" UUID NOT NULL,
    "script" TEXT NOT NULL,
    "background" TEXT,
    "music" TEXT,
    "subtitle" BOOLEAN NOT NULL DEFAULT true,
    "outputVideo" TEXT,
    "status" "CloneStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CloneProject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AvatarClone_userId_createdAt_idx" ON "AvatarClone"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "VoiceClone_userId_createdAt_idx" ON "VoiceClone"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CloneProject_userId_createdAt_idx" ON "CloneProject"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CloneProject_avatarCloneId_createdAt_idx" ON "CloneProject"("avatarCloneId", "createdAt");

-- CreateIndex
CREATE INDEX "CloneProject_voiceCloneId_createdAt_idx" ON "CloneProject"("voiceCloneId", "createdAt");

-- AddForeignKey
ALTER TABLE "CloneProject" ADD CONSTRAINT "CloneProject_avatarCloneId_fkey" FOREIGN KEY ("avatarCloneId") REFERENCES "AvatarClone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CloneProject" ADD CONSTRAINT "CloneProject_voiceCloneId_fkey" FOREIGN KEY ("voiceCloneId") REFERENCES "VoiceClone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
