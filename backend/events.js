import pool from "./db.js";


export default async function handler(req, res) {
    try {
        const result = await pool.query(
            `SELECT o.name a.action a.date_start a.date_end
            FROM olympiad_events a
            JOIN olympiads o ON a.olympiad_id = o.id`
        );

        const events = result.rows.map((row) => ({
            title: `${row.name} - ${row.action}`,
            start: row.date_start,
            end: row.date_end,
        }))

        res.status(200).json(events);
    } catch (err) {
        console.error("Error fetching events:", err);
        res.status(500).json({ error: "Failed to fetch events" });
    }
}