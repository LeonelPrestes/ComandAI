import { NextResponse } from "next/server";
import { imprimirPedidoCozinha } from "@/src/modules/comanda/services/impressaoPedidoService";

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const pedidoId = Number(id);

  if (!Number.isFinite(pedidoId)) {
    return NextResponse.json({ error: "Pedido invalido" }, { status: 400 });
  }

  try {
    const result = await imprimirPedidoCozinha(pedidoId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao imprimir pedido:", error);
    return NextResponse.json({ error: "Erro ao imprimir pedido" }, { status: 500 });
  }
}
