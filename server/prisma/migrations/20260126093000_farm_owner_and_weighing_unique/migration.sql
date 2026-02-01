-- AlterTable
ALTER TABLE "Farm" ADD COLUMN "userId" TEXT;

-- Backfill existing farms with the oldest or admin user
UPDATE "Farm"
SET "userId" = COALESCE(
    (SELECT "id" FROM "User" WHERE "email" = 'admin@eixo.com' LIMIT 1),
    (SELECT "id" FROM "User" ORDER BY "createdAt" ASC LIMIT 1)
)
WHERE "userId" IS NULL;

-- Enforce NOT NULL after backfill
ALTER TABLE "Farm" ALTER COLUMN "userId" SET NOT NULL;

-- DropIndex
DROP INDEX "Weighing_animalId_data_idx";

-- CreateIndex
CREATE INDEX "Farm_userId_idx" ON "Farm"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Weighing_animalId_data_key" ON "Weighing"("animalId", "data");

-- AddForeignKey
ALTER TABLE "Farm" ADD CONSTRAINT "Farm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
