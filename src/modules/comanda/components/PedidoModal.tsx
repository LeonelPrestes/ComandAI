"use client";
import { useEffect, useState } from "react";
import { Produto } from "../../../types/produto";
import { ItemSelecionado } from "../../../types/pedido";
import { precoUnitario } from "../utils/precoUnitario";
import {
  criarPedido,
  listarPedidosPorComanda,
  PedidoComItens,
} from "../services/pedidoService";
import PedidoLista from "./PedidoLista";

type Props = {
  comandaId: number; // ID da comanda real
  garcomId: number;
  onClose: () => void;
};

type PedidoExistente = {
  id: number;
  status: string;
  observacoes?: string | null;
  itens: {
    id: number;
    quantidade: number;
    produto: { nome: string; preco: number; preco_meia?: number | null };
  }[];
};

export default function PedidoModal({ comandaId, garcomId, onClose }: Props) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [itens, setItens] = useState<ItemSelecionado[]>([]);
  const [pedidosExistentes, setPedidosExistentes] = useState<PedidoExistente[]>([]);
  const [observacoes, setObservacoes] = useState("");
  const [carregando, setCarregando] = useState(true);

  // 🔹 Carrega cardápio e pedidos da comanda
  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);

        // 1️⃣ Busca cardápio
        const resProdutos = await fetch("/api/produtos");
        if (!resProdutos.ok) throw new Error("Erro ao carregar cardápio");
        const dataProdutos = await resProdutos.json();
        setProdutos(dataProdutos);

        // 2️⃣ Busca pedidos da comanda
        const resComanda = await fetch(`/api/comandas/${comandaId}`);
        if (resComanda.ok) {
          const dataComanda = await resComanda.json();
          setPedidosExistentes(dataComanda.pedidos || []);
        } else {
          console.warn("Nenhum pedido existente encontrado para esta comanda.");
        }
      } catch (error) {
        console.error("❌ Erro ao carregar dados do modal:", error);
        alert("Erro ao carregar informações. Tente novamente.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [comandaId]);

  // =========================================================
  // 🧾 FUNÇÕES DE MANIPULAÇÃO DE ITENS
  // =========================================================
  function adicionarItem(produto: Produto, meia = false) {
    const existente = itens.find(
      (i) => i.produto.id === produto.id && i.meia === meia
    );
    if (existente) {
      existente.quantidade += 1;
      setItens([...itens]);
    } else {
      setItens([...itens, { produto, quantidade: 1, meia } as ItemSelecionado]);
    }
  }

  function diminuirItem(index: number) {
    const novos = [...itens];
    if (novos[index].quantidade > 1) {
      novos[index].quantidade -= 1;
      setItens(novos);
    } else {
      removerItem(index);
    }
  }

  function removerItem(index: number) {
    const novos = [...itens];
    novos.splice(index, 1);
    setItens(novos);
  }

  // =========================================================
  // 🚀 ENVIO DO PEDIDO
  // =========================================================
  async function enviarPedido() {
    if (itens.length === 0) {
      alert("Selecione pelo menos um item antes de enviar o pedido.");
      return;
    }

    const itensFormatados = itens.map((it) => ({
      produto_id: it.produto.id,
      quantidade: it.quantidade,
      preco_unitario: precoUnitario(it.produto, it.meia),
    }));

    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comandaId,
          garcomId,
          itens: itensFormatados,
          observacoes,
        }),
      });

      if (!res.ok) throw new Error("Erro ao enviar pedido");

      const data = await res.json();
      if (data?.printError) {
        alert("Pedido enviado, mas houve erro ao imprimir.");
      } else {
        alert("✅ Pedido enviado com sucesso!");
      }
      setItens([]);
      onClose();
    } catch (error) {
      console.error("❌ Erro ao enviar pedido:", error);
      alert("Erro ao enviar pedido. Tente novamente.");
    }
  }

  // =========================================================
  // 💰 CÁLCULO DE TOTAL
  // =========================================================
  const total = itens.reduce((sum, it) => {
    const preco = precoUnitario(it.produto, it.meia);
    return sum + preco * it.quantidade;
  }, 0);
  const formatar = (v: number) => v.toFixed(2).replace(".", ",");

  // =========================================================
  // 🎨 RENDERIZAÇÃO
  // =========================================================
  if (carregando) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Carregando cardápio e pedidos...</p>
        </div>
      </div>
    );
  }

  // Agrupar produtos por categoria
  const produtosPorCategoria = produtos.reduce<Record<string, Produto[]>>(
    (acc, p) => {
      const categoria = p.categoria?.nome || "Outros";
      if (!acc[categoria]) acc[categoria] = [];
      acc[categoria].push(p);
      return acc;
    },
    {}
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          Novo Pedido — Comanda #{comandaId}
        </h2>

        {/* 🧾 Pedidos existentes */}
        {pedidosExistentes.length > 0 && (
          <div className="mb-6 border-b pb-4">
            <h3 className="font-bold text-lg mb-2 text-gray-700">
              Pedidos Anteriores
            </h3>
            {pedidosExistentes.map((p) => (
              <div key={p.id} className="mb-3 border rounded-lg p-3 bg-gray-50">
                <p className="text-sm text-gray-700 font-medium">
                  Pedido #{p.id} — <span className="capitalize">{p.status}</span>
                </p>
                <ul className="mt-1 text-sm text-gray-600">
                  {p.itens.map((i) => (
                    <li key={i.id}>
                      {i.quantidade}× {i.produto.nome}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* 🧾 Novo pedido */}
        {Object.entries(produtosPorCategoria).map(([categoria, lista]) => (
          <div key={categoria}>
            <h3 className="font-bold text-lg mb-2 border-b pb-1">
              {categoria}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {lista.map((p) => (
                <div
                  key={p.id}
                  className="border rounded-lg p-2 flex flex-col items-center justify-between hover:bg-blue-50"
                >
                  <p className="text-sm text-center font-medium mb-1">{p.nome}</p>
                  <p className="text-xs text-gray-500 mb-2">
                    R$ {formatar(p.preco)}
                    {p.aceita_meia && p.preco_meia
                      ? ` / Meia: R$ ${formatar(p.preco_meia)}`
                      : ""}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => adicionarItem(p, false)}
                      className="bg-green-600 text-white px-2 py-1 text-xs rounded hover:bg-green-700"
                    >
                      Inteira
                    </button>
                    {p.aceita_meia && (
                      <button
                        onClick={() => adicionarItem(p, true)}
                        className="bg-amber-500 text-white px-2 py-1 text-xs rounded hover:bg-amber-600"
                      >
                        Meia
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* 🧾 Itens adicionados */}
        {itens.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h3 className="font-semibold mb-2">Itens do Pedido</h3>
            <ul className="space-y-2">
              {itens.map((it, idx) => (
                <li key={idx} className="flex justify-between items-center text-sm border-b pb-1">
                  <div className="flex flex-col">
                    <span>
                      {it.produto.nome} {it.meia && "(Meia)"}
                    </span>
                    <span className="text-xs text-gray-600">
                      R$ {formatar(precoUnitario(it.produto, it.meia))} × {it.quantidade} ={" "}
                      <strong>R$ {formatar(precoUnitario(it.produto, it.meia) * it.quantidade)}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => diminuirItem(idx)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      –
                    </button>
                    <span className="w-5 text-center">{it.quantidade}</span>
                    <button
                      onClick={() => adicionarItem(it.produto, it.meia)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removerItem(idx)}
                      className="text-red-500 hover:underline text-xs ml-2"
                    >
                      remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <p className="text-right font-semibold text-lg mt-3">
              Total: R$ {formatar(total)}
            </p>
          </div>
        )}

        {/* Observações */}
        <textarea
          placeholder="Observações (ex: sem cebola, bem passado...)"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className="w-full border rounded p-2 mb-4 mt-4"
        />

        {/* Botões */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-3 py-1 border rounded-md hover:bg-gray-100">
            Cancelar
          </button>
          <button
            onClick={enviarPedido}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Enviar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
