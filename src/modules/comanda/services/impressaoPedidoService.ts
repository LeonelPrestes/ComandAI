import { Prisma } from "@prisma/client";
import { prisma } from "@/src/lib/prisma/client";
import { getPrinterConfig } from "@/src/lib/printer/config";
import { printText } from "@/src/lib/printer/client";

type PedidoParaImpressao = Prisma.pedidoGetPayload<{
  include: {
    itens: {
      include: {
        produto: true;
      };
    };
    comanda: {
      include: {
        mesa: true;
      };
    };
    garcom: true;
  };
}>;

export async function imprimirPedidoCozinha(pedidoId: number) {
  const pedido = await prisma.pedido.findUnique({
    where: { id: pedidoId },
    include: {
      itens: { include: { produto: true } },
      comanda: { include: { mesa: true } },
      garcom: true,
    },
  });

  if (!pedido) throw new Error("Pedido nao encontrado.");

  const ticket = montarTicketCozinha(pedido);
  await printText(ticket, { cut: true });

  return { pedidoId: pedido.id, printed: true };
}

function montarTicketCozinha(pedido: PedidoParaImpressao): string {
  const config = getPrinterConfig();
  const width = Math.max(config.columns, 32);
  const line = "-".repeat(width);
  const lines: string[] = [];

  lines.push(centerText("PEDIDO COZINHA", width));
  lines.push(line);

  const mesaNumero = pedido.comanda?.mesa?.numero;
  lines.push(`Mesa: ${mesaNumero ?? "-"}`);
  lines.push(`Comanda: ${pedido.comanda_id}`);
  lines.push(`Pedido: ${pedido.id}`);

  if (pedido.garcom?.nome) {
    lines.push(`Garcom: ${pedido.garcom.nome}`);
  }

  lines.push(`Data: ${formatDate(pedido.data_hora)}`);
  lines.push(line);
  lines.push("ITENS");

  for (const item of pedido.itens) {
    const nome = item.produto?.nome ?? "Item";
    lines.push(`${item.quantidade}x ${nome}`);

    if (item.adicionais) {
      lines.push(`  Add: ${item.adicionais}`);
    }
  }

  lines.push(line);

  if (pedido.observacoes) {
    lines.push("Obs:");
    lines.push(pedido.observacoes);
    lines.push(line);
  }

  return lines.join("\n");
}

function formatDate(value: Date): string {
  const pad = (num: number) => num.toString().padStart(2, "0");
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(
    value.getDate()
  )} ${pad(value.getHours())}:${pad(value.getMinutes())}`;
}

function centerText(text: string, width: number): string {
  if (text.length >= width) return text;
  const left = Math.floor((width - text.length) / 2);
  return `${" ".repeat(left)}${text}`;
}
