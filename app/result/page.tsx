"use client"; // Needed for client-side hooks in Next.js App Router

import React, { useEffect, useState } from "react";

type ParsedData = {
  name: string;
  url: string;
  dates: any[];
  billing: any[];
  requirements: any[];
  rewards: any[];
  organizers: any[];
};

export default function ResultsPage() {
  const [data, setData] = useState<ParsedData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("parsedData");
    if (stored) {
      const parsed = JSON.parse(stored) as ParsedData;
      setData(parsed);
    }
  }, []);
  console.log(data);
  function buildList(items: any[]) {
    if (!items || items.length === 0) return <p>Not specified</p>;

    return (
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        {items.map((item, i) =>
          typeof item === "string" ? (
            <li className="text-gray-700 font-semibold" key={i}>{item}</li>
          ) : (
            <li key={i}>
              {item.main}
              {item.subitems && (
                <ul>
                  {item.subitems.map((sub: string, j: number) => (
                    <li key={j}>{sub}</li>
                  ))}
                </ul>
              )}
            </li>
          )
        )}
      </ul>
    );
  }

  async function handleAddEvent() {
    if (!data) return;

    try {
      const response = await fetch("/api/add_event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dict: data }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Event added successfully!");
        window.location.href = "/";
      } else if (result.exists){
        alert("Event already exists!");
        window.location.href = "/";
      } else {
        alert("Failed to add event");
        console.error(result.error);
      }
    } catch (error) {
      const err = error as { code: string };
      if (err.code === '23505') {
        alert('Event already exists');
        window.location.href = "/";
      }
      throw error;
    }
  }

  if (!data) {
    return <p>Error loading data. Please try again.</p>;
  }

  const displayDates = Array.isArray(data.dates) ? data.dates.map(d => `${d.dateStart} to ${d.dateEnd} – ${d.description}`) : [];

  return (
    <div>
      <div className="name-button flex-row justify-between">
        <div className="display-flex, flex-col">
          <h4 className="text-lg font-semibold text-slate-900">{data.name}</h4>
          <h5>
            <a
              href={data.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-600 hover:underline dark:text-blue-500"
            >
              {data.url}
            </a>
          </h5>
        </div>
        <button type="button" className="rounded-lg bg-slate-800 px-4 py-2 m-3 text-sm font-semibold text-white hover:bg-slate-600 hover:px-4.5 hover:py-3 duration-300 ease-in-out" onClick={handleAddEvent}>
          Add Event
        </button>
      </div>

      <div className="box">
        <h2> Dates</h2>
        {buildList(displayDates)}
      </div>
      <div className="box">
        <h2> Billing</h2>
        {buildList(data.billing)}
      </div>
      <div className="box">
        <h2> Requirements</h2>
        {buildList(data.requirements)}
      </div>
      <div className="box">
        <h2> Organizers</h2>
        {buildList(data.organizers)}
      </div>
      <div className="box">
        <h2> Rewards</h2>
        {buildList(data.rewards)}
      </div>
    </div>
  );
}
