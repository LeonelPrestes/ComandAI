"use client";

import { useState } from "react";
import {
  PedidoComItens,
  atualizarStatusPedido,
  cancelarPedido,
} from "../services/pedidoService";

/**
 * =========================================================
 * 🔸 Componente PedidoLista
 * =========================================================
 * Lista pedidos existentes de uma comanda.
 * Permite:
 *  - Atualizar status (pendente → preparando → pronto → entregue)
 *  - Cancelar pedido
 * =========================================================
 */
type Props = {
  pedidos: PedidoComItens[];
  onRefresh: () => Promise<void>; // usado após atualizar/cancelar
};

const statusLabels: Record<string, string> = {
  pendente: "Pendente",
  preparando: "Preparando",
  pronto: "Pronto",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

const statusColors: Record<string, string> = {
  pendente: "bg-yellow-100 text-yellow-800 border-yellow-300",
  preparando: "bg-orange-100 text-orange-800 border-orange-300",
  pronto: "bg-green-100 text-green-800 border-green-300",
  entregue: "bg-blue-100 text-blue-800 border-blue-300",
  cancelado: "bg-red-100 text-red-800 border-red-300",
};

export default function PedidoLista({ pedidos, onRefresh }: Props) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  if (!pedidos || pedidos.length === 0) {
    return (
      <p className="text-gray-400 text-sm italic text-center">
        Nenhum pedido feito ainda.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {pedidos.map((pedido) => {
        const proxStatus =
          pedido.status === "pendente"
            ? "preparando"
            : pedido.status === "preparando"
            ? "pronto"
            : pedido.status === "pronto"
            ? "entregue"
            : "pendente";

        const handleStatusChange = async () => {
          setLoadingId(pedido.id);
          await atualizarStatusPedido(pedido.id, proxStatus as any);
          await onRefresh();
          setLoadingId(null);
        };

        const handleCancelar = async () => {
          if (!confirm("Deseja realmente cancelar este pedido?")) return;
          setLoadingId(pedido.id);
          await cancelarPedido(pedido.id);
          await onRefresh();
          setLoadingId(null);
        };

        return (
          <div
            key={pedido.id}
            className="border rounded-xl p-3 shadow-sm bg-white transition hover:shadow-md"
          >
            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">
                  Pedido #{pedido.id}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(pedido.data_hora).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <span
                className={`px-2 py-1 rounded text-xs font-medium border ${
                  statusColors[pedido.status] ?? "bg-gray-100 text-gray-600"
                }`}
              >
                {statusLabels[pedido.status] ?? pedido.status}
              </span>
            </div>

            {/* Lista de Itens */}
            <ul className="text-sm text-gray-700 mb-3">
              {pedido.itens.map((it) => (
                <li key={it.id} className="flex justify-between">
                  <span>
                    {it.quantidade}× {it.produto.nome}
                  </span>
                  <span className="text-gray-500">
                    R${" "}
                    {((it.preco_unitario ?? 0) * it.quantidade)
                      .toFixed(2)
                      .replace(".", ",")}
                  </span>
                </li>
              ))}
            </ul>

            {/* Valor total */}
            <p className="text-right text-sm font-semibold text-gray-700">
              Total: R${" "}
              {(pedido.valor_total ?? 0).toFixed(2).replace(".", ",")}
            </p>

            {/* Ações */}
            {pedido.status !== "cancelado" && (
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={handleStatusChange}
                  disabled={loadingId === pedido.id}
                  className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50"
                >
                  Atualizar → {statusLabels[proxStatus]}
                </button>

                <button
                  onClick={handleCancelar}
                  disabled={loadingId === pedido.id}
                  className="text-xs px-3 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
