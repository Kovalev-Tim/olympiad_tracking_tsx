"use client";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import Calendar from "./components/fullcalendar";
import LoadingOverlay  from "./components/loading";
import "./globals.css";
import UpcomingEvents from "./components/upcoming-events";


interface Event {
    title: string;
    start: string;
    end?: string;
}

export default function Landing() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        console.log("clicked!");
        e.preventDefault();
        setLoading(true);
        const newForm = new FormData(e.currentTarget);
        const urlValue = newForm.get("url") as string;
        try {
            const response = await fetch("/api/call_result", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url: urlValue }),
            });
            const { data } = await response.json();
            if (data.error) {
                console.error("Error:", data.error);
            }

            sessionStorage.setItem("parsedData", JSON.stringify(data));
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
            router.push(`/result`);
        }
    }

    const [events, setEvents] = useState<Event[]>([]);
    useEffect(() => {
        fetch("/api/show_events")
        .then((res) => res.json())
        .then((data) => setEvents(data))
        .catch((err) => console.error(err));
    })

    return (
        <main className="p-6">
            <form id="urlForm" className="mt-4 flex gap-2" onSubmit={handleSubmit}>
                <input
                    type="text"
                    id="url_bar"
                    name="url"
                    placeholder="Enter Olympiad URL"
                    className="border p-2 rounded w-full"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Parse
                </button>
            </form>
            {/* Calendar Component */}
            <div className="flex flex-row items-top mt-30">
                {!loading && <Calendar events={events} />}
                {/* Upcoming Events Component */}
                {!loading && <UpcomingEvents />}
            </div>
            {/* Loading Overlay */}
            {loading && <LoadingOverlay />}
        </main>
    );
}
