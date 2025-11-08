import { NextResponse } from "next/server";
import { listarProdutosAtivos } from "@/src/modules/comanda/services/produtoService";

export async function GET() {
  try {
    const produtos = await listarProdutosAtivos();
    return NextResponse.json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    );
  }
}
