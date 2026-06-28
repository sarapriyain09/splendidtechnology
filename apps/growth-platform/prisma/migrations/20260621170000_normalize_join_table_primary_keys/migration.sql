-- Normalize join/composite tables still keyed on *_text_legacy columns
-- after bigint cutover.

BEGIN;

-- _CampaignSegments: switch PK from (A_text_legacy, B_text_legacy) to (A, B)
ALTER TABLE "_CampaignSegments" DROP CONSTRAINT IF EXISTS "_CampaignSegments_AB_pkey";
ALTER TABLE "_CampaignSegments" ADD CONSTRAINT "_CampaignSegments_AB_pkey" PRIMARY KEY ("A", "B");

-- _CompanyTags: switch PK from (A_text_legacy, B_text_legacy) to (A, B)
ALTER TABLE "_CompanyTags" DROP CONSTRAINT IF EXISTS "_CompanyTags_AB_pkey";
ALTER TABLE "_CompanyTags" ADD CONSTRAINT "_CompanyTags_AB_pkey" PRIMARY KEY ("A", "B");

-- _ContactTags: switch PK from (A_text_legacy, B_text_legacy) to (A, B)
ALTER TABLE "_ContactTags" DROP CONSTRAINT IF EXISTS "_ContactTags_AB_pkey";
ALTER TABLE "_ContactTags" ADD CONSTRAINT "_ContactTags_AB_pkey" PRIMARY KEY ("A", "B");

-- user_licenses: switch PK from (userId_text_legacy, licenseId) to (userId, licenseId)
ALTER TABLE "user_licenses" DROP CONSTRAINT IF EXISTS "user_licenses_pkey";
ALTER TABLE "user_licenses" ADD CONSTRAINT "user_licenses_pkey" PRIMARY KEY ("userId", "licenseId");

COMMIT;
