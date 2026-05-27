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

      const data: SimulationResult[] = await response.json();
      setResults(data);
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
    return <main className="mx-auto max-w-6xl p-6">Laster personas...</main>;
  }

  if (personasError) {
    return <main className="mx-auto max-w-6xl p-6">Kunne ikke laste personas</main>;
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 p-6">
      <section>
        <h1 className="mb-4 text-2xl font-semibold text-gray-900">Velg personas</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      <HypothesisForm
        value={hypothesis}
        onChange={setHypothesis}
        onSubmit={handleSubmit}
        onSubmitAll={handleSubmitAll}
        loading={loading}
        selectedCount={selectedPersonaIds.size}
      />

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">Resultater</h2>
        {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
        {results.length === 0 ? (
          <p className="text-gray-600">Ingen resultater ennå. Kjør en simulering for å se svar.</p>
        ) : (
          <div className="grid gap-4">
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
    </main>
  );
}
