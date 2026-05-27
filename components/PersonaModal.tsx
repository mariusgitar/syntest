import { Persona } from "@/lib/types";

type PersonaModalProps = {
  persona: Persona | null;
  isSelected: boolean;
  onClose: () => void;
  onToggleSelect: () => void;
};

const personaColors: Record<string, string> = {
  "kari-72": "#FDE7F3",
  "ali-34": "#E6F4FF",
  "sigrid-29": "#EAFBF0",
  "ole-55": "#FFF4E5",
  "maria-41": "#F2EBFF",
  "jonas-19": "#E8F8F8",
};

export function PersonaModal({ persona, isSelected, onClose, onToggleSelect }: PersonaModalProps) {
  if (!persona) {
    return null;
  }

  const handleSelect = () => {
    onToggleSelect();
    onClose();
  };

  return (
    <>
      <button type="button" aria-label="Lukk personadetaljer" onClick={onClose} className="fixed inset-0 z-40 bg-black/40" />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl mx-4">
          <button type="button" onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600" aria-label="Lukk">
            ×
          </button>

          <div className="mx-auto mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-full text-4xl" style={{ backgroundColor: personaColors[persona.id] ?? "#F3F4F6" }}>
            {persona.emoji}
          </div>

          <h3 className="text-center text-2xl font-bold text-gray-900">{persona.name}</h3>
          <p className="mt-1 text-center text-base text-gray-500">{persona.role}</p>

          <div className="mt-4 flex flex-wrap justify-center gap-1">
            {persona.traits.map((trait) => (
              <span key={trait} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {trait}
              </span>
            ))}
          </div>

          <div className="my-6 border-b border-gray-200" />

          <div className="space-y-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Om personen</p>
              <p className="text-sm leading-relaxed text-gray-700">{persona.description}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Livssituasjon</p>
              <p className="text-sm leading-relaxed text-gray-700">{persona.livssituasjon}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSelect}
            className="mt-6 w-full rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white"
          >
            {isSelected ? "Valgt ✓" : "Velg denne"}
          </button>
        </div>
      </div>
    </>
  );
}
