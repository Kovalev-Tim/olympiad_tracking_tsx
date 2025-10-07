import { NextResponse } from 'next/server';
import { getAuth } from "@clerk/nextjs/server";
import { createClient } from '@supabase/supabase-js'
import pool from '@/lib/db';

const supabaseUrl = 'https://hiovspodxpbatwgvscrq.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const to_timestamp = (date) => {
  const [dd, mm, yyyy] = date.split('-');
  return `${yyyy}-${mm}-${dd}`;
};

export async function POST(request) {
  try {
    const { userId } = getAuth(); // userId via Clerk Auth
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { dict } = await request.json();
    console.log(dict);
    console.log(dict.name);
    console.log("-----------");
    //create strings instead of arrays. FIX FOR BILLING AND REQUIREMENTS
    const name = Array.isArray(dict.name) ? dict.name[0] : dict.name;
    const url = Array.isArray(dict.url) ? dict.url[0] : dict.url;
    const billing = Array.isArray(dict.billing) ? dict.billing[0] : dict.billing;
    const requirements = Array.isArray(dict.requirements) ? dict.requirements[0] : dict.requirements;
    const organizers = Array.isArray(dict.organizers) ? dict.organizers[0] : dict.organizers;
    const rewards = Array.isArray(dict.rewards) ? dict.rewards[0] : dict.rewards;
    const result = await pool.query(
      `SELECT id FROM olympiads WHERE name = $1`,
      [name]
    );

    let olympiadId;
    if (result.rows.length === 0) {
      const insertOlympiad = await pool.query(
        `INSERT INTO olympiads (name, fees, requirements, organizers, rewards, url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [name, billing, requirements, organizers, rewards, url]
      );
      olympiadId = insertOlympiad.rows[0].id;
    } else {
      olympiadId = result.rows[0].id;
    }

    for (const i of dict.dates) {
      const [date, action] = i.split(' – ');
      let date_start = to_timestamp(date);
      let date_end = to_timestamp(date);

      const parsed = date.split(' to ');
      if (parsed.length === 2) {
        date_start = to_timestamp(parsed[0]);
        date_end = to_timestamp(parsed[1]);
      }

      console.log(date, action);
      const query = "INSERT INTO olympiad_events (olympiad_id, action, date_start, date_end) VALUES ($1, $2, $3, $4) RETURNING id";
      const values = [olympiadId, action, date_start, date_end];
      const AddResult = await pool.query(query, values);
      await pool.query(
        `INSERT INTO event_access (user_id, event_id, role) VALUES ($1, $2, 'admin')
         ON CONFLICT DO NOTHING`,
        [userId, AddResult.rows[0].id]
      );
    }

    console.log('Events added successfully');
    return NextResponse.json({ success: 'Event added successfully' });
  } catch (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { exists: 'Event already exists' },
        { status: 409 }
      );
    }
    console.error('Failed to add event:', error);
    return NextResponse.json(
      { error: 'Failed to add event' },
      { status: 500 }
    );
  }
}