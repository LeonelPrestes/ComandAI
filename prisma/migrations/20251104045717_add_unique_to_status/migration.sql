/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `adicionais` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `cardapio` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `categoria_produto` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `garcom` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `ingredientes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `produto` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `unidade_medida` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sigla]` on the table `unidade_medida` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "adicionais_nome_key" ON "adicionais"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "cardapio_nome_key" ON "cardapio"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_produto_nome_key" ON "categoria_produto"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "garcom_nome_key" ON "garcom"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "ingredientes_nome_key" ON "ingredientes"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "produto_nome_key" ON "produto"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "unidade_medida_nome_key" ON "unidade_medida"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "unidade_medida_sigla_key" ON "unidade_medida"("sigla");
