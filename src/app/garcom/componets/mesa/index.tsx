// Mesa.tsx
"use client"
import { useState } from "react";
import Button from "./button";

export default function Mesa() {
  const [mesaAtiva, setMesaAtiva] = useState<number | null>(null);

  return (
    <div className="p-1 gap-1 grid grid-cols-[repeat(auto-fit,minmax(100px,auto))] justify-evenly bg-amber-50 rounded-3xl">
      {Array.from({ length: 25 }, (_, i) => {
        const numero = i + 1;
        return (
          <Button
            key={numero}
            numero={numero}
            active={mesaAtiva === numero}
            onClick={() =>
              setMesaAtiva(mesaAtiva === numero ? null : numero) // (opcional) alternar
            }
          />
        );
      })}
    </div>
  );
}