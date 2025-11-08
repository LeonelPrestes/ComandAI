import PedidoItem from "./PedidoItem";
import { PedidoComItens } from "@/src/modules/cozinha/services/pedidoService";

interface PedidoCardProps {
  pedido: PedidoComItens;
  onStatusChange: (pedidoId: number, novoStatus: "pendente" | "preparando" | "pronto") => void;
}

export default function PedidoCard({ pedido, onStatusChange }: PedidoCardProps) {
  const corStatus: Record<string, string> = {
    pendente: "bg-yellow-100 text-yellow-800 border-yellow-300",
    preparando: "bg-blue-100 text-blue-800 border-blue-300",
    pronto: "bg-green-100 text-green-800 border-green-300",
  };

  const proximoStatus: Record<string, "pendente" | "preparando" | "pronto"> = {
    pendente: "preparando",
    preparando: "pronto",
    pronto: "pronto",
  };

  return (
    <div className="border border-amber-200 rounded-xl p-3 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">Pedido #{pedido.id}</span>
        <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${corStatus[pedido.status]}`}>
          {pedido.status.toUpperCase()}
        </span>
      </div>

      <ul className="space-y-1">
        {pedido.itens.map((item) => (
          <PedidoItem key={item.id} item={item} />
        ))}
      </ul>

      {pedido.status !== "pronto" && (
        <button
          onClick={() => onStatusChange(pedido.id, proximoStatus[pedido.status])}
          className="mt-3 w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-1.5 rounded-lg text-sm transition-colors"
        >
          Marcar como {proximoStatus[pedido.status].toUpperCase()}
        </button>
      )}
    </div>
  );
}
