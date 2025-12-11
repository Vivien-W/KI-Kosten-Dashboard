import { Router } from "express";
import { pool } from "../db.js";

export const statsRouter = Router();

/**
 * 1) Kostenentwicklung pro Tag
 * GET /api/stats/cost-over-time
 */
statsRouter.get("/cost-over-time", async (_req, res) => {
  try {
    const query = `
      SELECT 
        DATE(created_at) AS date,
        SUM(cost) AS total_cost,
        COUNT(*) AS count_prompts
      FROM prompt_logs
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Fehler in /cost-over-time:", err);
    res.status(500).json({ error: "Fehler beim Laden der Kostenentwicklung" });
  }
});

/**
 * 2) Kosten pro Modell
 * GET /api/stats/cost-per-model
 */
statsRouter.get("/cost-per-model", async (_req, res) => {
  try {
    const query = `
      SELECT
        model,
        SUM(cost) AS total_cost,
        COUNT(*) AS count_prompts
      FROM prompt_logs
      GROUP BY model
      ORDER BY total_cost DESC;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Fehler in /cost-per-model:", err);
    res.status(500).json({ error: "Fehler beim Laden der Modellkosten" });
  }
});

/**
 * 3) Token pro Modell
 * GET /api/stats/tokens-per-model
 */
statsRouter.get("/tokens-per-model", async (_req, res) => {
  try {
    const query = `
      SELECT
        model,
        SUM(input_tokens) AS total_input_tokens,
        SUM(output_tokens) AS total_output_tokens,
        SUM(total_tokens) AS total_tokens
      FROM prompt_logs
      GROUP BY model
      ORDER BY total_tokens DESC;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Fehler in /tokens-per-model:", err);
    res.status(500).json({ error: "Fehler beim Laden der Tokens" });
  }
});

/**
 * 4) Erfolgreich vs. Fehlerhaft
 * GET /api/stats/success-vs-error
 */
statsRouter.get("/success-vs-error", async (_req, res) => {
  try {
    const query = `
      SELECT 
        success,
        COUNT(*) AS count
      FROM prompt_logs
      GROUP BY success;
    `;

    const result = await pool.query(query);

    // Kleine Transformation für Pie-Charts
    const mapped = result.rows.map((row) => ({
      name: row.success ? "Erfolgreich" : "Fehler",
      value: Number(row.count),
    }));

    res.json(mapped);
  } catch (err) {
    console.error("Fehler in /success-vs-error:", err);
    res.status(500).json({ error: "Fehler beim Laden von Success/Error" });
  }
});
