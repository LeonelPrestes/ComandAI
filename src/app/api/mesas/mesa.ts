import { prisma } from "@/src/lib/prisma/client";

export async function GET() {
  const mesas = await prisma.mesa.findMany();
  return Response.json(mesas);
}
