/*
  Warnings:

  - A unique constraint covering the columns `[numero]` on the table `mesa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "mesa_numero_key" ON "mesa"("numero");
