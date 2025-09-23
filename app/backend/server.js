import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import { ScrapeReturnDict } from 'scrape.js'; // Adjust the import path as necessary
import pool from '../../lib/db.js';

dotenv.config();

const app = express();
const port = 4000;


const to_timestamp = (date) => {
    const [dd, mm, yyyy] = date.split('-');
    const timestamp = `${yyyy}-${mm}-${dd}`;
    return timestamp;
};

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.post('/api/call_result', async (req, res) => {
    if (req.method === "POST") {
        try {
            const { url } = req.body;
            const result = await ScrapeReturnDict(url);
            for (const key in result) {
                console.log(`${key}: ${result[key]}`);
            }
            res.status(200).json({ data: result});
        } catch (error) {
            console.error('Error scraping URL:', error);
            res.status(500).json({ error: 'Failed to scrape URL' });
        }
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
});

app.post('/api/add_event', async (req, res) => {
    if (req.method === "POST") {
        try {
            const { dict } = req.body;
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
            res.status(200).json({ success: 'Event added successfully' });
        } catch (error) {
            if (error.code === '23505') {
                res.status(409).json({ exists: 'Event already exists' });
                return;
            }
            console.error('Failed to add event:', error);
            res.status(500).json({ error: 'Failed to add event' });
        }
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
});


app.post('/api/events', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT o.name, a.action, a.date_start, a.date_end
            FROM olympiad_events a
            JOIN olympiads o ON a.olympiad_id = o.id`
        );
        const events = result.rows.map((row) => ({
            title: `${row.name} - ${row.action}`,
            start: row.date_start,
            end: row.date_end,
        }));
        res.status(200).json(events);
    } catch (err) {
        console.error("Error fetching events:", err);
        res.status(500).json({ error: "Failed to fetch events" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
