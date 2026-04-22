import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req, { params }) {
  try {
    const { OlympiadId } = params;
    const userId = getAuthorizedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: olmpiadData, error: olmpiadError } = await supabase
      .from('olympiads')
      .select('id, name, url')
      .eq('id', OlympiadId)
      .limit(1);
    if (olmpiadError) {
      throw olmpiadError;
    }

    const olympiad = olmpiadData[0];

    const { data: eventsData, error: eventsError } = await supabase
      .from('olympiad_events')
      .select('id, action, date_start, date_end')
      .eq('olympiad_id', OlympiadId);
    if (eventsError) {
      throw eventsError;
    }

    const events = eventsData.map((event) => ({
      id: event.id,
      action: event.action,
      start: event.date_start,
      end: event.date_end,
    }));

    return NextResponse.json({ olympiad : olympiad, events: events });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

