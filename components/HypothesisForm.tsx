type HypothesisFormProps = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onSubmitAll: () => void;
  loading: boolean;
  selectedCount: number;
};

const examples = [
  "Stenge fysisk servicekontor og flytte alt digitalt",
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
    <section className="bg-white rounded-2xl border border-gray-200 p-6">
      <label htmlFor="hypothesis" className="block text-sm font-medium text-gray-700 mb-2">
        Beskriv endringen eller tjenesten du vil teste
      </label>

      <textarea
        id="hypothesis"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300 p-3 text-sm text-gray-800 resize-none min-h-24"
        placeholder="Skriv inn hypotese her..."
      />

      <div className="flex flex-wrap gap-2 mt-3 mb-4">
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => onChange(example)}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full px-3 py-1.5 cursor-pointer transition-colors"
          >
            {example}
          </button>
        ))}
      </div>

      <div className="flex gap-3 items-center flex-wrap">
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || selectedCount === 0 || isValueEmpty}
          className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Simuler {selectedCount} persona(s)
        </button>

        <button
          type="button"
          onClick={onSubmitAll}
          disabled={loading || isValueEmpty}
          className="bg-gray-800 hover:bg-gray-900 text-white rounded-xl px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Test alle
        </button>
      </div>

      {loading ? <p className="text-sm text-gray-400 italic animate-pulse">Simulerer…</p> : null}
    </section>
  );
}
