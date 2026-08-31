import { Pool } from "pg";
import "dotenv/config";

export const db: Pool = new Pool({
    connectionString: process.env.DATABASE_URL
});