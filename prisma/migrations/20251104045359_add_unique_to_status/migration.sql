/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `status_comanda` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `status_mesa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "status_comanda_nome_key" ON "status_comanda"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "status_mesa_nome_key" ON "status_mesa"("nome");
