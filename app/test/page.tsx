"use client";

import { useEffect, useMemo, useState } from "react";
import { HypothesisForm } from "@/components/HypothesisForm";
import { PersonaCard } from "@/components/PersonaCard";
import { ResultCard } from "@/components/ResultCard";
import { PersonaModal } from "@/components/PersonaModal";
import type { Persona, SimulationMode, SimulationResult } from "@/lib/types";

type GroupFilter = {
  label: string;
  value: string | null;
};

const modeOptions: Array<{ mode: SimulationMode; label: string }> = [
  { mode: "hypotese", label: "Hypotesetest" },
  { mode: "kommunikasjon", label: "Kommunikasjon" },
  { mode: "horing", label: "Høring" },
];

const modeDescriptions: Record<SimulationMode, string> = {
  hypotese: "Test hvordan personas reagerer på en tjenesteendring eller nytt tiltak",
  kommunikasjon: "Se om kommunens budskap treffer og oppleves relevant",
  horing: "Få innspill på planer og høringsdokumenter",
};

const modePlaceholders: Record<SimulationMode, string> = {
  hypotese: "Beskriv tjenesteendringen eller tiltaket du vil teste...",
  kommunikasjon:
    "Lim inn eller beskriv kommunikasjonen du vil teste (pressemelding, informasjonsskriv, SMS-varsling...)...",
  horing: "Lim inn eller beskriv planen eller høringsdokumentet du vil ha innspill på...",
};

const modeExamples: Record<SimulationMode, string[]> = {
  hypotese: [
    "Stenge fysisk servicekontor og flytte alt digitalt",
    "Ny app for timebestilling hos helsesøster",
    "Automatisk AI-behandling av hjelpesøknader",
  ],
  kommunikasjon: [
    "Pressemelding om ny parkeringspolitikk i sentrum",
    "SMS-varsling om vannstans",
    "Informasjonsskriv om barnehageopptak",
  ],
  horing: [
    "Kommuneplanens arealdel 2025–2037",
    "Ny alkoholpolitisk handlingsplan",
    "Handlingsplan for universell utforming",
  ],
};

const groupFilters: GroupFilter[] = [
  { label: "Alle", value: null },
  { label: "Innbyggere", value: "innbygger" },
  { label: "Ansatte", value: "ansatt" },
];

export default function TestPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [personasLoading, setPersonasLoading] = useState(true);
  const [personasError, setPersonasError] = useState(false);
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<Set<string>>(new Set());
  const [activePersona, setActivePersona] = useState<Persona | null>(null);
  const [hypothesis, setHypothesis] = useState("");
  const [mode, setMode] = useState<SimulationMode>("hypotese");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPersonas() {
      try {
        setPersonasLoading(true);
        setPersonasError(false);
        const query = activeGroup ? `?gruppe=${encodeURIComponent(activeGroup)}` : "";
        const response = await fetch(`/api/personas${query}`);

        if (!response.ok) {
          throw new Error("Failed to fetch personas");
        }

        const data: Persona[] = await response.json();
        const fetchedPersonaIds = new Set(data.map((persona) => persona.id));
        setPersonas(data);
        setSelectedPersonaIds((prev) => new Set([...prev].filter((id) => fetchedPersonaIds.has(id))));
        setActivePersona((prev) => (prev && fetchedPersonaIds.has(prev.id) ? prev : null));
      } catch (_error) {
        setPersonasError(true);
      } finally {
        setPersonasLoading(false);
      }
    }

    void fetchPersonas();
  }, [activeGroup]);

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
        body: JSON.stringify({ personaIds, hypothesis, mode }),
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
          <div className="flex flex-wrap gap-2">
            {modeOptions.map((option) => {
              const isActive = option.mode === mode;
              return (
                <button
                  key={option.mode}
                  type="button"
                  onClick={() => setMode(option.mode)}
                  className={
                    isActive
                      ? "bg-violet-600 text-white rounded-full px-4 py-2 text-sm font-medium"
                      : "bg-white border border-gray-200 text-gray-600 rounded-full px-4 py-2 text-sm"
                  }
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-gray-600">{modeDescriptions[mode]}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Velg personas</h2>
          <div className="mb-4 flex flex-wrap gap-2">
            {groupFilters.map((filter) => {
              const isActive = filter.value === activeGroup;
              return (
                <button
                  key={filter.label}
                  type="button"
                  onClick={() => setActiveGroup(filter.value)}
                  className={
                    isActive
                      ? "bg-gray-900 text-white rounded-full px-3 py-1 text-xs font-medium"
                      : "bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-xs"
                  }
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {personas.map((persona) => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                selected={selectedPersonaIds.has(persona.id)}
                onClick={() => togglePersona(persona.id)}
                onInfo={() => setActivePersona(persona)}
              />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Din test</h2>
          <HypothesisForm
            value={hypothesis}
            onChange={setHypothesis}
            onSubmit={handleSubmit}
            onSubmitAll={handleSubmitAll}
            loading={loading}
            selectedCount={selectedPersonaIds.size}
            placeholder={modePlaceholders[mode]}
            examples={modeExamples[mode]}
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
      <PersonaModal
        persona={activePersona}
        isSelected={activePersona ? selectedPersonaIds.has(activePersona.id) : false}
        onToggleSelect={() => {
          if (activePersona) {
            togglePersona(activePersona.id);
          }
        }}
        onClose={() => setActivePersona(null)}
      />
    </main>
  );
}
