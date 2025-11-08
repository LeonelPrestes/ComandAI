"use client";

type MesaCardProps = {
  numero: number;
  status: string;
  cor?: string;
  onClick?: () => void;
};

export default function MesaCard({ numero, status, cor, onClick }: MesaCardProps) {
  return (
    <div
      onClick={onClick}
      className="rounded-xl shadow-md p-4 text-center border cursor-pointer transition hover:scale-105"
      style={{
        backgroundColor: cor || "#f3f4f6",
        color: cor === "#f3f4f6" ? "#111" : "white",
      }}
    >
      <p className="text-2xl font-bold">Mesa {numero}</p>
      <p className="text-sm">{status}</p>
    </div>
  );
}
