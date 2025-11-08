import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma/client";

/**
 * 🔹 Retorna a comanda ativa de uma mesa específica
 * Exemplo: GET /api/comandas/mesa/7 → comanda aberta da mesa 7
 */
export async function GET(
  _req: Request,
  context: { params: Promise<{ mesaId: string }> } // 👈 params é uma Promise
) {
  try {
    const { mesaId } = await context.params; // 👈 precisa do await aqui
    const idMesa = Number(mesaId);

    if (isNaN(idMesa)) {
      return NextResponse.json({ error: "ID da mesa inválido." }, { status: 400 });
    }

    const comanda = await prisma.comanda.findFirst({
      where: {
        mesa_id: idMesa,
        status: {
          nome: { in: ["aberta", "em atendimento"] },
        },
      },
      include: {
        mesa: {
          select: {
            id: true,
            numero: true,
            status: { select: { nome: true } },
          },
        },
        garcom: { select: { nome: true } },
        status: { select: { nome: true } },
      },
    });

    if (!comanda) {
      return NextResponse.json(
        { error: "Nenhuma comanda ativa encontrada para esta mesa." },
        { status: 404 }
      );
    }

    return NextResponse.json(comanda);
  } catch (error) {
    console.error("❌ Erro ao buscar comanda da mesa:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar comanda da mesa." },
      { status: 500 }
    );
  }
}