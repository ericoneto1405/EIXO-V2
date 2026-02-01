-- Ensure UUID generation is available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Paddock enhancements
ALTER TABLE "Paddock" ADD COLUMN "capacity" DOUBLE PRECISION;
ALTER TABLE "Paddock" ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE "Paddock" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Paddock" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Paddock" ALTER COLUMN "size" DROP NOT NULL;

-- GMD extensions
ALTER TABLE "Animal" ADD COLUMN "gmd30" DOUBLE PRECISION;
ALTER TABLE "PoAnimal" ADD COLUMN "gmd30" DOUBLE PRECISION;
ALTER TABLE "Animal" ALTER COLUMN "gmd" DROP NOT NULL;
ALTER TABLE "PoAnimal" ALTER COLUMN "gmd" DROP NOT NULL;
ALTER TABLE "PoAnimal" ALTER COLUMN "gmd" DROP DEFAULT;

-- Ensure every farm has a default paddock
INSERT INTO "Paddock" ("id", "name", "size", "capacity", "active", "createdAt", "updatedAt", "farmId")
SELECT gen_random_uuid(), 'Pasto 01 - Principal', f."size", NULL, TRUE, NOW(), NOW(), f."id"
FROM "Farm" f
WHERE NOT EXISTS (
  SELECT 1 FROM "Paddock" p WHERE p."farmId" = f."id" AND p."name" = 'Pasto 01 - Principal'
);

-- Backfill current paddock for existing animals
WITH principal AS (
  SELECT p."id", p."farmId" FROM "Paddock" p WHERE p."name" = 'Pasto 01 - Principal'
)
UPDATE "Animal" a
SET "currentPaddockId" = p."id"
FROM principal p
WHERE a."farmId" = p."farmId" AND a."currentPaddockId" IS NULL;

WITH principal AS (
  SELECT p."id", p."farmId" FROM "Paddock" p WHERE p."name" = 'Pasto 01 - Principal'
)
UPDATE "PoAnimal" a
SET "currentPaddockId" = p."id"
FROM principal p
WHERE a."farmId" = p."farmId" AND a."currentPaddockId" IS NULL;

-- Update current paddock constraints
ALTER TABLE "Animal" DROP CONSTRAINT IF EXISTS "Animal_currentPaddockId_fkey";
ALTER TABLE "PoAnimal" DROP CONSTRAINT IF EXISTS "PoAnimal_currentPaddockId_fkey";

ALTER TABLE "Animal" ALTER COLUMN "currentPaddockId" SET NOT NULL;
ALTER TABLE "PoAnimal" ALTER COLUMN "currentPaddockId" SET NOT NULL;

ALTER TABLE "Animal"
ADD CONSTRAINT "Animal_currentPaddockId_fkey"
FOREIGN KEY ("currentPaddockId") REFERENCES "Paddock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PoAnimal"
ADD CONSTRAINT "PoAnimal_currentPaddockId_fkey"
FOREIGN KEY ("currentPaddockId") REFERENCES "Paddock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
