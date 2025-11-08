"use client";
import { useEffect, useState } from "react";
import MesaCard from "./MesaCard";
import PedidoModal from "./PedidoModal";

type Mesa = {
  id: number;
  numero: number;
  status: { nome: string; cor?: string };
};

export default function MesaGrid() {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [mesaSelecionada, setMesaSelecionada] = useState<Mesa | null>(null);
  const [comandaAtual, setComandaAtual] = useState<number | null>(null);

  // 🔹 Carrega mesas do backend
  async function carregarMesas() {
    try {
      const res = await fetch("/api/mesas");
      if (!res.ok) throw new Error("Erro ao carregar mesas");
      const data = await res.json();
      setMesas(data);
    } catch (error) {
      console.error("❌ Erro ao carregar mesas:", error);
    }
  }

  useEffect(() => {
    carregarMesas();
  }, []);

  // ======================================================
  // 🔸 Quando clica em uma mesa
  // ======================================================
  async function handleClickMesa(mesa: Mesa) {
    try {
      // 🔹 Se mesa disponível → abre comanda nova
      if (mesa.status.nome === "disponível") {
        const res = await fetch("/api/comandas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mesaId: mesa.id, garcomId: 1 }),
        });

        if (!res.ok) throw new Error("Erro ao abrir comanda");

        const comanda = await res.json();
        alert(`✅ Comanda ${comanda.id} aberta para a mesa ${mesa.numero}!`);

        setComandaAtual(comanda.id);
        setMesaSelecionada(mesa);
        await carregarMesas();
        return;
      }

      // 🔹 Se mesa ocupada → buscar comanda existente
      if (mesa.status.nome === "ocupada") {
        const res = await fetch(`/api/comandas/mesa/${mesa.id}`);
        if (!res.ok) throw new Error("Erro ao buscar comanda ativa");

        const comanda = await res.json();
        console.log("🧾 Comanda atual encontrada:", comanda);

        setComandaAtual(comanda.id);
        setMesaSelecionada(mesa);
        return;
      }

      // 🔹 Outros status (ex: conta, fechada)
      alert(`⚠️ A mesa ${mesa.numero} está com status "${mesa.status.nome}" e não pode ser alterada agora.`);
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao processar a ação.");
    }
  }

  // ======================================================
  // 🔸 Fechar comanda
  // ======================================================
  async function handleFecharMesa(mesaId: number) {
    try {
      const confirmar = confirm(`Deseja fechar a comanda da mesa ${mesaId}?`);
      if (!confirmar) return;

      const res = await fetch("/api/comandas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mesaId }),
      });

      if (!res.ok) throw new Error("Erro ao fechar comanda");

      const result = await res.json();
      alert(`💰 ${result.message}`);

      await carregarMesas();
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao fechar comanda.");
    }
  }

  // ======================================================
  // 🔸 Renderização
  // ======================================================
  return (
    <>
      {/* 🔹 Grade de mesas */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4 p-4">
        {mesas.map((m) => (
          <MesaCard
            key={m.id}
            numero={m.numero}
            status={m.status.nome}
            cor={m.status.cor}
            onClick={() => handleClickMesa(m)}
          />
        ))}
      </div>

      {/* 🔹 Modal de pedido (só abre se tiver comanda ativa) */}
      {mesaSelecionada && comandaAtual && (
        <PedidoModal
          comandaId={comandaAtual}
          garcomId={1}
          onClose={async () => {
            setMesaSelecionada(null);
            setComandaAtual(null);
            await carregarMesas(); // atualiza status
          }}
        />
      )}
    </>
  );
}
