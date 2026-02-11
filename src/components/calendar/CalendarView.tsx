import { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { GROUP_COLORS } from '@/config/constants';
import { EventPopover } from './EventPopover';
import type { CalendarEvent } from '@/types';

interface Props {
  events: CalendarEvent[];
  onDateRangeChange?: (start: string, end: string) => void;
}

export function CalendarView({ events, onDateRangeChange }: Props) {
  const calendarRef = useRef<FullCalendar>(null);
  const [popoverEvent, setPopoverEvent] = useState<CalendarEvent | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ x: number; y: number } | null>(null);

  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.start_time,
    end: event.end_time,
    backgroundColor: GROUP_COLORS[(event.group as any)?.category || 'other'] || '#6366F1',
    borderColor: 'transparent',
    extendedProps: { event },
  }));

  const handleEventClick = (info: any) => {
    const rect = info.el.getBoundingClientRect();
    const calEvent = info.event.extendedProps.event as CalendarEvent;
    setPopoverEvent(calEvent);
    setPopoverPos({ x: rect.right + 8, y: rect.top });
  };

  const closePopover = () => {
    setPopoverEvent(null);
    setPopoverPos(null);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        }}
        events={calendarEvents}
        eventClick={handleEventClick}
        datesSet={(info) => onDateRangeChange?.(info.startStr, info.endStr)}
        height="auto"
        eventDisplay="block"
        dayMaxEvents={3}
        nowIndicator
      />

      <EventPopover event={popoverEvent} position={popoverPos} onClose={closePopover} />
    </div>
  );
}
