import { Produto } from "./produto";

export type ItemSelecionado = {
  produto: Produto;
  quantidade: number;
  meia?: boolean;
};

export type PedidoItem = {
  id: number;
  nome: string;
  quantidade: number;
  meia: boolean;
};

export type Pedido = {
  id: number;
  mesa: number;
  status: string;
  observacoes?: string | null;
  criado_em: string;
  itens: PedidoItem[];
};
