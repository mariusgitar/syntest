# Syntest — AGENTS.md

## Prosjektoversikt
Syntest er en intern plattform for Tønsberg kommune der ansatte kan teste hypoteser, tjenesteendringer og nye tjenester mot digitale tvillinger av typiske kommunale brukere. En "digital tvilling" er en AI-drevet persona som svarer autentisk ut fra sin livssituasjon.

## Stack
- **Frontend/backend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Database**: Neon Postgres via `@neondatabase/serverless`
- **AI**: Anthropic API (`@anthropic-ai/sdk`), modell `claude-sonnet-4-20250514`
- **Hosting**: Vercel
- **Autentisering**: Ingen (fase 1) — kun intern bruk

## Filstruktur
```
syntest/
├── AGENTS.md                  # Denne filen — alltid lese først
├── app/
│   ├── layout.tsx
│   ├── page.tsx               # Landingsside / redirect til /test
│   ├── test/
│   │   └── page.tsx           # Hovedgrensesnitt: velg personas, skriv hypotese, se resultater
│   └── api/
│       ├── simulate/
│       │   └── route.ts       # POST: kjør simulering mot Anthropic API
│       └── results/
│           └── route.ts       # GET/POST: hent og lagre testresultater
├── lib/
│   ├── db.ts                  # Neon-klient og SQL-hjelpefunksjoner
│   ├── anthropic.ts           # Anthropic-klient og prompt-logikk
│   └── types.ts               # Delte TypeScript-typer
├── data/
│   └── personas.ts            # Statisk persona-definisjonsfil (kilde til sannhet)
├── components/
│   ├── PersonaCard.tsx
│   ├── HypothesisForm.tsx
│   ├── ResultCard.tsx
│   └── ui/                    # Generiske UI-komponenter
└── .env.local                 # Aldri commit
```

## Miljøvariabler
Alle miljøvariabler settes i Vercel dashboard OG i `.env.local` for lokal utvikling.

```
DATABASE_URL=          # Neon connection string (pooled)
DATABASE_URL_UNPOOLED= # Neon direct connection (for migrations)
ANTHROPIC_API_KEY=     # Anthropic API-nøkkel
```

## Kodekonvensjoner
- **Språk i UI**: Norsk. Variabelnavn, kommentarer og filnavn: engelsk.
- **Komponenter**: Tynne page-filer. All logikk i `lib/` eller egne hooks.
- **API routes**: Én fil per ressurs. Valider input før DB-kall.
- **Typer**: Definer i `lib/types.ts`, importer der det trengs. Ingen `any`.
- **Feil**: Alltid håndter feil eksplisitt i API routes — returner `{ error: string }` med riktig HTTP-statuskode.
- **Personas**: Aldri hardkod persona-data i komponenter. Alltid importer fra `data/personas.ts`.
- **DB-kall**: Aldri direkte i komponenter. Alltid via `lib/db.ts`.

## Persona-format (data/personas.ts)
Hver persona har følgende felt:
```typescript
{
  id: string            // slug, f.eks. "kari-72"
  name: string          // "Kari (72)"
  role: string          // "Hjemmeboende pensjonist"
  emoji: string         // Visuell avatar
  traits: string[]      // Korte stikkord
  description: string   // Fullstendig personabeskrivelse til AI-prompt
  livssituasjon: string // Kortfattet kontekstsetning til AI-prompt
}
```

## Simuleringsprosess
1. Bruker velger 1–6 personas og skriver inn hypotese
2. Frontend POSTer til `/api/simulate` med `{ personaIds, hypothesis }`
3. API route henter persona-data fra `data/personas.ts`
4. Kaller Anthropic API for hver persona (parallelt med `Promise.all`)
5. Returnerer strukturert JSON per persona
6. Resultater vises i UI og kan lagres til DB

## AI-respons format
Anthropic-kallet skal alltid returnere ren JSON (ingen markdown):
```typescript
{
  reaksjon: string           // 2–4 setninger i første person
  bekymringer: string[]      // Liste med bekymringer
  positive_aspekter: string[]
  villighet_til_endring: number  // 1–10
  barrier: string            // Største barrière, én setning
  forslag: string            // Ett konkret forslag
}
```

## Viktige hensyn
- Anthropic-kallet skjer alltid server-side (API route), aldri client-side
- API-nøkler eksponeres aldri til frontend
- Valider at `personaIds` kun inneholder gyldige IDer fra `data/personas.ts`
- Sett alltid `max_tokens: 1000` på Anthropic-kall
