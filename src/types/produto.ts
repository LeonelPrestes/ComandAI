/**
 * 🔹 Representa um produto do cardápio.
 * Alinhado com a tabela `produto` do Prisma.
 */
export type Produto = {
  id: number;
  nome: string;
  preco: number;
  preco_meia?: number | null;
  aceita_meia?: boolean;
  ativo?: boolean;
  descricao?: string | null;

  categoria_id?: number | null;
  categoria?: {
    id: number;
    nome: string;
    descricao?: string | null;
  } | null;

  cardapio_id?: number | null;
};
