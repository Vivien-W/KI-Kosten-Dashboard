# KI-Kosten-Dashboard

Frontend enthält:

✔ React
✔ TypeScript
✔ TailwindCSS
✔ Recharts
✔ User Interface (Dashboard, Charts, Pages, Components)

Backend enthält:

✔ Express API
✔ OpenAI API Calls
✔ Latenz-Messung
✔ Token-Cost-Berechnung
✔ PostgreSQL Anbindung
✔ Logging / Speicherung der Daten
✔ Endpoints

Dokumentation:
Zunächst wurde das React-Projekt erstellt und das Grundgerüst (Frontend und Backend) erstellt sowie die notwendigen Dependencies installiert. Diese wären TailwindCSS für das Frontend und express pg cors dotenv openai typescript ts-node-dev @types/node @types/express @types/cors für das Backend.
Im nächsten Schritt wurde die Postgres-Datenbank erstellt. Damit wurde die Grundlage für das Monitoring-System geschaffen:

- Logging der Prompt-Daten
- Analytics / Charts
- Kosten-Überwachung
- historische Auswertungen
- tägliche, wöchentliche bzw. monatliche KPIs

Database-Name: ai_cost_dashboard
Haupttabelle: prompt_logs

CREATE TABLE prompt_logs (
id SERIAL PRIMARY KEY,
prompt TEXT NOT NULL,
response TEXT,
model VARCHAR(50) NOT NULL,
latency_ms INTEGER,
input_tokens INTEGER,
output_tokens INTEGER,
total_tokens INTEGER,
cost NUMERIC(10,5),
success BOOLEAN DEFAULT TRUE,
error_message TEXT,
created_at TIMESTAMP DEFAULT NOW()
);

weitere Tabelle für automatische Kostenberechnung:
CREATE TABLE ai_models (
id SERIAL PRIMARY KEY,
model VARCHAR(50) UNIQUE NOT NULL,
input_price_per_million NUMERIC(10,5) NOT NULL,
output_price_per_million NUMERIC(10,5) NOT NULL
);

💡 Wie simulieren wir „OpenAI-Daten“ korrekt?
Wir erstellen eine Funktion im Backend, die bei jedem Prompt:

- input_tokens (Zahl anhand der Textlänge)
- output_tokens (zufällige/statische Werte)
- total_tokens (Summe)
- latency_ms (realistisch simuliert)
- cost (berechnet aus den Tokens)
- model (z. B. "gpt-4o-mini" oder "gpt-o1") berechnet und anschließend in der PostgreSQL-Datenbank speichert.

💡 Wie berechnen wir die Token?
Wir definieren:
function estimateTokens(prompt: string): number {
return Math.floor(prompt.length / 4); // sehr grobe token-Schätzung
}

## Beispiel: Kostenberechnung

GPT-4o-mini (fiktiv):

input: $0.15 / 1M tokens
output: $0.60 / 1M tokens

Wir simulieren die Preise:
const INPUT_PRICE = 0.15 / 1_000_000;
const OUTPUT_PRICE = 0.60 / 1_000_000;

function calculateCost(inputTokens: number, outputTokens: number) {
return inputTokens _ INPUT_PRICE + outputTokens _ OUTPUT_PRICE;
}

## Latenz simulieren:

function simulateLatency() {
return Math.floor(300 + Math.random() \* 900); // 300–1200ms realistisch
}

🧩 Gesamt-Simulations-Flow

Backend-Route:
POST /api/prompts/simulate
Sie macht:

1. Prompt aus Request lesen
2. Tokens berechnen
3. „Output-Tokens“ zufällig generieren
4. Kosten berechnen
5. Latenz simulieren
6. Alles in PostgreSQL speichern
7. Antwort mit allen Daten zurückgeben
