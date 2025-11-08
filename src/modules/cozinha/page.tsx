"use client";

import { useEffect, useState } from "react";
import { listarPedidosAgrupadosPorMesa, atualizarStatusPedido } from "@/src/modules/cozinha/services/pedidoService";
import MesaCard from "./components/MesaCard";
import { PedidoComItens } from "@/src/modules/cozinha/services/pedidoService";

export default function TelaCozinha() {
  const [pedidos, setPedidos] = useState<{ mesa: number; pedidos: PedidoComItens[] }[]>([]);
  const [carregando, setCarregando] = useState(true);

  async function carregarPedidos() {
    try {
      setCarregando(true);
      const dados = await listarPedidosAgrupadosPorMesa();
      setPedidos(dados);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
    } finally {
      setCarregando(false);
    }
  }

  async function handleAtualizarStatus(pedidoId: number, novoStatus: "pendente" | "preparando" | "pronto") {
    await atualizarStatusPedido(pedidoId, novoStatus);
    await carregarPedidos(); // Atualiza a tela
  }

  useEffect(() => {
    carregarPedidos();

    // Atualiza automaticamente a cada 15 segundos
    const timer = setInterval(carregarPedidos, 15000);
    return () => clearInterval(timer);
  }, []);

  if (carregando) {
    return <p className="text-center text-gray-500 mt-8">Carregando pedidos...</p>;
  }

  if (pedidos.length === 0) {
    return <p className="text-center text-gray-400 mt-8">Nenhum pedido ativo no momento 🍽️</p>;
  }

  return (
    <div className="p-6 bg-amber-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-amber-800 text-center">👨‍🍳 Pedidos da Cozinha</h1>
      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
        {pedidos.map(({ mesa, pedidos }) => (
          <MesaCard key={mesa} mesa={mesa} pedidos={pedidos} onStatusChange={handleAtualizarStatus} />
        ))}
      </div>
    </div>
  );
}
