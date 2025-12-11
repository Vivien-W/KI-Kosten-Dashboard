import { Router } from "express";
import { pool } from "../db.js";
export const dashboardRouter = Router();
/**
 * GET /api/prompts/dashboard
 * Liefert: KPIs + Kostenverlauf + Kosten pro Modell + Tokens + Erfolgsrate
 */
dashboardRouter.get("/dashboard", async (_req, res) => {
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
        // ---- 5. Erfolgsrate ----
        const successRateQuery = await pool.query(`
      SELECT
        SUM(CASE WHEN success = TRUE THEN 1 ELSE 0 END) AS success,
        SUM(CASE WHEN success = FALSE THEN 1 ELSE 0 END) AS error
      FROM prompt_logs;
    `);
        res.json({
            totalPrompts: Number(kpi.total_prompts),
            totalTokens: Number(kpi.total_tokens),
            totalCost: Number(kpi.total_cost),
            avgCost: Number(kpi.avg_cost),
            costOverTime: costOverTimeQuery.rows,
            costByModel: costByModelQuery.rows,
            tokensByModel: tokensByModelQuery.rows,
            successRate: successRateQuery.rows[0],
        });
    }
    catch (err) {
        console.error("Dashboard Fehler:", err);
        res.status(500).json({ error: "Fehler beim Laden des Dashboards" });
    }
});
