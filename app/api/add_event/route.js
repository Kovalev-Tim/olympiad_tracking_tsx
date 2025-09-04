import { NextResponse } from 'next/server';
import pool from '@/lib/db';

const to_timestamp = (date) => {
  const [dd, mm, yyyy] = date.split('-');
  return `${yyyy}-${mm}-${dd}`;
};

export async function POST(request) {
  try {
    const { dict } = await request.json();
    console.log(dict);

    const name = dict.name[0];
    const url = dict.url;

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
      const query = "INSERT INTO events (name, url, action, date_start, date_end) VALUES ($1, $2, $3, $4, $5)";
      const values = [name, url, action, date_start, date_end];
      await pool.query(query, values);
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