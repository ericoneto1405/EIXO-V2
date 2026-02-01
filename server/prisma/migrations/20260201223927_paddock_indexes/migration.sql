-- AlterTable
ALTER TABLE "Paddock" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Paddock_farmId_idx" ON "Paddock"("farmId");
