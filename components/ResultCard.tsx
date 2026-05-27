import { Persona, SimulationResult } from "@/lib/types";

type ResultCardProps = {
  result: SimulationResult;
  persona: Persona;
};

function scoreColor(score: number) {
  if (score >= 7) return "text-green-600";
  if (score >= 4) return "text-amber-500";
  return "text-red-600";
}

export function ResultCard({ result, persona }: ResultCardProps) {
  if (result.error) {
    return (
      <article className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
        <p className="text-sm font-medium">{persona.name}</p>
        <p className="mt-1 text-sm">{result.error}</p>
      </article>
    );
  }

  const score = result.villighet_til_endring ?? 0;

  return (
    <article className="mb-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <header className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-lg">{persona.emoji}</div>
        <div>
          <p className="font-medium text-gray-900">{persona.name}</p>
          <p className="text-sm text-gray-500">{persona.role}</p>
        </div>
      </header>

      <blockquote className="my-4 rounded-r-xl border-l-4 border-violet-300 bg-violet-50 py-3 pl-4 text-sm italic text-gray-700">
        “{result.reaksjon}”
      </blockquote>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl bg-gray-50 p-3 text-center">
          <p className={`text-2xl font-semibold ${scoreColor(score)}`}>{score}</p>
          <p className="text-xs text-gray-500">Villighet</p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3 text-center">
          <p className="text-2xl font-semibold text-orange-500">{result.bekymringer?.length ?? 0}</p>
          <p className="text-xs text-gray-500">Bekymringer</p>
          <p className="mt-1 text-xs text-gray-600">{result.bekymringer?.[0] ?? "Ingen bekymringer"}</p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3 text-center">
          <p className="text-xs text-gray-500">Barrière</p>
          <p className="mt-1 text-sm text-gray-700">{result.barrier}</p>
        </div>
      </div>

      <section className="mt-4 rounded-xl bg-violet-50 p-4">
        <p className="text-xs font-medium text-violet-700">Forslag</p>
        <p className="mt-1 text-sm italic text-violet-900">{result.forslag}</p>
      </section>
    </article>
  );
}
