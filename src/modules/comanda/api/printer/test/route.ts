import { NextResponse } from "next/server";
import { getPrinterConfig } from "@/src/lib/printer/config";
import { printText } from "@/src/lib/printer/client";

export async function POST() {
  try {
    const config = getPrinterConfig();
    const payload = [
      "TESTE IMPRESSAO",
      `Host: ${config.host}`,
      `Porta: ${config.port}`,
      `Data: ${new Date().toISOString().slice(0, 19).replace("T", " ")}`,
      "------------------------",
      "OK",
    ].join("\n");

    await printText(payload, { cut: true });
    return NextResponse.json({ printed: true });
  } catch (error) {
    console.error("Erro ao imprimir teste:", error);
    return NextResponse.json({ error: "Erro ao imprimir teste" }, { status: 500 });
  }
}
