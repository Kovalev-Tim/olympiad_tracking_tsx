import pool from "@/lib/db";
import  { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await pool.query(
            `SELECT a.id, a.olympiad_id, o.name, a.action, a.date_start, a.date_end
            FROM olympiad_events a
            JOIN olympiads o ON a.olympiad_id = o.id
            WHERE a.date_end >= NOW()
            ORDER BY a.date_start ASC
            LIMIT 5`
        );
        console.log(result.rows);
        const upcoming_events = result.rows.map((row) => ({
            id: row.id,
            olympiad_id: row.olympiad_id,
            name: row.name,
            action: row.action,
            start: row.date_start,
            end: row.date_end,
        }));

        return NextResponse.json(upcoming_events);
    } catch (err) {
        console.error("Error fetching upcoming events:", err);
        return NextResponse.json(
              { error: "Failed to fetch  upcoming events" },
              { status: 500 }
            );
    }
}