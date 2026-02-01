-- Drop old unique index (data)
DROP INDEX IF EXISTS "PoWeighing_poAnimalId_data_key";

-- Rename columns
ALTER TABLE "PoWeighing" RENAME COLUMN "data" TO "date";
ALTER TABLE "PoWeighing" RENAME COLUMN "peso" TO "weightKg";

-- Add new columns
ALTER TABLE "PoWeighing" ADD COLUMN "farmId" TEXT;
ALTER TABLE "PoWeighing" ADD COLUMN "notes" TEXT;

-- Backfill farmId from PoAnimal
UPDATE "PoWeighing"
SET "farmId" = "PoAnimal"."farmId"
FROM "PoAnimal"
WHERE "PoWeighing"."poAnimalId" = "PoAnimal"."id" AND "PoWeighing"."farmId" IS NULL;

-- Enforce NOT NULL farmId
ALTER TABLE "PoWeighing" ALTER COLUMN "farmId" SET NOT NULL;

-- Indexes
CREATE UNIQUE INDEX "PoWeighing_poAnimalId_date_key" ON "PoWeighing"("poAnimalId", "date");
CREATE INDEX "PoWeighing_farmId_idx" ON "PoWeighing"("farmId");
CREATE INDEX "PoWeighing_farmId_date_idx" ON "PoWeighing"("farmId", "date");

-- Foreign key
ALTER TABLE "PoWeighing" ADD CONSTRAINT "PoWeighing_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
