"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";

type OlympiadOption = {
  id: number;
  name: string;
  url?: string | null;
};

export default function MyOlympiadsPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [olympiads, setOlympiads] = useState<OlympiadOption[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");


  async function loadOlympiadData() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/my_olympiads", { cache: "no-store" });
      const data = await response.json();

      setOlympiads(data.olympiads);

      if (!response.ok) {
        throw new Error(data.error || "Failed to load olympiads.");
      }

      setIsLoading(false);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Failed to load olympiads.";
      setError(message);
      setIsLoading(false);
    }
  }
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      loadOlympiadData();
    } else if (isLoaded) {
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || isLoading) {
    return <main className="mx-auto max-w-6xl p-6">Loading event manager…</main>;
  }

  if (!isSignedIn) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Sign in to manage your events</h2>
          <p className="mt-3 text-slate-600">
            You need to{" "}
            <Link href="/sign-in" className="font-medium text-slate-900">
              sign in
            </Link>{" "}
            to view your olympiads.
          </p>
          <Link className="mt-6 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white" href="/">
            Return home
          </Link>
        </div>
      </main>
    );
  }

  async function deleteOlympiad(id: number) {
    try {
      const response = await fetch(`/api/my_olympiads/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete olympiad.");
      }
      loadOlympiadData();
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : "Failed to delete olympiad.";
      setError(message);
    }
  }

  async function handleOlympiadUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setStatus(null);
    try {

      const response = await fetch(`/api/my_olympiads/${olympiadId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editName,
          url: editUrl,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to update olympiad.");
      }
      setStatus("Olympiad updated successfully.");
      setIsEditOpen(false);
      await loadOlympiadData();
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Unable to update olympiad.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  }
  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Olympiads</h1>

        <Link
          href="/add-olympiad"
          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          + Add Olympiad
        </Link>
      </div>

      {error && (
        <div className="mb-4 text-red-600">{error}</div>
      )}

      {olympiads.length === 0 ? (
        <div className="text-slate-600">
          You don’t have any olympiads yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {olympiads.map((olympiad) => (
            <div
              key={olympiad.id}
              className="border rounded-xl p-5 bg-white shadow-sm flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">
                  {olympiad.name}
                </h2>

                {olympiad.url && (
                  <a
                    href={olympiad.url}
                    target="_blank"
                    className="text-sm text-blue-600"
                  >
                    Visit website
                  </a>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/my_olympiads/${olympiad.id}`}
                  className="px-3 py-1 text-sm border rounded-md"
                >
                  View
                </Link>

                <button
                  onClick={() => openEdit(olympiad)}
                  className="px-3 py-1 text-sm bg-slate-900 text-white rounded-md"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleOlympiadUpdate}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              Edit olympiad
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update olympiad metadata shared by all related events.
            </p>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Olympiad name
                <input
                  required
                  className="rounded-lg border border-slate-300 px-3 py-2"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Olympiad website (optional)
                <input
                  type="url"
                  className="rounded-lg border border-slate-300 px-3 py-2"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isSaving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}