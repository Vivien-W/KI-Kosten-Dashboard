//NOTE: Input-Validierung und Typisierung weiter ausbauen!
import { Router } from "express";
import { pool } from "../db.js";
import { randomInt } from "crypto";
export const router = Router();
/*** Hilfsfunktionen für die Simulation*/
function simulateTokenCount(prompt) {
    const inputTokens = Math.floor(prompt.length / 4) + randomInt(5, 40);
    const outputTokens = randomInt(50, 500);
    const totalTokens = inputTokens + outputTokens;
    return { inputTokens, outputTokens, totalTokens };
}
function simulateLatency() {
    return randomInt(200, 1800); // ms
}
/**
 * POST /api/prompts/simulate
 * Simuliert eine AI-Response & speichert sie in der Datenbank
 */
router.post("/simulate", async (req, res) => {
    try {
        const { prompt, model } = req.body;
        if (!prompt || !model) {
            return res
                .status(400)
                .json({ error: "prompt & model sind erforderlich" });
        }
        // Modellpreise aus DB laden
        const modelQuery = await pool.query("SELECT * FROM ai_models WHERE model = $1", [model]);
        if (modelQuery.rows.length === 0) {
            return res
                .status(400)
                .json({ error: "Modell nicht in der Datenbank gefunden" });
        }
        const modelData = modelQuery.rows[0];
        // Token-Simulation
        const { inputTokens, outputTokens, totalTokens } = simulateTokenCount(prompt);
        // Kostenberechnung pro 1.000.000 Tokens
        const cost = (inputTokens / 1000000) * Number(modelData.input_price_per_million) +
            (outputTokens / 1000000) * Number(modelData.output_price_per_million);
        const latency = simulateLatency();
        // Dummy AI-Antwort (kein API-Call!)
        const fakeResponse = `Simulierte Antwort basierend auf: "${prompt.slice(0, 50)}..."`;
        // Eintrag speichern
        const insertQuery = `
      INSERT INTO prompt_logs 
      (prompt, response, model, latency_ms, input_tokens, output_tokens, total_tokens, cost, success)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,TRUE)
      RETURNING *;
    `;
        const saved = await pool.query(insertQuery, [
            prompt,
            fakeResponse,
            model,
            latency,
            inputTokens,
            outputTokens,
            totalTokens,
            cost.toFixed(5),
        ]);
        res.json({
            message: "Simulation gespeichert",
            data: saved.rows[0],
        });
    }
    catch (err) {
        console.error("Fehler in /simulate:", err);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
});
/**
 * GET /api/prompts/models
 * Liefert alle verfügbaren AI-Modelle aus der Datenbank
 */
router.get("/models", async (_req, res) => {
    try {
        const result = await pool.query("SELECT * FROM ai_models ORDER BY model ASC");
        res.json(result.rows);
    }
    catch (err) {
        console.error("Fehler in /api/models:", err.message); // <-- zeigt die DB Fehlermeldung
        res.status(500).json({ error: "Fehler beim Laden der Modelle" });
    }
});
/**
 * GET /api/prompts/recent
 * Letzte Logs (für Charts, Tabellen, Statistiken)
 */
router.get("/recent", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM prompt_logs ORDER BY created_at DESC LIMIT 50");
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json({ error: "Konnte Logs nicht laden" });
    }
});
//Temporäre Init-Route
router.get("/init-db", async (_req, res) => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS prompt_logs (
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
    `);
        await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_models (
        id SERIAL PRIMARY KEY,
        model VARCHAR(50) UNIQUE NOT NULL,
        input_price_per_million NUMERIC(10,5) NOT NULL,
        output_price_per_million NUMERIC(10,5) NOT NULL
      );
    `);
        await pool.query(`
      INSERT INTO ai_models (model, input_price_per_million, output_price_per_million)
      VALUES
        ('gpt-4o-mini', 0.15, 0.60),
        ('gpt-o1', 1.00, 3.00)
      ON CONFLICT (model) DO NOTHING;
    `);
        res.json({ status: "ok", message: "DB initialisiert 🚀" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB-Init fehlgeschlagen" });
    }
});
