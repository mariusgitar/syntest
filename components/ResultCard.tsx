import { Persona, SimulationResult } from "@/lib/types";

type ResultCardProps = {
  result: SimulationResult;
  persona: Persona;
};

function scoreColor(score: number) {
  if (score >= 7) return "text-green-700";
  if (score >= 4) return "text-amber-700";
  return "text-red-700";
}

export function ResultCard({ result, persona }: ResultCardProps) {
  const firstName = persona.name.split(" ")[0];

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5">
      <header className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">
          <span className="mr-2">{persona.emoji}</span>
          {persona.name}
        </h3>
        <p className="text-sm text-gray-600">{persona.role}</p>
      </header>

      <blockquote className="mb-4 rounded-lg bg-gray-50 p-3 italic text-gray-800">
        “{result.reaksjon}”
      </blockquote>

      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 p-3">
          <p className="text-xs text-gray-600">Villighet til endring</p>
          <p className={`text-xl font-semibold ${scoreColor(result.villighet_til_endring)}`}>
            {result.villighet_til_endring}/10
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 p-3">
          <p className="text-xs text-gray-600">Bekymringer</p>
          <p className="text-xl font-semibold text-gray-900">{result.bekymringer.length}</p>
          <p className="mt-1 text-xs text-gray-600">{result.bekymringer[0] ?? "Ingen bekymringer"}</p>
        </div>

        <div className="rounded-lg border border-gray-200 p-3">
          <p className="text-xs text-gray-600">Største barrière</p>
          <p className="mt-1 text-sm text-gray-900">{result.barrier}</p>
        </div>
      </div>

      <section>
        <p className="text-sm font-medium text-gray-900">Forslag fra {firstName}:</p>
        <p className="italic text-gray-800">{result.forslag}</p>
      </section>
    </article>
  );
}
