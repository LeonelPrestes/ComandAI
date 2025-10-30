comandai/
├── app/
│   ├── layout.tsx                # layout global (Header/Footer)
│   ├── page.tsx                  # dashboard principal
│   │
│   ├── garcom/
│   │   ├── page.tsx              # tela do garçom (fazer pedido)
│   │   └── components/
│   │       ├── ItemCard.tsx
│   │       └── PedidoModal.tsx
│   │
│   ├── cozinha/
│   │   ├── page.tsx              # tela da cozinha (pedidos pendentes)
│   │   └── components/
│   │       ├── PedidoCard.tsx
│   │       └── StatusButton.tsx
│   │
│   ├── caixa/
│   │   ├── page.tsx              # tela de fechamento de mesa
│   │   └── components/
│   │       ├── MesaCard.tsx
│   │       └── PagamentoModal.tsx
│   │
│   ├── estoque/
│   │   ├── page.tsx              # tela de controle de estoque
│   │   └── components/
│   │       ├── ProdutoCard.tsx
│   │       └── AjusteModal.tsx
│   │
│   ├── config/
│   │   ├── page.tsx              # configurações gerais (porta COM, rede, etc.)
│   │   └── components/
│   │       ├── ImpressoraConfig.tsx
│   │       └── LicenseStatus.tsx
│   │
│   ├── api/
│   │   ├── pedidos/
│   │   │   ├── route.ts          # CRUD de pedidos (local)
│   │   │   └── schema.ts
│   │   ├── estoque/
│   │   │   └── route.ts          # CRUD de estoque (local)
│   │   ├── mesas/
│   │   │   └── route.ts          # CRUD de mesas (local)
│   │   ├── caixa/
│   │   │   └── route.ts          # Fechamento de mesas (local)
│   │   └── license/
│   │       └── validate/route.ts # (opcional) endpoint interno que usa licenseManager
│
├── modules/
│   ├── comanda/
│   │   ├── services/
│   │   │   └── pedidosService.ts # CRUD de pedidos no SQLite via Prisma
│   │   ├── hooks/
│   │   │   └── usePedidos.ts     # hook para UI do garçom
│   │   └── utils/
│   │       └── formatPedido.ts
│   │
│   ├── caixa/
│   │   └── services/
│   │       └── caixaService.ts   # abrir/fechar mesa, somar total, etc.
│   │
│   ├── estoque/
│   │   └── services/
│   │       └── estoqueService.ts # controle de entrada/saída
│   │
│   ├── ia/
│   │   ├── services/
│   │   │   ├── whatsapp.ts       # integração com API Meta (envio de msg)
│   │   │   └── openai.ts         # IA que entende pedidos via texto/áudio
│   │   └── controller.ts
│   │
│   └── license/
│       ├── licenseManager.ts     # 🔹 verifica licença e guarda cache
│       ├── licenseCache.json     # 🔹 arquivo local salvo em disco
│       ├── checkAccess.ts        # middleware: bloqueia módulos pagos
│       └── licenseTypes.ts       # planos e módulos habilitados
│
├── lib/
│   ├── prisma/
│   │   ├── schema.prisma         # banco local SQLite
│   │   └── client.ts             # inicializa PrismaClient
│   │
│   ├── printer/
│   │   └── printerService.ts     # conexão com impressora térmica (SerialPort)
│   │
│   ├── utils/
│   │   ├── formatDate.ts
│   │   └── calcTotals.ts
│
├── public/
│   ├── icons/
│   ├── logo.png
│   └── sounds/
│       └── notification.mp3
│
├── styles/
│   ├── globals.css
│   └── tailwind.css
│
├── package.json
├── next.config.js
└── tsconfig.json
