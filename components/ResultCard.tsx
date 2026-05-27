import { Persona, SimulationResult } from "@/lib/types";

type ResultCardProps = {
  result: SimulationResult;
  persona: Persona;
};

function scoreColor(score: number) {
  if (score >= 7) return "text-green-600";
  if (score >= 4) return "text-amber-500";
  return "text-red-500";
}

export function ResultCard({ result, persona }: ResultCardProps) {
  if (result.error) {
    return (
      <article className="bg-red-50 rounded-2xl border border-red-200 p-6 mb-4 text-sm text-red-600">
        <p className="font-medium">{persona.name}</p>
        <p className="mt-1">{result.error}</p>
      </article>
    );
  }

  const score = result.villighet_til_endring ?? 0;

  return (
    <article className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
      <header className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: "#F3F4F6" }}>{persona.emoji}</div>
        <div>
          <p className="text-base font-semibold text-gray-900">{persona.name}</p>
          <p className="text-sm text-gray-500">{persona.role}</p>
        </div>
      </header>

      <blockquote className="border-l-4 border-violet-300 bg-violet-50 rounded-r-xl px-4 py-3 my-4 text-sm italic text-gray-700">
        “{result.reaksjon}”
      </blockquote>

      <div className="grid grid-cols-3 gap-3 my-4">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className={`text-2xl font-bold mb-1 ${scoreColor(score)}`}>{score}</p>
          <p className="text-xs text-gray-500">Villighet</p>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">Skår fra 1 til 10</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold mb-1 text-amber-500">{result.bekymringer?.length ?? 0}</p>
          <p className="text-xs text-gray-500">Bekymringer</p>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{result.bekymringer?.[0] ?? "Ingen bekymringer"}</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold mb-1 text-red-500">{result.barrier ? 1 : 0}</p>
          <p className="text-xs text-gray-500">Barrière</p>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{result.barrier}</p>
        </div>
      </div>

      <section className="bg-violet-50 rounded-xl p-4 mt-2">
        <p className="text-xs font-semibold text-violet-700 mb-1">Forslag</p>
        <p className="text-sm italic text-violet-900">{result.forslag}</p>
      </section>
    </article>
  );
}
