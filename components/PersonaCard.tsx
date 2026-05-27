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
      className={`relative flex w-full cursor-pointer flex-col items-center rounded-2xl border border-gray-200 bg-white p-5 text-center transition-all duration-150 hover:border-gray-300 hover:shadow-md ${
        selected ? "border-2 border-violet-400 bg-violet-50 shadow-sm" : ""
      }`}
    >
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full text-2xl" style={{ backgroundColor: personaColors[persona.id] ?? "#F3F4F6" }}>
        {persona.emoji}
      </div>

      <h3 className="mb-0.5 text-sm font-semibold text-gray-900">{persona.name}</h3>
      <p className="mb-3 text-xs text-gray-500">{persona.role}</p>

      <div className="flex flex-wrap gap-1 justify-center">
        {persona.traits.map((trait) => (
          <span key={trait} className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
            {trait}
          </span>
        ))}
      </div>
    </button>
  );
}
