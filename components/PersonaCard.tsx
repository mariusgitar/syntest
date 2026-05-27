import { Persona } from "@/lib/types";

type PersonaCardProps = {
  persona: Persona;
  selected: boolean;
  onClick: () => void;
  onInfo: () => void;
};

const personaColors: Record<string, string> = {
  "kari-72": "#FDE7F3",
  "ali-34": "#E6F4FF",
  "sigrid-29": "#EAFBF0",
  "ole-55": "#FFF4E5",
  "maria-41": "#F2EBFF",
  "jonas-19": "#E8F8F8",
};

export function PersonaCard({ persona, selected, onClick, onInfo }: PersonaCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      className={`relative flex w-full cursor-pointer flex-col items-center rounded-2xl border border-gray-200 bg-white p-5 text-center transition-all duration-150 hover:border-gray-300 hover:shadow-md ${
        selected ? "border-2 border-violet-400 bg-violet-50 shadow-sm" : ""
      }`}
    >
      <button
        type="button"
        aria-label={`Vis mer om ${persona.name}`}
        onClick={(event) => {
          event.stopPropagation();
          onInfo();
        }}
        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-500 hover:bg-gray-200"
      >
        i
      </button>

      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full text-2xl" style={{ backgroundColor: personaColors[persona.id] ?? "#F3F4F6" }}>
        {persona.emoji}
      </div>

      <h3 className="mb-0.5 text-sm font-semibold text-gray-900">{persona.name}</h3>
      <p className="mb-3 text-xs text-gray-500">{persona.role}</p>

      <div className="flex flex-wrap justify-center gap-1">
        {persona.traits.map((trait) => (
          <span key={trait} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {trait}
          </span>
        ))}
      </div>
    </div>
  );
}
