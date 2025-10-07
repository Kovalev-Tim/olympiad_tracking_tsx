import { NextResponse } from 'next/server';
import { getAuth } from "@clerk/nextjs/server";
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_DIRECT_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


export async function GET() {
  try {
    const { userId } = getAuth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
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
      .limit(5);

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
