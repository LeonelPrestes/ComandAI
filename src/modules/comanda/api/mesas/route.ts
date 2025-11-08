import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma/client";

// GET /api/mesas  → Lista todas as mesas com status
export async function GET() {
  try {
    const mesas = await prisma.mesa.findMany({
      include: { status: true },
      orderBy: { numero: "asc" },
    });
    return NextResponse.json(mesas);
  } catch (error) {
    console.error("Erro ao buscar mesas:", error);
    return NextResponse.json({ error: "Erro ao carregar mesas" }, { status: 500 });
  }
}

// POST /api/mesas  → Cria uma nova mesa
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const novaMesa = await prisma.mesa.create({ data });
    return NextResponse.json(novaMesa);
  } catch (error) {
    console.error("Erro ao criar mesa:", error);
    return NextResponse.json({ error: "Erro ao criar mesa" }, { status: 500 });
  }
}
