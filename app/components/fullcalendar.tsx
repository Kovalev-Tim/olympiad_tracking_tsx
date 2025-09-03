import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import React  from "react";

interface CalendarEvent {
    title: string;
    start: string;
    end?: string;
}

export default function Calendar({ events }: { events: CalendarEvent[] }) {
    return (
        <div className = "w-full max-w-4xl mx-auto">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,dayGridWeek,dayGridDay",
                }}
                eventClick={(info) => {
                    alert(info.event.title);
                }}
            />
        </div>
    );
}