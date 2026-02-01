-- AlterTable
ALTER TABLE "PoAnimal" ADD COLUMN     "pesoAtual" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "PoAnimal" ADD COLUMN     "gmd" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "PoWeighing" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "gmd" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "poAnimalId" TEXT NOT NULL,

    CONSTRAINT "PoWeighing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PoWeighing_poAnimalId_data_key" ON "PoWeighing"("poAnimalId", "data");

-- CreateIndex
CREATE INDEX "PoWeighing_poAnimalId_idx" ON "PoWeighing"("poAnimalId");

-- AddForeignKey
ALTER TABLE "PoWeighing" ADD CONSTRAINT "PoWeighing_poAnimalId_fkey" FOREIGN KEY ("poAnimalId") REFERENCES "PoAnimal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
