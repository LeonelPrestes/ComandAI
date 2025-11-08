import MesaGrid from "@/src/modules/comanda/components/MesaGrid";

export default function GarcomPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold p-4">Mesas</h1>
      <MesaGrid />
    </div>
  );
}
