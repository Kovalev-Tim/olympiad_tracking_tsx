import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query("SELECT NOW()");
  console.log(result.rows);
  return new Response(JSON.stringify(result.rows));
}
