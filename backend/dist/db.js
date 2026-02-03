import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const isRender = !!process.env.DATABASE_URL;

export const pool = isRender
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT),
      database: process.env.PGDATABASE,
    });
