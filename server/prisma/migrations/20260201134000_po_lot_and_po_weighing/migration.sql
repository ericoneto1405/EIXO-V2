-- CreateTable
CREATE TABLE "PoLot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "farmId" TEXT NOT NULL,

    CONSTRAINT "PoLot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PoLot_farmId_idx" ON "PoLot"("farmId");

-- AddForeignKey
ALTER TABLE "PoLot" ADD CONSTRAINT "PoLot_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "PoAnimal" ADD COLUMN "lotId" TEXT;

-- CreateIndex
CREATE INDEX "PoAnimal_lotId_idx" ON "PoAnimal"("lotId");

-- AddForeignKey
ALTER TABLE "PoAnimal" ADD CONSTRAINT "PoAnimal_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "PoLot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "NutritionAssignment" ADD COLUMN "poLotId" TEXT;

-- CreateIndex
CREATE INDEX "NutritionAssignment_poLotId_idx" ON "NutritionAssignment"("poLotId");

-- AddForeignKey
ALTER TABLE "NutritionAssignment" ADD CONSTRAINT "NutritionAssignment_poLotId_fkey" FOREIGN KEY ("poLotId") REFERENCES "PoLot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropIndex
DROP INDEX IF EXISTS "PoWeighing_poAnimalId_date_key";
DROP INDEX IF EXISTS "PoWeighing_poAnimalId_idx";
DROP INDEX IF EXISTS "PoWeighing_farmId_date_idx";

-- AlterTable
ALTER TABLE "PoWeighing" RENAME COLUMN "date" TO "data";
ALTER TABLE "PoWeighing" RENAME COLUMN "weightKg" TO "peso";

-- CreateIndex
CREATE UNIQUE INDEX "PoWeighing_poAnimalId_data_key" ON "PoWeighing"("poAnimalId", "data");
CREATE INDEX "PoWeighing_poAnimalId_data_idx" ON "PoWeighing"("poAnimalId", "data");
CREATE INDEX "PoWeighing_farmId_data_idx" ON "PoWeighing"("farmId", "data");
