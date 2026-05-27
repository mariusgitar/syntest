"use client";

import { useEffect, useMemo, useState } from "react";
import { HypothesisForm } from "@/components/HypothesisForm";
import { PersonaCard } from "@/components/PersonaCard";
import { ResultCard } from "@/components/ResultCard";
import { Persona, SimulationResult } from "@/lib/types";

export default function TestPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [personasLoading, setPersonasLoading] = useState(true);
  const [personasError, setPersonasError] = useState(false);
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<Set<string>>(new Set());
  const [hypothesis, setHypothesis] = useState("");
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPersonas() {
      try {
        setPersonasLoading(true);
        setPersonasError(false);
        const response = await fetch("/api/personas");

        if (!response.ok) {
          throw new Error("Failed to fetch personas");
        }

        const data: Persona[] = await response.json();
        setPersonas(data);
      } catch (_error) {
        setPersonasError(true);
      } finally {
        setPersonasLoading(false);
      }
    }

    void fetchPersonas();
  }, []);

  const personasById = useMemo(() => {
    return new Map(personas.map((persona) => [persona.id, persona]));
  }, [personas]);

  const togglePersona = (personaId: string) => {
    setSelectedPersonaIds((prev) => {
      const next = new Set(prev);
      if (next.has(personaId)) next.delete(personaId);
      else next.add(personaId);
      return next;
    });
  };

  const runSimulation = async (personaIds: string[]) => {
    try {
      setLoading(true);
      setError(null);
      setResults([]);

      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personaIds, hypothesis }),
      });

      if (!response.ok) {
        throw new Error("Simulation failed");
      }

      const data: { results: SimulationResult[] } = await response.json();
      setResults(data.results);
    } catch (_error) {
      setError("Noe gikk galt under simulering. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    await runSimulation(Array.from(selectedPersonaIds));
  };

  const handleSubmitAll = async () => {
    await runSimulation(personas.map((persona) => persona.id));
  };

  if (personasLoading) {
    return <main className="min-h-screen bg-gray-50"><div className="max-w-4xl mx-auto px-6 py-10">Laster personas...</div></main>;
  }

  if (personasError) {
    return <main className="min-h-screen bg-gray-50"><div className="max-w-4xl mx-auto px-6 py-10">Kunne ikke laste personas</div></main>;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Syntest</h1>
          <p className="mt-1 text-gray-500 text-base">Test tjenesteendringer mot digitale innbyggertvillinger</p>
        <div className="mt-6 border-b border-gray-200" />
        </header>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Velg personas</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {personas.map((persona) => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                selected={selectedPersonaIds.has(persona.id)}
                onClick={() => togglePersona(persona.id)}
              />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Din hypotese</h2>
          <HypothesisForm
            value={hypothesis}
            onChange={setHypothesis}
            onSubmit={handleSubmit}
            onSubmitAll={handleSubmitAll}
            loading={loading}
            selectedCount={selectedPersonaIds.size}
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Resultater</h2>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          {results.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
              Ingen resultater ennå. Kjør en simulering for å se svar.
            </div>
          ) : (
            <div>
              {results.map((result) => {
                const persona = personasById.get(result.personaId);
                if (!persona) {
                  return null;
                }

                return <ResultCard key={result.personaId} result={result} persona={persona} />;
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
