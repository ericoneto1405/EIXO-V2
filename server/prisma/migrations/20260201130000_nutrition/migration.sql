-- CreateTable
CREATE TABLE "NutritionPlan" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "fase" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),
    "metaGmd" DOUBLE PRECISION,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NutritionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionAssignment" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "lotId" TEXT,
    "animalId" TEXT,
    "poAnimalId" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NutritionAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NutritionPlan_farmId_idx" ON "NutritionPlan"("farmId");

-- CreateIndex
CREATE INDEX "NutritionAssignment_farmId_idx" ON "NutritionAssignment"("farmId");
CREATE INDEX "NutritionAssignment_planId_idx" ON "NutritionAssignment"("planId");
CREATE INDEX "NutritionAssignment_lotId_idx" ON "NutritionAssignment"("lotId");
CREATE INDEX "NutritionAssignment_animalId_idx" ON "NutritionAssignment"("animalId");
CREATE INDEX "NutritionAssignment_poAnimalId_idx" ON "NutritionAssignment"("poAnimalId");
CREATE INDEX "NutritionAssignment_farmId_startAt_idx" ON "NutritionAssignment"("farmId", "startAt");

-- AddForeignKey
ALTER TABLE "NutritionPlan" ADD CONSTRAINT "NutritionPlan_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionAssignment" ADD CONSTRAINT "NutritionAssignment_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NutritionAssignment" ADD CONSTRAINT "NutritionAssignment_planId_fkey" FOREIGN KEY ("planId") REFERENCES "NutritionPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NutritionAssignment" ADD CONSTRAINT "NutritionAssignment_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NutritionAssignment" ADD CONSTRAINT "NutritionAssignment_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NutritionAssignment" ADD CONSTRAINT "NutritionAssignment_poAnimalId_fkey" FOREIGN KEY ("poAnimalId") REFERENCES "PoAnimal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
