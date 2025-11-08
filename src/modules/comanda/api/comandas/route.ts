import { NextResponse } from "next/server";
import { abrirOuRetomarComanda, fecharComanda } from "@/src/modules/comanda/services/comandaService";

export async function POST(req: Request) {
  try {
    const { mesaId, garcomId } = await req.json();
    const comanda = await abrirOuRetomarComanda(mesaId, garcomId);
    return NextResponse.json(comanda);
  } catch (error) {
    console.error("Erro ao abrir/retomar comanda:", error);
    return NextResponse.json({ error: "Erro ao abrir/retomar comanda" }, { status: 500 });
  }
}

// ✅ Certifique-se de que esse bloco está PRESENTE:
export async function PATCH(req: Request) {
  try {
    const { mesaId } = await req.json();
    const result = await fecharComanda(mesaId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao fechar comanda:", error);
    return NextResponse.json({ error: "Erro ao fechar comanda" }, { status: 500 });
  }
}
