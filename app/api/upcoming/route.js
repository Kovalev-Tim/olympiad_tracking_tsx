import { NextResponse } from 'next/server';
import { getAuth } from "@clerk/nextjs/server";
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


export async function GET(req) {
  try {
    let userId;
    userId = getAuth(req);
    if (!userId) {
      userId = process.env.BASE_USER_ID;
    }
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 5;
    // Fetch upcoming events with olympiad names
    const { data, error } = await supabase
      .from("olympiad_events")
      .select(`
        id,
        olympiad_id,
        action,
        date_start,
        date_end,
        olympiads (name)
      `)
      .gte("date_end", new Date().toISOString()) // a.date_end >= NOW()
      .order("date_start", { ascending: true })
      .limit(limit);

    if (error) throw error;

    // Map to desired format
    const upcoming_events = data.map((row) => ({
      id: row.id,
      olympiad_id: row.olympiad_id,
      name: row.olympiads.name,
      action: row.action,
      start: row.date_start,
      end: row.date_end,
    }));

    return NextResponse.json(upcoming_events);
  } catch (err) {
    console.error("Error fetching upcoming events:", err);
    return NextResponse.json(
      { error: "Failed to fetch upcoming events", details: err.message },
      { status: 500 }
    );
  }
}
