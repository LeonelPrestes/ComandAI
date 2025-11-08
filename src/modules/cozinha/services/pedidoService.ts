import { prisma } from "@/src/lib/prisma/client";
import { Prisma } from "@prisma/client";

export type PedidoComItens = Prisma.pedidoGetPayload<{
  include: {
    itens: { include: { produto: true } };
    comanda: { include: { mesa: true } };
  };
}>;

export async function listarPedidosAtivos(): Promise<PedidoComItens[]> {
  return prisma.pedido.findMany({
    where: { status: { in: ["pendente", "preparando", "pronto"] } },
    include: { itens: { include: { produto: true } }, comanda: { include: { mesa: true } } },
    orderBy: { data_hora: "desc" },
  });
}

export async function atualizarStatusPedido(
  pedidoId: number,
  novoStatus: "pendente" | "preparando" | "pronto" | "entregue"
) {
  return prisma.pedido.update({ where: { id: pedidoId }, data: { status: novoStatus } });
}

export async function listarPedidosAgrupadosPorMesa() {
  const pedidos = await listarPedidosAtivos();
  const agrupado = pedidos.reduce<Record<number, PedidoComItens[]>>((acc, pedido) => {
    const numeroMesa = pedido.comanda?.mesa?.numero || 0;
    if (!acc[numeroMesa]) acc[numeroMesa] = [];
    acc[numeroMesa].push(pedido);
    return acc;
  }, {});
  return Object.entries(agrupado).map(([mesa, pedidos]) => ({ mesa: Number(mesa), pedidos }));
}
