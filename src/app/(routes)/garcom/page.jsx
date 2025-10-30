import React from "react";
import Mesa from "./components/Mesa";
import ModalItens from "@/components/Modais/ModalItens/ModalItens";

export default function GarcomPages() {
  return (
    <div>
      <h1>Selecionar Mesa</h1>
      <Mesa />
      <ModalItens onClose={() => { }}>
        <h2>Itens da Mesa</h2>
        {/* Conteúdo do modal */}
      </ModalItens>
    </div>
  );
}
