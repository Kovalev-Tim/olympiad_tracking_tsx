import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }


    const result = await pool.query(
      `SELECT o.name, a.action, a.date_start, a.date_end
       FROM olympiad_events a
       JOIN olympiads o ON a.olympiad_id = o.id
       JOIN event_access ea ON a.id = ea.event_id
       WHERE ea.user_id = $1`,
      [userId]
    );

    const events = result.rows.map((row) => ({
      title: `${row.name} - ${row.action}`,
      start: row.date_start,
      end: row.date_end,
    }));

    return NextResponse.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}