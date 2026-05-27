import type { Persona } from "@/lib/types";

export const PERSONAS: Persona[] = [
  {
    id: "kari-72",
    name: "Kari (72)",
    role: "Hjemmeboende pensjonist",
    emoji: "👩‍🦳",
    traits: ["Lite digitalt", "Hjemmehjelp", "Enke"],
    description:
      "Kari er 72 år, enke og bor alene i enebolig. Hun bruker ikke smarttelefon til annet enn å ringe. Hun er avhengig av hjemmehjelp og mottar trygd. Møter opp fysisk ved all kontakt med kommunen.",
    livssituasjon:
      "Pensjonist, lav digital kompetanse, avhengig av fysisk oppmøte, har sønn som hjelper henne av og til",
  },
  {
    id: "ahmed-34",
    name: "Ahmed (34)",
    role: "Nyankommet flyktning",
    emoji: "👨",
    traits: ["Norsk B1", "Barnefamilie", "Leier"],
    description:
      "Ahmed kom til Norge for 2 år siden med kone og to barn. Jobber deltid og er i norskopplæring. Har begrensede norskkunnskaper og trenger ofte tolk. Navigerer et komplekst tjenestetilbud.",
    livssituasjon:
      "Flyktning, B1 norsk, barnefamilie med 4 og 7 år, leier kommunal bolig, avhengig av NAV og flyktningetjeneste",
  },
  {
    id: "marie-28",
    name: "Marie (28)",
    role: "Småbarnsmor, aleneforsørger",
    emoji: "👩",
    traits: ["Stresskjørt", "Fulljobb", "Toddler"],
    description:
      "Marie er 28 år og aleneforsørger for en 2-åring. Hun jobber fulltid og har lite tid. Er digitalt kompetent og foretrekker selvbetjening. Frustrasjon over fragmenterte kommunale tjenester.",
    livssituasjon:
      "Aleneforsørger, fulltidsjobb, trenger barnehage, SFO, helsetjenester, har lite tid til å navigere byråkrati",
  },
  {
    id: "tor-55",
    name: "Tor (55)",
    role: "Uføretrygdet, psykiske utfordringer",
    emoji: "👨‍🦱",
    traits: ["Uføre", "Angst", "Alene"],
    description:
      "Tor er 55 år, uføretrygdet etter utbrenthet og lever med angst og depresjon. Bor alene i leilighet. Har tidligere hatt dårlige erfaringer med NAV. Er forsiktig og reservert i møte med offentlige tjenester.",
    livssituasjon:
      "Uføretrygdet, psykisk helseutfordring, lav terskel for å trekke seg, behov for lavterskel og ikke-stigmatiserende tjenester",
  },
  {
    id: "ingrid-42",
    name: "Ingrid (42)",
    role: "Ressurssterk trebarnsmor",
    emoji: "👩‍💼",
    traits: ["Høy inntekt", "Krevende", "Digitalt sterk"],
    description:
      "Ingrid er 42, gift, trebarnsmor og jobber som leder. Hun er digitalt sterk, kjent med sine rettigheter og stiller krav til kommunen. Har lite toleranse for tungvinte prosesser.",
    livssituasjon:
      "Ressurssterk, høy digital kompetanse, leder i privat sektor, forventer effektive og brukervennlige løsninger",
  },
  {
    id: "omar-17",
    name: "Omar (17)",
    role: "Tenåring, utenfor skole og arbeid",
    emoji: "🧑",
    traits: ["Ungdom", "Frafall", "Isolert"],
    description:
      "Omar er 17 og har sluttet på videregående. Bor hjemme, spiller mye, har lite sosialt nettverk. Har vært i kontakt med barnevern og ungdomstjenester. Trenger lavterskel oppfølging.",
    livssituasjon:
      "17 år, hverken i skole eller arbeid, tidligere barnevernkontakt, vanskelig å nå via tradisjonelle kanaler",
  },
];

export function getPersonaById(id: string): Persona | undefined {
  return PERSONAS.find((persona) => persona.id === id);
}
