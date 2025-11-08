/*
  Warnings:

  - You are about to drop the column `data_fim` on the `cardapio` table. All the data in the column will be lost.
  - You are about to drop the column `data_inicio` on the `cardapio` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cardapio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "tipo" TEXT NOT NULL DEFAULT 'SEMANA'
);
INSERT INTO "new_cardapio" ("ativo", "descricao", "id", "nome", "tipo") SELECT "ativo", "descricao", "id", "nome", "tipo" FROM "cardapio";
DROP TABLE "cardapio";
ALTER TABLE "new_cardapio" RENAME TO "cardapio";
CREATE UNIQUE INDEX "cardapio_tipo_key" ON "cardapio"("tipo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
