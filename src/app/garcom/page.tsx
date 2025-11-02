import Mesa from "./componets/mesa"

export default function Garcom () {
    const setor = "Varanda"
    return (
        <div className="p-2">
            <h1 className="text-3xl mb-5">Mesas - {setor}</h1>
            <Mesa />

        </div>
    )
}