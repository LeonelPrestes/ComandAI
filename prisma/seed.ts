import { PrismaClient, TipoCardapio } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Iniciando seed do banco...");

  /* =========================================================
     🔹 1. STATUS DE MESAS
  ========================================================= */
  const statusMesa = [
    { nome: "disponível", cor: "#22c55e", descricao: "Mesa livre para uso" },
    { nome: "ocupada", cor: "#ef4444", descricao: "Mesa atualmente ocupada" },
    { nome: "reservada", cor: "#f59e0b", descricao: "Mesa reservada" },
    { nome: "inativa", cor: "#9ca3af", descricao: "Mesa fora de operação" },
  ];

  for (const s of statusMesa) {
    await prisma.status_mesa.upsert({
      where: { nome: s.nome },
      update: {},
      create: s,
    });
  }

  /* =========================================================
     🔹 2. STATUS DE COMANDA
  ========================================================= */
  const statusComanda = [
    { nome: "aberta", cor: "#22c55e", descricao: "Aceitando pedidos" },
    { nome: "conta", cor: "#eab308", descricao: "Cliente pediu para fechar" },
    { nome: "fechada", cor: "#f97316", descricao: "Aguardando pagamento" },
    { nome: "paga", cor: "#3b82f6", descricao: "Comanda paga" },
    { nome: "transferida", cor: "#6366f1", descricao: "Itens transferidos" },
    {
      nome: "transferida_parcialmente",
      cor: "#a855f7",
      descricao: "Parte dos itens foi transferida",
    },
    { nome: "cancelada", cor: "#ef4444", descricao: "Comanda cancelada" },
    { nome: "pendente", cor: "#f59e0b", descricao: "Cliente ficou de pagar depois" },
  ];

  for (const s of statusComanda) {
    await prisma.status_comanda.upsert({
      where: { nome: s.nome },
      update: {},
      create: s,
    });
  }

  /* =========================================================
     🔹 3. GARÇOM PADRÃO
  ========================================================= */
  await prisma.garcom.upsert({
    where: { nome: "Garçom Padrão" },
    update: {},
    create: { nome: "Garçom Padrão", telefone: "", ativo: true },
  });

  /* =========================================================
     🔹 4. MESAS
  ========================================================= */
  const statusDisponivel = await prisma.status_mesa.findFirst({
    where: { nome: "disponível" },
  });

  for (let i = 0; i <= 25; i++) {
    const numeroMesa = i === 0 ? 100 : i;
    await prisma.mesa.upsert({
      where: { numero: numeroMesa },
      update: {},
      create: {
        numero: numeroMesa,
        status_id: statusDisponivel!.id,
        capacidade: 4,
        ativa: true,
      },
    });
  }

  /* =========================================================
     🔹 5. CARDÁPIOS COM ENUM (SEMANA | FDS)
  ========================================================= */
  const hoje = new Date().getDay(); // 0=Domingo, 6=Sábado
  const ativoSemana = hoje >= 1 && hoje <= 5;
  const ativoFDS = hoje === 0 || hoje === 6;

  const cardapioSemana = await prisma.cardapio.upsert({
    where: { tipo: TipoCardapio.SEMANA },
    update: { ativo: ativoSemana },
    create: {
      nome: "Cardápio Semana",
      descricao: "Cardápio de segunda a sexta",
      ativo: ativoSemana,
      tipo: TipoCardapio.SEMANA,
    },
  });

  const cardapioFDS = await prisma.cardapio.upsert({
    where: { tipo: TipoCardapio.FDS },
    update: { ativo: ativoFDS },
    create: {
      nome: "Cardápio Fim de Semana",
      descricao: "Cardápio de sábado e domingo",
      ativo: ativoFDS,
      tipo: TipoCardapio.FDS,
    },
  });

  /* =========================================================
     🔹 6. CATEGORIAS E PRODUTOS (COMPLETOS)
  ========================================================= */

  // CATEGORIAS E ITENS DO CARDÁPIO SEMANAL
  const categoriasSemana = [
    {
      nome: "Pratos Executivos",
      itens: [
        { nome: "PRATO DO DIA", preco: 22.9 },
        { nome: "FEIJOADA", preco: 24.9 },
        { nome: "EXEC FRANGO GRELHADO", preco: 24.9 },
        { nome: "EXEC FRANGO A MILANESA", preco: 26.9 },
        { nome: "EXEC FRANGO A PARMEGIANA", preco: 28.9 },
        { nome: "EXEC PORCO GRELHADO", preco: 25.9 },
        { nome: "EXEC BOI GRELHADO", preco: 31.9 },
        { nome: "EXEC BOI A MILANESA", preco: 33.9 },
        { nome: "EXEC BOI A PARMEGIANA", preco: 35.9 },
        { nome: "EXEC TILAPIA GRELHADA", preco: 31.9 },
        { nome: "EXEC DE FIGADO", preco: 24.9 },
      ],
    },
    {
      nome: "Massas da Semana",
      itens: [
        { nome: "PENNE", preco: 24.9 },
        { nome: "TALHARIM", preco: 24.9 },
        { nome: "ESPAGUETE", preco: 24.9 },
      ],
    },
    {
      nome: "Petiscos",
      itens: [
        { nome: "EMPADA", preco: 9.0 },
        { nome: "TORRESMO 100G", preco: 8.49 },
        { nome: "BOLINHO DE BACALHAU", preco: 39.0, preco_meia: 23.9 },
        { nome: "CAMARAO EMPANADO", preco: 39.0, preco_meia: 23.9 },
        { nome: "CONTRA FILE COM FRITAS", preco: 49.0, preco_meia: 29.9 },
        { nome: "FRITAS", preco: 28.0, preco_meia: 16.8 },
        { nome: "FRITAS COM LINGUICA", preco: 34.0, preco_meia: 20.4 },
        { nome: "FIGADO COM JILO", preco: 32.0, preco_meia: 19.2 },
        { nome: "MOELINHA", preco: 34.0, preco_meia: 20.4 },
        { nome: "LINGUA DE BOI AO MOLHO DE VINHO", preco: 32.0, preco_meia: 19.2 },
        { nome: "ISCA DE TILAPIA", preco: 49.0, preco_meia: 29.9 },
        { nome: "PASTEL QUEIJO", preco: 24.0, preco_meia: 14.4 },
        { nome: "CAMARAO ALHO E OLEO", preco: 39.0, preco_meia: 23.9 },
        { nome: "PROVOLONE NA PEDRA", preco: 31.0, preco_meia: 18.6 },
        { nome: "FEIJAO AMIGO", preco: 6.0 },
        { nome: "TRUPICO", preco: 15.0, preco_meia: 9.0 },
      ],
    },
  ];

  // CATEGORIAS E ITENS DO CARDÁPIO DE FIM DE SEMANA
  const categoriasFDS = [
    {
      nome: "Pratos FDS",
      itens: [
        { nome: "EXECUTIVO DE FRANGO", preco: 29.9 },
        { nome: "EXECUTIVO DE PORCO", preco: 29.9 },
        { nome: "EXECUTIVO DE BOI", preco: 37.9 },
        { nome: "EXECUTIVO DE PEIXE", preco: 35.9 },
      ],
    },
    {
      nome: "Pratos A La Carte",
      itens: [
        { nome: "PARMEGIANA DE FRANGO", preco: 86.0, preco_meia: 51.6 },
        { nome: "FILE DE FRANGO C/ CHAMPIGNON", preco: 90.0, preco_meia: 54.0 },
        { nome: "PARMEGIANA DE BOI", preco: 98.0, preco_meia: 58.8 },
        { nome: "CONTRA FILE C/ FRITAS", preco: 92.0, preco_meia: 55.2 },
        { nome: "FILE MIGNON C/ FRITAS", preco: 116.0, preco_meia: 69.6 },
        { nome: "FILE MIGNON AO MOLHO MADEIRA", preco: 112.0, preco_meia: 67.2 },
        { nome: "COSTELA DE BOI", preco: 90.0, preco_meia: 54.0 },
        { nome: "LAGARTO MALUCO", preco: 92.0, preco_meia: 55.2 },
        { nome: "LOMBO A MINEIRA", preco: 84.0, preco_meia: 50.4 },
        { nome: "LOMBO C/ ABACAXI", preco: 88.0, preco_meia: 52.8 },
        { nome: "COSTELINHA DE PORCO", preco: 82.0, preco_meia: 49.2 },
        { nome: "FILE DE TILAPIA", preco: 96.0, preco_meia: 57.6 },
      ],
    },
    {
      nome: "Petiscos FDS",
      itens: [
        { nome: "BOLINHO DE BACALHAU", preco: 39.0, preco_meia: 23.4 },
        { nome: "CAMARAO EMPANADO", preco: 39.0, preco_meia: 23.4 },
        { nome: "EMPADA", preco: 9.0 },
        { nome: "MOELINHA", preco: 34.0, preco_meia: 20.4 },
        { nome: "TORRESMO 100G", preco: 8.49 },
        { nome: "FRITAS", preco: 28.0, preco_meia: 16.8 },
        { nome: "CONTRA FILE COM FRITAS", preco: 55.0, preco_meia: 33.0 },
        { nome: "FRITAS COM LINGUICA", preco: 34.0, preco_meia: 20.4 },
        { nome: "FIGADO COM JILO", preco: 32.0, preco_meia: 19.2 },
        { nome: "LINGUA DE BOI AO MOLHO DE VINHO", preco: 31.0, preco_meia: 18.6 },
        { nome: "TRIO MINEIRO", preco: 49.0, preco_meia: 29.4 },
        { nome: "ISCA DE TILAPIA", preco: 49.0, preco_meia: 29.4 },
        { nome: "CAMARAO ALHO E OLEO", preco: 39.0, preco_meia: 23.4 },
        { nome: "PASTEL QUEIJO", preco: 24.0, preco_meia: 14.4 },
        { nome: "PROVOLONE NA PEDRA", preco: 27.0, preco_meia: 16.2 },
        { nome: "FEIJAO AMIGO", preco: 6.0 },
        { nome: "TRUPICO", preco: 15.0, preco_meia: 9.0 },
      ],
    },
    {
      nome: "Pratos Lights",
      itens: [
        { nome: "OMELETE BRASEIRO", preco: 23.9 },
        { nome: "SALADA DE FRANGO C/ ABACAXI", preco: 24.9 },
      ],
    },
    {
      nome: "Pratos Kids",
      itens: [
        { nome: "KIDS FRANGO", preco: 24.9 },
        { nome: "KIDS OVO", preco: 21.9 },
        { nome: "KIDS MASSA", preco: 21.9 },
      ],
    },
    {
      nome: "Massas FDS",
      itens: [
        { nome: "PENNE", preco: 29.9 },
        { nome: "ESPAGUETE", preco: 29.9 },
        { nome: "TALHARIM", preco: 29.9 },
      ],
    },
    {
      nome: "Sobremesas",
      itens: [
        { nome: "PUDIM", preco: 8.0 },
        { nome: "ROMEU E JULIETA", preco: 8.0 },
        { nome: "DOCE DE LEITE C/ QUEIJO", preco: 8.0 },
      ],
    },
  ];

  async function criarCategorias(categorias: any[], cardapioId: number) {
    for (const cat of categorias) {
      const categoria = await prisma.categoria_produto.upsert({
        where: { nome: cat.nome },
        update: {},
        create: { nome: cat.nome },
      });

      for (const item of cat.itens) {
        await prisma.produto.upsert({
          where: { nome: item.nome },
          update: {},
          create: {
            nome: item.nome,
            preco: item.preco,
            preco_meia: item.preco_meia ?? null,
            aceita_meia: !!item.preco_meia,
            ativo: true,
            cardapio_id: cardapioId,
            categoria_id: categoria.id,
          },
        });
      }
    }
  }

  await criarCategorias(categoriasSemana, cardapioSemana.id);
  await criarCategorias(categoriasFDS, cardapioFDS.id);

  /* =========================================================
     🔹 7. UNIDADES E INGREDIENTES
  ========================================================= */
  const unidades = [
    { nome: "grama", sigla: "g" },
    { nome: "quilograma", sigla: "kg" },
    { nome: "mililitro", sigla: "ml" },
    { nome: "litro", sigla: "L" },
    { nome: "unidade", sigla: "un" },
  ];

  for (const u of unidades) {
    await prisma.unidade_medida.upsert({
      where: { sigla: u.sigla },
      update: {},
      create: u,
    });
  }

  const ingredientes = ["Ovo", "Queijo", "Tomate", "Cebola", "Arroz", "Feijão"];
  const unidadeUn = await prisma.unidade_medida.findFirst({
    where: { sigla: "un" },
  });

  for (const nome of ingredientes) {
    await prisma.ingredientes.upsert({
      where: { nome },
      update: {},
      create: { nome, unidade_id: unidadeUn!.id, quantidade: 0 },
    });
  }

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
