import { prisma } from "@/src/lib/prisma/client";

export async function listarMesas() {
  return prisma.mesa.findMany({
    include: { status: true },
    orderBy: { numero: "asc" },
  });
}

export async function alterarStatusMesa(mesaId: number, statusId: number) {
  return prisma.mesa.update({
    where: { id: mesaId },
    data: { status_id: statusId },
  });
}
