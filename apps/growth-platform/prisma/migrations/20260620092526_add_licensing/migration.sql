-- CreateEnum
CREATE TYPE "FeatureKey" AS ENUM ('CRM', 'SALES', 'CALLCRM', 'MARKETING', 'AUTOMATION', 'ANALYTICS');

-- CreateTable
CREATE TABLE "licenses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "licenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "license_features" (
    "licenseId" TEXT NOT NULL,
    "feature" "FeatureKey" NOT NULL,

    CONSTRAINT "license_features_pkey" PRIMARY KEY ("licenseId","feature")
);

-- CreateTable
CREATE TABLE "user_licenses" (
    "userId" TEXT NOT NULL,
    "licenseId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_licenses_pkey" PRIMARY KEY ("userId","licenseId")
);

-- CreateIndex
CREATE UNIQUE INDEX "licenses_name_key" ON "licenses"("name");

-- CreateIndex
CREATE INDEX "user_licenses_licenseId_idx" ON "user_licenses"("licenseId");

-- AddForeignKey
ALTER TABLE "license_features" ADD CONSTRAINT "license_features_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "licenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_licenses" ADD CONSTRAINT "user_licenses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_licenses" ADD CONSTRAINT "user_licenses_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "licenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
