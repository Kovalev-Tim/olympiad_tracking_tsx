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

    // Fetch events where user has access
    const { data: eventsData, error } = await supabase
      .from('event_access')
      .select(`
        event_id,
        role,
        olympiad_events (
          action,
          date_start,
          date_end,
          olympiads (name)
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;

    // Map results to calendar-friendly format
    const events = eventsData.map((ea) => ({
      title: `${ea.olympiad_events.olympiads.name} - ${ea.olympiad_events.action}`,
      start: ea.olympiad_events.date_start,
      end: ea.olympiad_events.date_end,
    }));

    return NextResponse.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    return NextResponse.json(
      { error: "Failed to fetch events", details: err.message },
      { status: 500 }
    );
  }
}
