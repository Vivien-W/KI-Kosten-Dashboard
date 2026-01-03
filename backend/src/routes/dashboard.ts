import { Router } from "express";
import { pool } from "../db.js";

export const dashboardRouter = Router();

dashboardRouter.get("/", async (_req, res) => {
  try {
    // 1) KPIs
    const kpiQuery = await pool.query(`
      SELECT
        COUNT(*) AS total_prompts,
        COALESCE(SUM(total_tokens), 0) AS total_tokens,
        COALESCE(SUM(cost), 0) AS total_cost,
        COALESCE(AVG(cost), 0) AS avg_cost
      FROM prompt_logs;
    `);
    const kpi = kpiQuery.rows[0];

    // 2) Kostenentwicklung pro Tag
    const costOverTimeQuery = await pool.query(`
      SELECT
        DATE(created_at) AS date,
        SUM(cost) AS cost
      FROM prompt_logs
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at);
    `);

    // 3) Kosten nach Modell
    const costByModelQuery = await pool.query(`
      SELECT
        model,
        SUM(cost) AS cost
      FROM prompt_logs
      GROUP BY model
      ORDER BY model;
    `);

    // 4) Tokens pro Modell
    const tokensByModelQuery = await pool.query(`
      SELECT
        model,
        SUM(input_tokens) AS input_tokens,
        SUM(output_tokens) AS output_tokens
      FROM prompt_logs
      GROUP BY model
      ORDER BY model;
    `);

    // 5) DURCHSCHNITTLICHE LATENZ NACH MODELL (neu)
    const avgLatencyByModelQuery = await pool.query(`
      SELECT
        model,
        COALESCE(AVG(latency_ms), 0) AS avg_latency_ms
      FROM prompt_logs
      GROUP BY model
      ORDER BY avg_latency_ms DESC;
    `);

    // 6) Erfolgsrate (success / error)
    const successRateQuery = await pool.query(`
      SELECT
        SUM(CASE WHEN success = TRUE THEN 1 ELSE 0 END) AS success,
        SUM(CASE WHEN success = FALSE THEN 1 ELSE 0 END) AS error
      FROM prompt_logs;
    `);

    // --- Saubere Typkonversionen (Postgres liefert manchmal strings) ---
    const costOverTime = costOverTimeQuery.rows.map((r: any) => ({
      date: r.date,
      cost: Number(r.cost),
    }));

    const costByModel = costByModelQuery.rows.map((r: any) => ({
      model: r.model,
      cost: Number(r.cost),
    }));

    const tokensByModel = tokensByModelQuery.rows.map((r: any) => ({
      model: r.model,
      input_tokens: Number(r.input_tokens),
      output_tokens: Number(r.output_tokens),
    }));

    const avgLatencyByModel = avgLatencyByModelQuery.rows.map((r: any) => ({
      model: r.model,
      avg_latency_ms: Number(r.avg_latency_ms),
    }));

    const successRow = successRateQuery.rows[0] || { success: 0, error: 0 };

    // --- Response ---
    res.json({
      totalPrompts: Number(kpi.total_prompts),
      totalTokens: Number(kpi.total_tokens),
      totalCost: Number(kpi.total_cost),
      avgCost: Number(kpi.avg_cost),

      costOverTime,
      costByModel,
      tokensByModel,
      avgLatencyByModel, // <-- HIER ist die Latenz drin
      successRate: {
        success: Number(successRow.success),
        error: Number(successRow.error),
      },
    });
  } catch (err) {
    console.error("Dashboard Fehler:", err);
    res.status(500).json({ error: "Fehler beim Laden des Dashboards" });
  }
});
