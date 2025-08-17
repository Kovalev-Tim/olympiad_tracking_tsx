import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import { ScrapeReturnDict } from './scrape.js'; // Adjust the import path as necessary

dotenv.config();

const app = express();
const port = 4000;

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


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
