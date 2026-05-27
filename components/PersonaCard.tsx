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
      className={`w-full cursor-pointer rounded-2xl border p-4 text-center transition hover:shadow-md ${
        selected ? "border-2 border-violet-400 bg-violet-50" : "border-gray-200 bg-white"
      }`}
    >
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-2xl" style={{ backgroundColor: personaColors[persona.id] ?? "#F3F4F6" }}>
        {persona.emoji}
      </div>

      <h3 className="text-[15px] font-medium text-gray-900">{persona.name}</h3>
      <p className="mt-1 text-xs text-gray-500">{persona.role}</p>

      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {persona.traits.map((trait) => (
          <span key={trait} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {trait}
          </span>
        ))}
      </div>
    </button>
  );
}
