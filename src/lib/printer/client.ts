import net from "net";
import { getPrinterConfig, PrinterConfig, PrinterEncoding } from "./config";

export type PrintOptions = {
  cut?: boolean;
  timeoutMs?: number;
};

const ESC = 0x1b;
const GS = 0x1d;

function buildPrefix(config: PrinterConfig): Buffer[] {
  const chunks = [Buffer.from([ESC, 0x40])];
  if (typeof config.codePage === "number") {
    chunks.push(Buffer.from([ESC, 0x74, config.codePage]));
  }
  return chunks;
}

function buildSuffix(cut: boolean): Buffer[] {
  if (!cut) return [];
  return [Buffer.from([0x0a, 0x0a, 0x0a]), Buffer.from([GS, 0x56, 0x00])];
}

function sanitizeText(text: string, encoding: PrinterEncoding): string {
  if (encoding === "ascii") {
    const normalized = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return normalized.replace(/[^\x20-\x7E\n\r\t]/g, "");
  }

  let result = "";
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (code === 10 || code === 13 || code === 9 || code >= 32) {
      if (code <= 255) result += ch;
    }
  }
  return result;
}

function ensureNetwork(config: PrinterConfig) {
  if (config.interface !== "network") {
    throw new Error(`Unsupported printer interface: ${config.interface}`);
  }
}

async function sendToPrinter(
  payload: Buffer,
  config: PrinterConfig,
  timeoutMs?: number
): Promise<void> {
  ensureNetwork(config);

  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    const timeout = timeoutMs ?? config.timeoutMs;
    let settled = false;
    let wroteOk = false;

    const finish = (err?: Error) => {
      if (settled) return;
      settled = true;
      if (err) reject(err);
      else resolve();
    };

    socket.setTimeout(timeout);

    socket.on("error", (err) => {
      socket.destroy();
      const code = (err as NodeJS.ErrnoException).code;
      if (wroteOk && (code === "ECONNRESET" || code === "EPIPE")) {
        finish();
        return;
      }
      finish(err);
    });

    socket.on("timeout", () => {
      socket.destroy();
      finish(new Error("Printer connection timeout"));
    });

    socket.connect(config.port, config.host, () => {
      socket.write(payload, (err) => {
        if (err) {
          socket.destroy();
          finish(err);
          return;
        }
        wroteOk = true;
        socket.end();
      });
    });

    socket.on("close", () => {
      finish();
    });
  });
}

export async function printText(text: string, options: PrintOptions = {}) {
  const config = getPrinterConfig();
  if (!config.enabled) return;

  const sanitized = sanitizeText(text, config.encoding);
  const body = Buffer.from(sanitized, config.encoding);
  const chunks = [
    ...buildPrefix(config),
    body,
    ...buildSuffix(options.cut ?? true),
  ];

  await sendToPrinter(Buffer.concat(chunks), config, options.timeoutMs);
}

export async function printRaw(buffer: Buffer, options: PrintOptions = {}) {
  const config = getPrinterConfig();
  if (!config.enabled) return;

  const chunks = [
    ...buildPrefix(config),
    buffer,
    ...buildSuffix(options.cut ?? true),
  ];

  await sendToPrinter(Buffer.concat(chunks), config, options.timeoutMs);
}
