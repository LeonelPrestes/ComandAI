// src/modules/comanda/utils/precoUnitario.ts
import { Produto } from "../../../types/produto";

export function precoUnitario(produto: Produto, meia?: boolean) {
  return meia ? produto.preco_meia ?? produto.preco : produto.preco;
}
