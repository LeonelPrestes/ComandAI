"use client"
type ButtonProps = {
  numero: number;
  active: boolean;
  onClick: () => void;
};

export default function Button({ numero, active, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        text-4xl mb-1 mt-1 w-25 h-25 rounded-2xl border-2 border-blue-700 transition
        ${!active
          ? "bg-linear-to-b from-blue-50 to-blue-200 text-black"
          : "bg-linear-to-b from-blue-200 to-blue-400 text-white shadow-lg scale-105 text-5xl"}
      `}
    >
      {numero}
    </button>
  );
}