import { Router } from "express";
import { pool } from "../db.js";

export const dashboardRouter = Router();

/**
 * GET /api/prompts/dashboard
 * Liefert: KPIs + Kostenverlauf + Kosten pro Modell + Tokens + Durchschnittliche Latenz
 */
dashboardRouter.get("/", async (_req, res) => {
  try {
    // ---- 1. KPIs ----
    const kpiQuery = await pool.query(`
      SELECT
        COUNT(*) AS total_prompts,
        COALESCE(SUM(total_tokens), 0) AS total_tokens,
        COALESCE(SUM(cost), 0) AS total_cost,
        COALESCE(AVG(cost), 0) AS avg_cost
      FROM prompt_logs;
    `);

    const kpi = kpiQuery.rows[0];

    // ---- 2. Kostenentwicklung pro Tag ----
    const costOverTimeQuery = await pool.query(`
      SELECT
        DATE(created_at) AS date,
        SUM(cost) AS cost
      FROM prompt_logs
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at);
    `);

    // ---- 3. Kosten nach Modell ----
    const costByModelQuery = await pool.query(`
      SELECT
        model,
        SUM(cost) AS cost
      FROM prompt_logs
      GROUP BY model
      ORDER BY model;
    `);

    // ---- 4. Tokens pro Modell ----
    const tokensByModelQuery = await pool.query(`
      SELECT
        model,
        SUM(input_tokens) AS input_tokens,
        SUM(output_tokens) AS output_tokens
      FROM prompt_logs
      GROUP BY model
      ORDER BY model;
    `);

    // ---- 5. DURCHSCHNITTLICHE LATENZ NACH MODELL (NEU) ----
    const avgLatencyByModelQuery = await pool.query(`
      SELECT
        model,
        -- Stellt sicher, dass 0 zurückgegeben wird, falls die Tabelle leer ist
        COALESCE(AVG(latency_ms), 0) AS avg_latency_ms
      FROM prompt_logs
      GROUP BY model
      ORDER BY avg_latency_ms DESC;
    `);

    res.json({
      totalPrompts: Number(kpi.total_prompts),
      totalTokens: Number(kpi.total_tokens),
      totalCost: Number(kpi.total_cost),
      avgCost: Number(kpi.avg_cost),

      costOverTime: costOverTimeQuery.rows,
      costByModel: costByModelQuery.rows,
      tokensByModel: tokensByModelQuery.rows,

      // NEUE DATENZUWEISUNG FÜR DAS FRONTEND
      avgLatencyByModel: avgLatencyByModelQuery.rows.map((row) => ({
        model: row.model,
        avg_latency_ms: Number(row.avg_latency_ms), // Stellt sicher, dass es eine Zahl ist
      })),
    });
  } catch (err) {
    console.error("Dashboard Fehler:", err);
    res.status(500).json({ error: "Fehler beim Laden des Dashboards" });
  }
});
