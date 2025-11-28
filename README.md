# KI-Kosten-Dashboard

Frontend enthält:

✔ React
✔ TypeScript
✔ TailwindCSS
✔ Recharts
✔ Your UI (Dashboard, Charts, Pages, Components)

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
