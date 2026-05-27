import { Persona } from "@/lib/types";

type PersonaCardProps = {
  persona: Persona;
  selected: boolean;
  onClick: () => void;
};

const personaColors: Record<string, string> = {
  "kari-72": "#FDE7F3",
  "ali-34": "#E6F4FF",
  "sigrid-29": "#EAFBF0",
  "ole-55": "#FFF4E5",
  "maria-41": "#F2EBFF",
  "jonas-19": "#E8F8F8",
};

export function PersonaCard({ persona, selected, onClick }: PersonaCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border p-4 text-left transition ${
        selected
          ? "border-[2px] border-[#7F77DD] bg-[#EEEDFE]"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="mb-3 flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
          style={{ backgroundColor: personaColors[persona.id] ?? "#F3F4F6" }}
        >
          {persona.emoji}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{persona.name}</h3>
          <p className="text-sm text-gray-600">{persona.role}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {persona.traits.map((trait) => (
          <span
            key={trait}
            className="rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700"
          >
            {trait}
          </span>
        ))}
      </div>
    </button>
  );
}
