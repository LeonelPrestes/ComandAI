export type PrinterInterface = "network";
export type PrinterEncoding = "ascii" | "latin1";

export type PrinterConfig = {
  enabled: boolean;
  interface: PrinterInterface;
  host: string;
  port: number;
  encoding: PrinterEncoding;
  columns: number;
  timeoutMs: number;
  codePage?: number;
};

const DEFAULTS = {
  enabled: true,
  interface: "network" as PrinterInterface,
  host: "192.168.2.114",
  port: 9100,
  encoding: "ascii" as PrinterEncoding,
  columns: 48,
  timeoutMs: 3000,
};

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback;
  const normalized = value.trim().toLowerCase();
  return ["1", "true", "yes", "on"].includes(normalized);
}

function parseNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseInterface(value: string | undefined): PrinterInterface {
  if (!value) return DEFAULTS.interface;
  const normalized = value.trim().toLowerCase();
  return normalized === "network" ? "network" : "network";
}

function parseEncoding(value: string | undefined): PrinterEncoding {
  if (!value) return DEFAULTS.encoding;
  const normalized = value.trim().toLowerCase();
  return normalized === "latin1" ? "latin1" : "ascii";
}

export function getPrinterConfig(): PrinterConfig {
  const env = process.env;

  let codePage: number | undefined;
  if (env.PRINTER_CODEPAGE) {
    const parsed = parseNumber(env.PRINTER_CODEPAGE, Number.NaN);
    if (Number.isFinite(parsed)) codePage = parsed;
  }

  return {
    enabled: parseBoolean(env.PRINTER_ENABLED, DEFAULTS.enabled),
    interface: parseInterface(env.PRINTER_INTERFACE),
    host: env.PRINTER_HOST?.trim() || DEFAULTS.host,
    port: parseNumber(env.PRINTER_PORT, DEFAULTS.port),
    encoding: parseEncoding(env.PRINTER_ENCODING),
    columns: parseNumber(env.PRINTER_COLUMNS, DEFAULTS.columns),
    timeoutMs: parseNumber(env.PRINTER_TIMEOUT_MS, DEFAULTS.timeoutMs),
    codePage,
  };
}
