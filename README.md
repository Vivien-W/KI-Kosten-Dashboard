# KI-Kosten-Dashboard

Link zur Live-Demo: https://ki-kosten-dashboard.vercel.app/

Ein Full-Stack-Dashboard zur Simulation und Analyse von KI-Prompt-Kosten.
Das Projekt berechnet Token-Nutzung, Latenzen und Kosten, speichert diese in einer Datenbank und visualisiert sie im Frontend.
Das Dashboard ist bewusst als Simulation gebaut, um Kostenlogik, Datenfluss und Visualisierung zu lernen.

Wie realistisch ist die Simulation?
-> Sie ist bewusst vereinfacht, bildet aber typische Größenordnungen von Token-Nutzung, Kosten und Latenz realistisch ab.

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

# Projektaubau:

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
Math.floor(prompt.length / 4) + Zufallskomponente (5–40 Tokens)
Die Zufallskomponente sorgt für realistischere Schwankungen.

Kostenberechnung (Beispiel)
const INPUT_PRICE = 0.15 / 1_000_000;
const OUTPUT_PRICE = 0.60 / 1_000_000;

function calculateCost(inputTokens, outputTokens) {
return inputTokens _ INPUT_PRICE + outputTokens _ OUTPUT_PRICE;
}

Latenz-Simulation:
Zufällige Latenz zwischen ca. 200–1800 ms

function simulateLatency() {
return Math.floor(randomInt(200, 1800));
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

## Was habe ich in diesem Projekt gelernt?

- Wie ein Full-Stack-Projekt strukturiert ist und wie Frontend, Backend und Datenbank zusammenspielen
- Wie man eine Express-API aufbaut und saubere Endpunkte für ein Frontend bereitstellt
- Grundlagen der Datenmodellierung mit PostgreSQL (Logs, Referenztabellen, Aggregationen)
- Wie Token-Nutzung, Kosten und Latenzen konzeptionell zusammenhängen
- Wie man Daten aus dem Backend für KPIs und Charts aufbereitet
- Arbeiten mit React + TypeScript in einem größeren Komponentenbaum
- Umgang mit asynchronen Requests, Loading- und Error-States
- Wie wichtig klare Trennung von Logik, Darstellung und Datenzugriff ist

### Erkenntnisse

- Simulationen sind ein gutes Mittel, um komplexe Systeme zu verstehen, ohne von externen APIs abhängig zu sein
- Gute Visualisierung hilft, technische Metriken verständlich darzustellen
- Kleine Architekturentscheidungen (z. B. Datenstruktur, Endpunkte) haben großen Einfluss auf das Frontend

### Nächste Schritte

- Verbesserung von Typisierung und Validierung
- Erweiterung des Dashboards um Zeitfilter und Benutzerkonzepte
- Optional: Anbindung einer echten OpenAI-API
