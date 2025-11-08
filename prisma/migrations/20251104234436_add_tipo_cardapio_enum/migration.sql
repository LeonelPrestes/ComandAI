-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cardapio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "data_inicio" DATETIME,
    "data_fim" DATETIME,
    "tipo" TEXT NOT NULL DEFAULT 'SEMANA'
);
INSERT INTO "new_cardapio" ("ativo", "data_fim", "data_inicio", "descricao", "id", "nome") SELECT "ativo", "data_fim", "data_inicio", "descricao", "id", "nome" FROM "cardapio";
DROP TABLE "cardapio";
ALTER TABLE "new_cardapio" RENAME TO "cardapio";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
