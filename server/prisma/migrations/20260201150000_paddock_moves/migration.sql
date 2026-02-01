-- Add current paddock reference to animals
ALTER TABLE "Animal" ADD COLUMN "currentPaddockId" TEXT;
ALTER TABLE "PoAnimal" ADD COLUMN "currentPaddockId" TEXT;

ALTER TABLE "Animal"
ADD CONSTRAINT "Animal_currentPaddockId_fkey" FOREIGN KEY ("currentPaddockId") REFERENCES "Paddock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PoAnimal"
ADD CONSTRAINT "PoAnimal_currentPaddockId_fkey" FOREIGN KEY ("currentPaddockId") REFERENCES "Paddock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Create paddock move history
CREATE TABLE "PaddockMove" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "paddockId" TEXT NOT NULL,
    "animalId" TEXT,
    "poAnimalId" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaddockMove_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "PaddockMove" ADD CONSTRAINT "PaddockMove_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PaddockMove" ADD CONSTRAINT "PaddockMove_paddockId_fkey" FOREIGN KEY ("paddockId") REFERENCES "Paddock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PaddockMove" ADD CONSTRAINT "PaddockMove_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PaddockMove" ADD CONSTRAINT "PaddockMove_poAnimalId_fkey" FOREIGN KEY ("poAnimalId") REFERENCES "PoAnimal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "Animal_currentPaddockId_idx" ON "Animal"("currentPaddockId");
CREATE INDEX "PoAnimal_currentPaddockId_idx" ON "PoAnimal"("currentPaddockId");
CREATE INDEX "PaddockMove_farmId_idx" ON "PaddockMove"("farmId");
CREATE INDEX "PaddockMove_paddockId_idx" ON "PaddockMove"("paddockId");
CREATE INDEX "PaddockMove_animalId_idx" ON "PaddockMove"("animalId");
CREATE INDEX "PaddockMove_poAnimalId_idx" ON "PaddockMove"("poAnimalId");
CREATE INDEX "PaddockMove_farmId_startAt_idx" ON "PaddockMove"("farmId", "startAt");
