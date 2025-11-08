-- CreateTable
CREATE TABLE "status_mesa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cor" TEXT,
    "descricao" TEXT
);

-- CreateTable
CREATE TABLE "mesa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" INTEGER NOT NULL,
    "status_id" INTEGER NOT NULL,
    "capacidade" INTEGER,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "observacoes" TEXT,
    "tempo_total_ocupada" INTEGER,
    "total_ocupacoes" INTEGER,
    CONSTRAINT "mesa_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "status_mesa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "status_comanda" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cor" TEXT,
    "descricao" TEXT
);

-- CreateTable
CREATE TABLE "cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "endereco" TEXT,
    "email" TEXT,
    "observacoes" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "garcom" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "comanda" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mesa_id" INTEGER NOT NULL,
    "cliente_id" INTEGER,
    "garcom_id" INTEGER,
    "status_id" INTEGER NOT NULL,
    "aberto_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechado_em" DATETIME,
    "tempo_ocupada" INTEGER,
    "pessoas" INTEGER,
    "valor_total" REAL,
    "observacoes" TEXT,
    CONSTRAINT "comanda_mesa_id_fkey" FOREIGN KEY ("mesa_id") REFERENCES "mesa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "comanda_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cliente" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "comanda_garcom_id_fkey" FOREIGN KEY ("garcom_id") REFERENCES "garcom" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "comanda_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "status_comanda" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cardapio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "data_inicio" DATETIME,
    "data_fim" DATETIME
);

-- CreateTable
CREATE TABLE "categoria_produto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ordem_exibicao" INTEGER
);

-- CreateTable
CREATE TABLE "produto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "preco" REAL NOT NULL,
    "preco_meia" REAL,
    "aceita_meia" BOOLEAN NOT NULL DEFAULT false,
    "categoria_id" INTEGER,
    "cardapio_id" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "descricao" TEXT,
    CONSTRAINT "produto_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categoria_produto" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "produto_cardapio_id_fkey" FOREIGN KEY ("cardapio_id") REFERENCES "cardapio" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pedido" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "comanda_id" INTEGER NOT NULL,
    "garcom_id" INTEGER,
    "data_hora" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "valor_total" REAL,
    "observacoes" TEXT,
    CONSTRAINT "pedido_comanda_id_fkey" FOREIGN KEY ("comanda_id") REFERENCES "comanda" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pedido_garcom_id_fkey" FOREIGN KEY ("garcom_id") REFERENCES "garcom" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "itens_do_pedido" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pedido_id" INTEGER NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "preco_unitario" REAL,
    "subtotal" REAL,
    "adicionais" TEXT,
    CONSTRAINT "itens_do_pedido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedido" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "itens_do_pedido_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "adicionais" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "preco" REAL,
    "ativo" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "item_pedido_adicional" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "item_pedido_id" INTEGER NOT NULL,
    "adicional_id" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "item_pedido_adicional_item_pedido_id_fkey" FOREIGN KEY ("item_pedido_id") REFERENCES "itens_do_pedido" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "item_pedido_adicional_adicional_id_fkey" FOREIGN KEY ("adicional_id") REFERENCES "adicionais" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "unidade_medida" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "sigla" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ingredientes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "quantidade" REAL,
    "unidade_id" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "ingredientes_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "unidade_medida" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "produto_ingrediente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "produto_id" INTEGER NOT NULL,
    "ingrediente_id" INTEGER NOT NULL,
    "quantidade" REAL,
    CONSTRAINT "produto_ingrediente_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "produto_ingrediente_ingrediente_id_fkey" FOREIGN KEY ("ingrediente_id") REFERENCES "ingredientes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "adicional_ingrediente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "adicional_id" INTEGER NOT NULL,
    "ingrediente_id" INTEGER NOT NULL,
    "quantidade" REAL,
    CONSTRAINT "adicional_ingrediente_adicional_id_fkey" FOREIGN KEY ("adicional_id") REFERENCES "adicionais" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "adicional_ingrediente_ingrediente_id_fkey" FOREIGN KEY ("ingrediente_id") REFERENCES "ingredientes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
