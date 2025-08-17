"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import LoadingOverlay  from "./components";
import "./globals.css";




export default function Landing() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const newForm = new FormData(e.currentTarget);
        const urlValue = newForm.get("url") as string;
        try {
            const response = await fetch("http://localhost:4000/api/call_result", {
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
    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold">🏆 Olympiad Info Extractor</h1>
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
            {loading && <LoadingOverlay />}
        </main>
    );
}
