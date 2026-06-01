export type StaticPersona = {
  id: string;
  name: string;
  role: string;
  emoji: string;
  traits: string[];
  description: string;
  livssituasjon: string;
};

export type Persona = StaticPersona & {
  gruppe: string;
};

export type SimulationMode = "hypotese" | "kommunikasjon" | "horing";

export type SimulationRequest = {
  personaIds: string[];
  hypothesis: string;
  mode: SimulationMode;
};

export type SimulationResult = {
  personaId: string;
  reaksjon?: string;
  bekymringer?: string[];
  positive_aspekter?: string[];
  villighet_til_endring?: number;
  barrier?: string;
  forslag?: string;
  error?: string;
};

export type TestResult = {
  id: string;
  hypothesis: string;
  personaId: string;
  result: SimulationResult;
  createdAt: string;
};
