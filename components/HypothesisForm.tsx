type HypothesisFormProps = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onSubmitAll: () => void;
  loading: boolean;
  selectedCount: number;
};

const examples = [
  "Stenge fysisk servicekontور og flytte alt digitalt",
  "Ny app for timebestilling hos helsesøster",
  "Automatisk AI-behandling av hjelpesøknader",
];

export function HypothesisForm({
  value,
  onChange,
  onSubmit,
  onSubmitAll,
  loading,
  selectedCount,
}: HypothesisFormProps) {
  const isValueEmpty = value.trim().length === 0;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <label htmlFor="hypothesis" className="mb-2 block text-sm font-medium text-gray-900">
        Beskriv endringen eller tjenesten du vil teste
      </label>
      <textarea
        id="hypothesis"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[80px] w-full rounded-lg border border-gray-300 p-3 text-sm outline-none ring-[#7F77DD] focus:ring-2"
        placeholder="Skriv inn hypotese her..."
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => onChange(example)}
            className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100"
          >
            {example}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || selectedCount === 0 || isValueEmpty}
          className="rounded-lg bg-[#7F77DD] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Simuler {selectedCount} persona(s) ↗
        </button>
        <button
          type="button"
          onClick={onSubmitAll}
          disabled={loading || isValueEmpty}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Test alle ↗
        </button>
      </div>

      {loading ? <p className="mt-3 text-sm text-gray-600">Simulerer...</p> : null}
    </section>
  );
}
