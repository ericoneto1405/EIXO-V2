-- CreateEnum
CREATE TYPE "ReproMode" AS ENUM ('CONTINUO', 'ESTACAO');

-- CreateEnum
CREATE TYPE "ReproEventType" AS ENUM ('COBERTURA', 'IATF', 'DIAGNOSTICO_PRENHEZ', 'PARTO', 'DESMAME');

-- AlterTable
ALTER TABLE "Farm" ADD COLUMN "reproMode" "ReproMode" NOT NULL DEFAULT 'CONTINUO';

-- CreateTable
CREATE TABLE "BreedingSeason" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BreedingSeason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exposure" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exposure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReproEvent" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "type" "ReproEventType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "seasonId" TEXT,
    "payload" JSONB,
    "notes" TEXT,
    "bullId" TEXT,
    "protocol" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReproEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BreedingSeason_farmId_startAt_idx" ON "BreedingSeason"("farmId", "startAt");

-- CreateIndex
CREATE UNIQUE INDEX "Exposure_seasonId_animalId_key" ON "Exposure"("seasonId", "animalId");

-- CreateIndex
CREATE INDEX "Exposure_animalId_idx" ON "Exposure"("animalId");

-- CreateIndex
CREATE INDEX "ReproEvent_animalId_date_idx" ON "ReproEvent"("animalId", "date");

-- CreateIndex
CREATE INDEX "ReproEvent_farmId_date_idx" ON "ReproEvent"("farmId", "date");

-- CreateIndex
CREATE INDEX "ReproEvent_seasonId_idx" ON "ReproEvent"("seasonId");

-- AddForeignKey
ALTER TABLE "BreedingSeason" ADD CONSTRAINT "BreedingSeason_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exposure" ADD CONSTRAINT "Exposure_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "BreedingSeason"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exposure" ADD CONSTRAINT "Exposure_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReproEvent" ADD CONSTRAINT "ReproEvent_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReproEvent" ADD CONSTRAINT "ReproEvent_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReproEvent" ADD CONSTRAINT "ReproEvent_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "BreedingSeason"("id") ON DELETE SET NULL ON UPDATE CASCADE;
