import { NextResponse } from 'next/server';
import { getAuth } from "@clerk/nextjs/server";
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Convert date from dd-mm-yyyy to yyyy-mm-dd
const toTimestamp = (date) => {
  const [dd, mm, yyyy] = date.split('-');
  return `${yyyy}-${mm}-${dd}`;
};

export async function POST(request) {
  try {
    const { userId } = getAuth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { dict } = await request.json();

    // Fix arrays → strings
    const name = Array.isArray(dict.name) ? dict.name[0] : dict.name;
    const url = Array.isArray(dict.url) ? dict.url[0] : dict.url;
    const billing = Array.isArray(dict.billing) ? dict.billing[0] : dict.billing;
    const requirements = Array.isArray(dict.requirements) ? dict.requirements[0] : dict.requirements;
    const organizers = Array.isArray(dict.organizers) ? dict.organizers[0] : dict.organizers;
    const rewards = Array.isArray(dict.rewards) ? dict.rewards[0] : dict.rewards;

    // Check if olympiad exists
    let { data: olympiads, error: selectError } = await supabase
      .from('olympiads')
      .select('id')
      .eq('name', name)
      .limit(1);

    if (selectError) throw selectError;

    let olympiadId;

    if (olympiads.length === 0) {
      // Insert new olympiad
      const { data: insertedOlympiad, error: insertError } = await supabase
        .from('olympiads')
        .insert({
          name,
          fees: billing,
          requirements,
          organizers,
          rewards,
          url
        })
        .select('id')
        .single();

      if (insertError) throw insertError;
      olympiadId = insertedOlympiad.id;
    } else {
      olympiadId = olympiads[0].id;
    }

    // Insert events
    for (const i of dict.dates) {
      const [dateStr, action] = i.split(' – ');

      let dateStart = toTimestamp(dateStr);
      let dateEnd = toTimestamp(dateStr);

      const parsed = dateStr.split(' to ');
      if (parsed.length === 2) {
        dateStart = toTimestamp(parsed[0]);
        dateEnd = toTimestamp(parsed[1]);
      }

      // Insert event
      const { data: event, error: eventError } = await supabase
        .from('olympiad_events')
        .insert({
          olympiad_id: olympiadId,
          action,
          date_start: dateStart,
          date_end: dateEnd
        })
        .select('id')
        .single();

      if (eventError) {
        if (eventError.code === '23505') continue; // unique violation → skip
        throw eventError;
      }

      // Give user admin access
      await supabase
        .from('event_access')
        .upsert({
          user_id: userId,
          event_id: event.id,
          role: 'admin'
        });
    }

    return NextResponse.json({ success: 'Event added successfully' });
  } catch (error) {
    console.error('Failed to add event:', error);
    return NextResponse.json(
      { error: 'Failed to add event', details: error.message },
      { status: 500 }
    );
  }
}
