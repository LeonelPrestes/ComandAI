import PedidoCard from "./PedidoCard";
import { PedidoComItens } from "@/src/modules/cozinha/services/pedidoService";

interface MesaCardProps {
  mesa: number;
  pedidos: PedidoComItens[];
  onStatusChange: (pedidoId: number, novoStatus: "pendente" | "preparando" | "pronto") => void;
}

export default function MesaCard({ mesa, pedidos, onStatusChange }: MesaCardProps) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 border border-amber-200">
      <h2 className="text-xl font-semibold text-amber-700 mb-3">
        🪑 Mesa {mesa === 0 ? "Delivery" : mesa}
      </h2>

      <div className="space-y-4">
        {pedidos.map((pedido) => (
          <PedidoCard key={pedido.id} pedido={pedido} onStatusChange={onStatusChange} />
        ))}
      </div>
    </div>
  );
}
