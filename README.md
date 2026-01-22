# KI-Kosten-Dashboard

Ein Full-Stack-Dashboard zur Simulation und Analyse von KI-Prompt-Kosten.
Das Projekt berechnet Token-Nutzung, Latenzen und Kosten, speichert diese in einer Datenbank und visualisiert sie im Frontend.
Das Projekt ist bewusst als Simulation gebaut, um Kostenlogik, Datenfluss und Visualisierung zu lernen.

Frontend enthält:

✔ React
✔ TypeScript
✔ TailwindCSS
✔ Recharts
✔ Dashboard mit KPIs, Charts und Prompt-Simulation

Backend enthält:

✔ Express API
✔ Simulation von KI-/OpenAI-Daten
✔ Latenz-Simulation
✔ Token- & Kostenberechnung
✔ PostgreSQL Anbindung
✔ Logging & Analytics-Endpunkte

Projektaubau:
Zunächst wurde das React-Projekt sowie das Express-Backend initialisiert.
Anschließend wurden die notwendigen Dependencies installiert: Diese wären TailwindCSS für das Frontend und express pg cors dotenv typescript ts-node-dev @types/node @types/express @types/cors für das Backend.
Im nächsten Schritt wurde die Postgres-Datenbank erstellt. Damit wurde die Grundlage für das Monitoring-System geschaffen.

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

weitere Tabelle für die modellabhängige Kostenberechnung:
CREATE TABLE ai_models (
id SERIAL PRIMARY KEY,
model VARCHAR(50) UNIQUE NOT NULL,
input_price_per_million NUMERIC(10,5) NOT NULL,
output_price_per_million NUMERIC(10,5) NOT NULL
);

# Simulation von KI-Daten

Da kein echter OpenAI-API-Call erfolgt, werden alle relevanten Daten simuliert.

Token-Schätzung:
Math.floor(prompt.length / 4) + Zufallskomponente
Die Zufallskomponente sorgt für realistischere Werte.

Kostenberechnung (Beispiel)
const INPUT_PRICE = 0.15 / 1_000_000;
const OUTPUT_PRICE = 0.60 / 1_000_000;

function calculateCost(inputTokens, outputTokens) {
return inputTokens _ INPUT_PRICE + outputTokens _ OUTPUT_PRICE;
}

Latenz-Simulation
function simulateLatency() {
return Math.floor(300 + Math.random() \* 900);
}

Backend-Flow

- POST /api/prompts/simulate
- Prompt & Modell empfangen
- Tokens berechnen
- Output-Tokens simulieren
- Kosten berechnen
- Latenz simulieren
- Daten in PostgreSQL speichern
- Ergebnis zurückgeben

Frontend-Dashboard
KPIs

- Total Prompts
- Total Tokens
- Total Cost
- Average Cost per Prompt

Charts

- Kostenentwicklung über Zeit
- Kosten nach Modell
- Tokens pro Modell
- Durchschnittliche Latenz pro Modell

Erweiterungsmöglichkeiten

- Authentifizierung
- Echte OpenAI-API-Integration
- Fehler-Analytics
- Zeitbasierte Filter (Tag / Woche / Monat)

Noch ergänzen:

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

📊
