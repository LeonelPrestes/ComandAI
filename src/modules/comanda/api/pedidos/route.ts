import { NextResponse } from "next/server";
import { criarPedido } from "@/src/modules/comanda/services/pedidoService";
import { imprimirPedidoCozinha } from "@/src/modules/comanda/services/impressaoPedidoService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { comandaId, garcomId, itens, observacoes } = body;

    if (!comandaId || !itens?.length)
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

    const pedido = await criarPedido(comandaId, garcomId, itens, observacoes);

    let printError: string | undefined;
    try {
      await imprimirPedidoCozinha(pedido.id);
    } catch (error) {
      console.error("Erro ao imprimir pedido:", error);
      printError = "Erro ao imprimir pedido";
    }

    const payload = printError ? { ...pedido, printError } : pedido;
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return NextResponse.json({ error: "Erro ao criar pedido" }, { status: 500 });
  }
}
