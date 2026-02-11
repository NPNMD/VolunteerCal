import { useRef, useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { GROUP_COLORS } from '@/config/constants';
import { EventPopover } from './EventPopover';
import { useIsMobile } from '@/hooks/useIsMobile';
import type { CalendarEvent } from '@/types';

interface Props {
  events: CalendarEvent[];
  onDateRangeChange?: (start: string, end: string) => void;
}

export function CalendarView({ events, onDateRangeChange }: Props) {
  const calendarRef = useRef<FullCalendar>(null);
  const [popoverEvent, setPopoverEvent] = useState<CalendarEvent | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ x: number; y: number } | null>(null);
  const isMobile = useIsMobile();

  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.start_time,
    end: event.end_time,
    backgroundColor: GROUP_COLORS[(event.group as any)?.category || 'other'] || '#6366F1',
    borderColor: 'transparent',
    extendedProps: { event },
  }));

  const handleEventClick = useCallback((info: any) => {
    const calEvent = info.event.extendedProps.event as CalendarEvent;
    setPopoverEvent(calEvent);

    if (window.innerWidth < 640) {
      // On mobile, show as bottom sheet (centered)
      setPopoverPos({ x: 0, y: 0 });
    } else {
      const rect = info.el.getBoundingClientRect();
      setPopoverPos({ x: rect.right + 8, y: rect.top });
    }
  }, []);

  const closePopover = useCallback(() => {
    setPopoverEvent(null);
    setPopoverPos(null);
  }, []);

  // Responsive toolbar config
  const headerToolbar = isMobile
    ? {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,listWeek',
      }
    : {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-6">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView={isMobile ? 'listWeek' : 'dayGridMonth'}
        headerToolbar={headerToolbar}
        events={calendarEvents}
        eventClick={handleEventClick}
        datesSet={(info) => onDateRangeChange?.(info.startStr, info.endStr)}
        height="auto"
        eventDisplay="block"
        dayMaxEvents={isMobile ? 2 : 3}
        nowIndicator
        // Mobile: show short day names (Mon → M)
        dayHeaderFormat={isMobile ? { weekday: 'narrow' } : undefined}
      />

      <EventPopover event={popoverEvent} position={popoverPos} onClose={closePopover} />
    </div>
  );
}
