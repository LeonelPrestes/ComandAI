import { prisma } from "@/src/lib/prisma/client";

/**
 * 🔹 Retorna o cardápio ativo conforme o dia da semana.
 */
export async function obterCardapioAtivo() {
  const hoje = new Date();
  const dow = hoje.getDay(); // 0=Domingo, 6=Sábado
  const tipo = dow === 0 || dow === 6 ? "FDS" : "SEMANA";

  const cardapio = await prisma.cardapio.findFirst({
    where: { tipo, ativo: true },
  });

  if (!cardapio) {
    console.warn("⚠️ Nenhum cardápio ativo encontrado para o tipo:", tipo);
    return null;
  }

  return cardapio;
}

/**
 * 🔹 Lista os produtos do cardápio ativo (ou de um cardápio específico)
 */
export async function listarProdutosAtivos(cardapioId?: number) {
  const cardapio = cardapioId
    ? await prisma.cardapio.findUnique({ where: { id: cardapioId } })
    : await obterCardapioAtivo();

  if (!cardapio) return [];

  const produtos = await prisma.produto.findMany({
    where: { cardapio_id: cardapio.id, ativo: true },
    include: { categoria: true },
    orderBy: [
      { categoria_id: "asc" },
      { nome: "asc" },
    ],
  });

  return produtos;
}
