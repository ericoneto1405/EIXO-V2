-- CreateEnum
CREATE TYPE "SelectionDecisionType" AS ENUM ('KEEP', 'WATCH', 'DISCARD');

-- CreateTable
CREATE TABLE "SelectionDecision" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "decision" "SelectionDecisionType" NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SelectionDecision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SelectionDecision_animalId_idx" ON "SelectionDecision"("animalId");

-- CreateIndex
CREATE INDEX "SelectionDecision_farmId_idx" ON "SelectionDecision"("farmId");

-- CreateIndex
CREATE UNIQUE INDEX "SelectionDecision_farmId_animalId_key" ON "SelectionDecision"("farmId", "animalId");

-- AddForeignKey
ALTER TABLE "SelectionDecision" ADD CONSTRAINT "SelectionDecision_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectionDecision" ADD CONSTRAINT "SelectionDecision_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
