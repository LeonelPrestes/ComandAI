interface PedidoItemProps {
  item: {
    id: number;
    quantidade: number;
    produto: { nome: string };
  };
}

export default function PedidoItem({ item }: PedidoItemProps) {
  return (
    <li className="flex justify-between items-center">
      <span className="font-medium text-gray-700">
        {item.quantidade}x {item.produto.nome}
      </span>
    </li>
  );
}
