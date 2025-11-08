import { prisma } from "@/src/lib/prisma/client";
import { Prisma } from "@prisma/client";

/* =========================================================
   🔹 Tipo oficial para pedidos com itens e produtos
   ========================================================= */
export type PedidoComItens = Prisma.pedidoGetPayload<{
  include: {
    itens: {
      include: {
        produto: true;
      };
    };
  };
}>;

/* =========================================================
   🔹 Tipos auxiliares (para criar pedido)
   ========================================================= */
type ItemPedido = {
  produto_id: number;
  quantidade: number;
  preco_unitario?: number;
  adicionais?: string;
};

/* =========================================================
   🔸 Criar Pedido
   ========================================================= */
export async function criarPedido(
  comandaId: number,
  garcomId: number,
  itens: ItemPedido[],
  observacoes?: string
) {
  console.log("🧾 Criando pedido → comandaId:", comandaId, "garcomId:", garcomId);

  // ✅ 1. Verifica se a comanda existe
  const comandaExiste = await prisma.comanda.findUnique({ where: { id: comandaId } });
  if (!comandaExiste) throw new Error(`❌ Comanda ${comandaId} não encontrada.`);

  // ✅ 2. Verifica se o garçom existe
  const garcomExiste = await prisma.garcom.findUnique({ where: { id: garcomId } });
  if (!garcomExiste) throw new Error(`❌ Garçom ${garcomId} não encontrado.`);

  // ✅ 3. Calcula o valor total
  const valor_total = itens.reduce(
    (acc, it) => acc + (it.preco_unitario ?? 0) * it.quantidade,
    0
  );

  // ✅ 4. Cria o pedido
  const pedido = await prisma.pedido.create({
    data: {
      comanda_id: comandaId,
      garcom_id: garcomId,
      status: "pendente",
      valor_total,
      observacoes,
    },
  });

  // ✅ 5. Cria os itens vinculados
  for (const it of itens) {
    await prisma.itens_do_pedido.create({
      data: {
        pedido_id: pedido.id,
        produto_id: it.produto_id,
        quantidade: it.quantidade,
        preco_unitario: it.preco_unitario,
        subtotal: (it.preco_unitario ?? 0) * it.quantidade,
        adicionais: it.adicionais ?? "",
      },
    });
  }

  console.log("✅ Pedido criado com sucesso:", pedido.id);
  return pedido;
}

/* =========================================================
   🔸 Listar Pedidos por Comanda
   ========================================================= */
export async function listarPedidosPorComanda(comandaId: number): Promise<PedidoComItens[]> {
  console.log(`📦 Buscando pedidos da comanda ${comandaId}...`);

  const pedidos = await prisma.pedido.findMany({
    where: { comanda_id: comandaId },
    include: {
      itens: {
        include: { produto: true },
      },
    },
    orderBy: { data_hora: "desc" },
  });

  return pedidos;
}

/* =========================================================
   🔸 Atualizar Status do Pedido
   ========================================================= */
export async function atualizarStatusPedido(
  pedidoId: number,
  novoStatus: "pendente" | "preparando" | "pronto" | "entregue" | "cancelado"
) {
  console.log(`♻️ Atualizando status do pedido ${pedidoId} → ${novoStatus}`);

  const pedido = await prisma.pedido.update({
    where: { id: pedidoId },
    data: { status: novoStatus },
  });

  return pedido;
}

/* =========================================================
   🔸 Cancelar Pedido
   ========================================================= */
export async function cancelarPedido(pedidoId: number) {
  console.log(`🚫 Cancelando pedido ${pedidoId}...`);

  const pedido = await prisma.pedido.update({
    where: { id: pedidoId },
    data: { status: "cancelado" },
  });

  return pedido;
}

/* =========================================================
   🔸 Deletar Pedido (opcional - para administração)
   ========================================================= */
export async function deletarPedido(pedidoId: number) {
  console.warn(`⚠️ Deletando pedido ${pedidoId} permanentemente!`);

  await prisma.itens_do_pedido.deleteMany({ where: { pedido_id: pedidoId } });
  const deletado = await prisma.pedido.delete({ where: { id: pedidoId } });

  return deletado;
}
