"use client"

import { useState, useEffect } from "react";



interface Event {
    id: number;
    olympiad_id: number;
    name: string;
    action: string;
    start: string;
    end: string;
}


export default function UpcomingEvents() {
    const [upcoming_events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        fetch("/api/upcoming")
            .then(async (res) => {
              const data = await res.json();
              // Checking if the data is an array
              if (!Array.isArray(data)) {
                console.error("Unexpected data format from /api/upcoming:", data);
                return [];
              }
              return data;
            })
            .then((data) => setEvents(data))
            .catch((err) => {
                console.error("Error fetching upcoming events:", err);
                setEvents([]); // fallback to empty array to prevent .map errors
            });
    }, []);

    if (upcoming_events.length === 0) {

        return (
            <div className="max-w-3xl h-auto mx-auto mt-10 ml-15 flex flex-col items-center
                bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <p className="text-center text-gray-500">There are no upcoming events</p>
            </div>
        );
    }
    return (
        <div className="max-w-3xl h-auto mx-auto mt-10 ml-15 flex flex-col items-center
                bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Upcoming events</h2>
            <ul className="space-y-4">
                {upcoming_events.map((event) => (
                    <li key={`${event.id}-${event.olympiad_id}`} className="mb-4 p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition duration-300">
                        <div className="font-semibold">{event.name}</div>
                        <div className="text-sm text-gray-600">{event.action}</div>
                        <div className="text-sm text-gray-600">{
                            new Date(event.start).toLocaleDateString()}{" - "}
                            {new Date(event.end).toLocaleDateString()}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}