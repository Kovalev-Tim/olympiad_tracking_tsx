"use client";
import { useRouter } from "next/navigation";
import React from "react";
import Calendar from "../components/fullcalendar";
import UpcomingEvents from "../components/upcoming-events";


export default function Intro() {
    const demoEvents = [
      { title: "Math Olympiad", start: "2025-12-20" },
      { title: "CS Hackathon", start: "2025-12-25" },
    ];
    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            {/* Title section */}
            <section className="text-center mt-10">
            <h1 className="text-5xl font-bold">trackolymp.tech</h1>
            <p className="text-xl mt-4 text-gray-700">
              Keep track of every competition. Everywhere. At any time.
            </p>
            </section>
            <section className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-semibold mb-4">Purpose & Goals</h2>
                <p className="mb-4">
                  Olympiad Tracker helps students and mentors manage competitions efficiently. Our main goals are:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Track upcoming Olympiads in one place.</li>
                  <li>Visualize events in an interactive calendar.</li>
                  <li>Receive notifications for deadlines and results.</li>
                  <li>Provide quick access to contest resources and results.</li>
                </ul>
            </section>
            {/* Features / Demos */}
            <section className="max-w-5xl mx-auto space-y-8">
              <h2 className="text-3xl font-semibold mb-6 text-center">Features</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {/* Calendar Demo */}
                <div className="border rounded p-4 shadow hover:shadow-lg transition">
                  <h3 className="font-bold text-xl mb-2">Calendar</h3>
                  <p className="text-gray-600 mb-2">
                    See all upcoming events and deadlines visually.
                  </p>
                  <div className="h-64 overflow-hidden">
                    <Calendar events={demoEvents} />
                  </div>
                </div>
                {/* Upcoming Events Demo */}
                <div className="border rounded p-4 shadow hover:shadow-lg transition">
                  <h3 className="font-bold text-xl mb-2">Upcoming Events</h3>
                  <p className="text-gray-600 mb-2">
                    Get a quick list of the next competitions with deadlines.
                  </p>
                  <UpcomingEvents/>
                </div>
                {/* Notifications Demo */}
                <div className="border rounded p-4 shadow hover:shadow-lg transition">
                  <h3 className="font-bold text-xl mb-2">Notifications</h3>
                  <p className="text-gray-600">
                    Never miss a deadline with our alert system (demo coming soon).
                  </p>
                  <div className="h-32 flex items-center justify-center bg-gray-50 border rounded">
                    Demo Placeholder
                  </div>
                </div>
              </div>
            </section>
            {/* Call to Action */}
            <section className="text-center mt-10">
              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
                Get Started
              </button>
            </section>
        </main>
    )
}