-- CreateEnum
CREATE TYPE "EmbryoTechnique" AS ENUM ('FIV', 'TE');

-- CreateEnum
CREATE TYPE "SemenMoveType" AS ENUM ('IN', 'OUT', 'USE', 'ADJUST');

-- CreateEnum
CREATE TYPE "EmbryoMoveType" AS ENUM ('IN', 'OUT', 'TRANSFER', 'ADJUST');

-- CreateTable
CREATE TABLE "PoAnimal" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "brinco" TEXT,
    "nome" TEXT NOT NULL,
    "raca" TEXT NOT NULL,
    "sexo" "AnimalSexo" NOT NULL,
    "dataNascimento" TIMESTAMP(3),
    "registro" TEXT,
    "categoria" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PoAnimal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SemenBatch" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "bullPoAnimalId" TEXT,
    "bullName" TEXT,
    "bullRegistry" TEXT,
    "fornecedor" TEXT,
    "lote" TEXT NOT NULL,
    "dataColeta" TIMESTAMP(3),
    "dosesTotal" INTEGER NOT NULL,
    "dosesDisponiveis" INTEGER NOT NULL,
    "localArmazenamento" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SemenBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmbryoBatch" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "donorPoAnimalId" TEXT,
    "donorName" TEXT,
    "donorRegistry" TEXT,
    "sirePoAnimalId" TEXT,
    "sireName" TEXT,
    "sireRegistry" TEXT,
    "tecnica" "EmbryoTechnique" NOT NULL,
    "estagio" TEXT,
    "qualidade" TEXT,
    "lote" TEXT NOT NULL,
    "quantidadeTotal" INTEGER NOT NULL,
    "quantidadeDisponivel" INTEGER NOT NULL,
    "localArmazenamento" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmbryoBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SemenMove" (
    "id" TEXT NOT NULL,
    "semenBatchId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "qty" INTEGER NOT NULL,
    "type" "SemenMoveType" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SemenMove_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmbryoMove" (
    "id" TEXT NOT NULL,
    "embryoBatchId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "qty" INTEGER NOT NULL,
    "type" "EmbryoMoveType" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmbryoMove_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PoAnimal_farmId_idx" ON "PoAnimal"("farmId");

-- CreateIndex
CREATE UNIQUE INDEX "PoAnimal_farmId_brinco_key" ON "PoAnimal"("farmId", "brinco");

-- CreateIndex
CREATE INDEX "SemenBatch_farmId_idx" ON "SemenBatch"("farmId");

-- CreateIndex
CREATE INDEX "SemenBatch_bullPoAnimalId_idx" ON "SemenBatch"("bullPoAnimalId");

-- CreateIndex
CREATE UNIQUE INDEX "SemenBatch_farmId_lote_key" ON "SemenBatch"("farmId", "lote");

-- CreateIndex
CREATE INDEX "EmbryoBatch_farmId_idx" ON "EmbryoBatch"("farmId");

-- CreateIndex
CREATE INDEX "EmbryoBatch_donorPoAnimalId_idx" ON "EmbryoBatch"("donorPoAnimalId");

-- CreateIndex
CREATE INDEX "EmbryoBatch_sirePoAnimalId_idx" ON "EmbryoBatch"("sirePoAnimalId");

-- CreateIndex
CREATE UNIQUE INDEX "EmbryoBatch_farmId_lote_key" ON "EmbryoBatch"("farmId", "lote");

-- CreateIndex
CREATE INDEX "SemenMove_semenBatchId_idx" ON "SemenMove"("semenBatchId");

-- CreateIndex
CREATE INDEX "EmbryoMove_embryoBatchId_idx" ON "EmbryoMove"("embryoBatchId");

-- AddForeignKey
ALTER TABLE "PoAnimal" ADD CONSTRAINT "PoAnimal_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SemenBatch" ADD CONSTRAINT "SemenBatch_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SemenBatch" ADD CONSTRAINT "SemenBatch_bullPoAnimalId_fkey" FOREIGN KEY ("bullPoAnimalId") REFERENCES "PoAnimal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmbryoBatch" ADD CONSTRAINT "EmbryoBatch_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmbryoBatch" ADD CONSTRAINT "EmbryoBatch_donorPoAnimalId_fkey" FOREIGN KEY ("donorPoAnimalId") REFERENCES "PoAnimal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmbryoBatch" ADD CONSTRAINT "EmbryoBatch_sirePoAnimalId_fkey" FOREIGN KEY ("sirePoAnimalId") REFERENCES "PoAnimal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SemenMove" ADD CONSTRAINT "SemenMove_semenBatchId_fkey" FOREIGN KEY ("semenBatchId") REFERENCES "SemenBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmbryoMove" ADD CONSTRAINT "EmbryoMove_embryoBatchId_fkey" FOREIGN KEY ("embryoBatchId") REFERENCES "EmbryoBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
