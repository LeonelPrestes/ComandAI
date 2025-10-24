🧩 📁 Estrutura geral do projeto

<pre>restaurante_offline/
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma                # modelos do banco (SQLite)
│   └── seed.ts                      # dados iniciais (categorias, mesas)
│
├── src/
│   ├── main/                        # Processo principal do Electron
│   │   ├── main.ts                  # ponto de entrada do app Electron
│   │   ├── preload.ts               # comunicação entre Electron e Next
│   │   ├── printerService.ts        # integração com impressora (SerialPort / TCP)
│   │   ├── updater.ts               # (opcional) sistema de atualização automática
│   │   └── licenseChecker.ts        # verificação de licença na nuvem
│   │
│   ├── renderer/                    # Projeto Next.js (interface e API local)
│   │   ├── app/                     # App Router do Next
│   │   │   ├── layout.tsx           # layout principal (Header/Footer)
│   │   │   ├── page.tsx             # tela principal / login
│   │   │   ├── garcom/
│   │   │   │   └── page.tsx         # interface do garçom
│   │   │   ├── cozinha/
│   │   │   │   └── page.tsx         # interface da cozinha
│   │   │   ├── caixa/
│   │   │   │   └── page.tsx         # controle de mesas e fechamento
│   │   │   └── estoque/
│   │   │       └── page.tsx         # controle de estoque
│   │   │
│   │   ├── api/                     # rotas internas (rodando localmente)
│   │   │   ├── pedidos/
│   │   │   │   └── route.ts         # POST (novo pedido), GET (listar pedidos)
│   │   │   ├── mesas/
│   │   │   │   └── route.ts         # CRUD de mesas
│   │   │   ├── caixa/
│   │   │   │   └── route.ts         # abertura/fechamento de comandas
│   │   │   ├── estoque/
│   │   │   │   └── route.ts         # atualização de estoque
│   │   │   └── sync/
│   │   │       └── route.ts         # envia logs / backup para a nuvem
│   │   │
│   │   ├── components/              # componentes React reutilizáveis
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── PedidoCard.tsx
│   │   │   ├── MesaCard.tsx
│   │   │   └── Header.tsx
│   │   │
│   │   ├── context/                 # contextos React
│   │   │   ├── PedidoContext.tsx
│   │   │   └── CaixaContext.tsx
│   │   │
│   │   ├── hooks/                   # hooks customizados
│   │   │   ├── usePedidos.ts
│   │   │   └── useEstoque.ts
│   │   │
│   │   ├── lib/
│   │   │   ├── db.ts                # inicialização do Prisma + SQLite
│   │   │   └── helpers.ts           # utilitários gerais
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   └── variables.css
│   │   │
│   │   └── types/
│   │       ├── pedido.d.ts
│   │       ├── mesa.d.ts
│   │       └── produto.d.ts
│   │
│   └── assets/
│       └── logo.png
│
├── electron-builder.yml             # configuração para gerar instalador .exe
├── .env                             # variáveis locais (chave de licença, URL API)
└── README.md</pre>

--

⚙️ 2️⃣ Fluxo interno

[1] Garçom faz pedido  → /api/pedidos (local)
[2] Pedido salvo em SQLite (Prisma)
[3] Impressora térmica é acionada via SerialPort ou TCP
[4] Cozinha exibe o pedido em tempo real (WebSocket local)
[5] Caixa acompanha e fecha comandas
[6] Estoque é atualizado localmente (decrementa ingredientes)
[7] Uma vez ao dia:
      ↳ Electron → verifica licença na API da nuvem
      ↳ Electron → sincroniza logs e backup (opcional)
      ↳ Electron → consulta IA (para WhatsApp ou sugestões)

--

☁️ 3️⃣ API Cloud

<pre>comandai-cloud/
├── app/
│   ├── api/
│   │   ├── license/
│   │   │   ├── route.ts      # valida licenças (POST /validate)
│   │   │   └── renew.ts       # renova pagamento
│   │   ├── ia/
│   │   │   └── route.ts      # integração com IA (OpenAI / GPT)
│   │   └── backup/
│   │       └── route.ts      # recebe backup ou logs
│   └── dashboard/
│       └── page.tsx          # painel web (opcional)
├── lib/mongodb.ts             # conexão com Atlas
├── models/
│   ├── License.ts
│   ├── Cliente.ts
│   └── Backup.ts
└── package.json<pre>

--

🧠 4️⃣ Tecnologias principais do sistema local

| Camada        | Tecnologia                        | Função                                      |
| ------------- | --------------------------------- | ------------------------------------------- |
| Frontend      | **Next.js + React + TypeScript**  | Interface web do sistema                    |
| Backend       | **Next.js API Routes (Node)**     | Requisições locais (pedidos, estoque, etc.) |
| Banco         | **SQLite + Prisma ORM**           | Banco leve e rápido, local                  |
| Desktop       | **Electron**                      | Empacota tudo e executa offline             |
| Impressão     | **SerialPort / net.Socket (TCP)** | Comunicação com impressora USB ou Wi-Fi     |
| Estado global | **Context API ou Zustand**        | Estado dos pedidos e mesas                  |
| Estilos       | **TailwindCSS**                   | Estilização rápida e responsiva             |
| Nuvem         | **Next.js (Vercel)**              | API leve de licenças e IA                   |
| Backup        | **MongoDB Atlas**                 | Armazenar relatórios e logs remotos         |

--

🖨️ 5️⃣ Comunicação com impressora (resumo técnico)

| Tipo de impressora                     | Lib usada    | Exemplo de conexão                                 |
| -------------------------------------- | ------------ | -------------------------------------------------- |
| USB / Serial (ex: Bematech MP-4200 TH) | `serialport` | `new SerialPort({ path: "COM3", baudRate: 9600 })` |
| Wi-Fi / Ethernet (ex: Elgin i9 Wi-Fi)  | `net` (TCP)  | `socket.connect(9100, "192.168.15.200")`           |

--

💾 6️⃣ Banco SQLite (Prisma)

datasource db {
  provider = "sqlite"
  url      = "file:./restaurante.db"
}

generator client {
  provider = "prisma-client-js"
}

model Pedido {
  id        Int      @id @default(autoincrement())
  mesa      Int
  itens     String   // JSON stringificado
  total     Float
  status    String   @default("pendente")
  criadoEm  DateTime @default(now())
}

model Produto {
  id         Int      @id @default(autoincrement())
  nome       String
  preco      Float
  categoria  String
  estoque    Int
}

model Mesa {
  id       Int      @id @default(autoincrement())
  numero   Int
  aberta   Boolean  @default(false)
  pedidos  String?
}

--

🌐 7️⃣ Comunicação com IA / Licença (na nuvem)

import fetch from "node-fetch";

async function verificarLicenca() {
  const res = await fetch("https://comandai-cloud.vercel.app/api/license/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      licenseKey: process.env.LICENSE_KEY,
      machineId: "PC-1234-ABCD"
    })
  });
  const data = await res.json();
  if (!data.valid) {
    console.log("🚫 Licença expirada ou inválida");
  } else {
    console.log("✅ Licença ativa");
  }
}

--

⚙️ 8️⃣ Build e distribuição

npm run build

👉 Saída:

/dist/ComandAI-Setup-1.0.0.exe

A impressora é detectada automaticamente via SerialPort.list() ou IP configurado.

--

✅ 9️⃣ Benefício final da arquitetura

| Benefício                                      | Impacto                                       |
| ---------------------------------------------- | --------------------------------------------- |
| Funciona **100% offline**                      | Pedido e impressão nunca travam               |
| IA / WhatsApp funcionam **quando há internet** | Automatização inteligente                     |
| Controle de licença via nuvem                  | Venda recorrente protegida                    |
| Banco local leve (SQLite)                      | Instalação e backup simples                   |
| Sistema entregável via `.exe`                  | Instalação amigável e profissional            |
| Atualizações automáticas (opcional)            | Você mantém todos os clientes na mesma versão |
