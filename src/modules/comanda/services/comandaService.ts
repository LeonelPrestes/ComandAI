import { prisma } from "@/src/lib/prisma/client";

/**
 * 🔹 Abre uma comanda nova ou retorna a existente, se a mesa já estiver ocupada.
 */
export async function abrirOuRetomarComanda(mesaId: number, garcomId: number = 1) {
  // Encontra status "aberta"
  const statusAberta = await prisma.status_comanda.findFirst({
    where: { nome: "aberta" },
  });
  if (!statusAberta) throw new Error("Status 'aberta' não encontrado.");

  // Verifica se já existe uma comanda aberta para essa mesa
  const comandaExistente = await prisma.comanda.findFirst({
    where: {
      mesa_id: mesaId,
      status_id: statusAberta.id,
    },
  });

  if (comandaExistente) {
    return comandaExistente; // ✅ já existe, retorna ela
  }

  // Caso não exista, cria nova comanda
  const comanda = await prisma.comanda.create({
    data: {
      mesa_id: mesaId,
      garcom_id: garcomId,
      status_id: statusAberta.id,
      pessoas: 0,
      valor_total: 0,
    },
  });

  // Atualiza mesa para "ocupada"
  const statusOcupada = await prisma.status_mesa.findFirst({
    where: { nome: "ocupada" },
  });

  if (statusOcupada) {
    await prisma.mesa.update({
      where: { id: mesaId },
      data: { status_id: statusOcupada.id },
    });
  }

  return comanda;
}

/**
 * 🔹 Fecha uma comanda e libera a mesa.
 */
export async function fecharComanda(mesaId: number) {
  const statusFechada = await prisma.status_comanda.findFirst({
    where: { nome: "fechada" },
  });
  const statusDisponivel = await prisma.status_mesa.findFirst({
    where: { nome: "disponível" },
  });

  if (!statusFechada || !statusDisponivel)
    throw new Error("Status 'fechada' ou 'disponível' não encontrados.");

  // Fecha a comanda aberta dessa mesa
  const comanda = await prisma.comanda.findFirst({
    where: { mesa_id: mesaId, status: { nome: "aberta" } },
  });

  if (!comanda) throw new Error("Nenhuma comanda aberta para esta mesa.");

  await prisma.comanda.update({
    where: { id: comanda.id },
    data: {
      status_id: statusFechada.id,
      fechado_em: new Date(),
    },
  });

  // Libera a mesa
  await prisma.mesa.update({
    where: { id: mesaId },
    data: { status_id: statusDisponivel.id },
  });

  return { message: "Mesa e comanda fechadas com sucesso!" };
}
