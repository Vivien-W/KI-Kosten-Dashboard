import { Router } from "express";
import { db } from "../db.js";

export const router = Router();

// Alle Logs abrufen
router.get("/", async (req, res) => {
  const result = await db.query(
    "SELECT * FROM prompt_logs ORDER BY created_at DESC"
  );
  res.json(result.rows);
});

// Neuen Log speichern
router.post("/", async (req, res) => {
  const {
    prompt,
    response,
    model,
    latency_ms,
    input_tokens,
    output_tokens,
    total_tokens,
    cost,
    success,
    error_message,
  } = req.body;

  const result = await db.query(
    `INSERT INTO prompt_logs 
    (prompt, response, model, latency_ms, input_tokens, output_tokens, total_tokens, cost, success, error_message)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [
      prompt,
      response,
      model,
      latency_ms,
      input_tokens,
      output_tokens,
      total_tokens,
      cost,
      success,
      error_message,
    ]
  );

  res.json(result.rows[0]);
});
