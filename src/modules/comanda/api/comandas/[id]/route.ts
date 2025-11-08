import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma/client";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const comandaId = Number(id);

  const comanda = await prisma.comanda.findUnique({
    where: { id: comandaId },
    include: {
      mesa: true,
      pedidos: {
        include: { itens: { include: { produto: true } } },
      },
    },
  });

  if (!comanda)
    return NextResponse.json({ error: "Comanda não encontrada" }, { status: 404 });

  return NextResponse.json(comanda);
}
