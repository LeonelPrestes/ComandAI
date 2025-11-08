import { NextResponse } from "next/server";
import { criarPedido } from "@/src/modules/comanda/services/pedidoService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { comandaId, garcomId, itens, observacoes } = body;

    if (!comandaId || !itens?.length)
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

    const pedido = await criarPedido(comandaId, garcomId, itens, observacoes);
    return NextResponse.json(pedido);
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return NextResponse.json({ error: "Erro ao criar pedido" }, { status: 500 });
  }
}
