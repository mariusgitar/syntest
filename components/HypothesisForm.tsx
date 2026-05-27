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
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <label htmlFor="hypothesis" className="mb-2 block text-[13px] font-medium text-gray-700">
        Beskriv endringen eller tjenesten du vil teste
      </label>

      <textarea
        id="hypothesis"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-24 w-full resize-none rounded-xl border border-gray-200 p-3 text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-violet-300"
        placeholder="Skriv inn hypotese her..."
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => onChange(example)}
            className="cursor-pointer rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-600 transition hover:bg-gray-200"
          >
            {example}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || selectedCount === 0 || isValueEmpty}
          className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-40"
        >
          Simuler {selectedCount} persona(s)
        </button>

        <button
          type="button"
          onClick={onSubmitAll}
          disabled={loading || isValueEmpty}
          className="rounded-xl bg-gray-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-900 disabled:opacity-40"
        >
          Test alle
        </button>
      </div>

      {loading ? <p className="mt-3 text-sm italic text-gray-500">Simulerer…</p> : null}
    </section>
  );
}
