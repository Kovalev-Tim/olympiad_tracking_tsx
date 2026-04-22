import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventContentArg } from "@fullcalendar/core";
import React from "react";

interface CalendarEvent {
    title: string;
    start: string;
    end?: string;
}

const calendarDateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
});

function formatEventDateRange(start: string, end?: string) {
    const startDate = new Date(start);
    if (Number.isNaN(startDate.getTime())) {
        return "";
    }
    if (!end) {
        return calendarDateFormatter.format(startDate);
    }
    const endDate = new Date(end);
    if (Number.isNaN(endDate.getTime())) {
        return calendarDateFormatter.format(startDate);
    }
    const sameDay = startDate.toDateString() === endDate.toDateString();
    if (sameDay) {
        return calendarDateFormatter.format(startDate);
    }
    return `${calendarDateFormatter.format(startDate)} - ${calendarDateFormatter.format(endDate)}`;
}

export default function Calendar({ events }: { events: CalendarEvent[] }) {
    const safeEvents = Array.isArray(events) ? events : [];
    const calendarEvents = safeEvents.map((event) => ({
        ...event,
        dateLabel: formatEventDateRange(event.start, event.end),
    }));

    return (
        <div className="w-full max-w-4xl mx-auto">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,dayGridWeek,dayGridDay",
                }}
                eventContent={(info: EventContentArg) => (
                    <div className="px-1 py-0.5 leading-tight">
                        <div className="text-[10px] font-semibold uppercase tracking-wide opacity-75">
                            {String(info.event.extendedProps.dateLabel ?? "")}
                        </div>
                        <div className="whitespace-normal break-words text-xs">
                            {info.event.title}
                        </div>
                    </div>
                )}
                eventClick={(info) => {
                    alert(info.event.title);
                }}
            />
        </div>
    );
}