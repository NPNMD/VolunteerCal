import { Calendar, MapPin, Users, Clock, Target, ClipboardList, Trophy, ExternalLink, Download } from 'lucide-react';
import { formatDate, formatTime } from '@/utils/dateHelpers';
import { generateGoogleCalUrl, downloadICS } from '@/services/calendar.service';
import type { CalendarEvent } from '@/types';

interface Props {
  event: CalendarEvent;
  signupCount: number;
}

export function EventDetail({ event, signupCount }: Props) {
  const googleCalUrl = generateGoogleCalUrl(event);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          {event.category && (
            <span className="rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-medium text-indigo-700">{event.category}</span>
          )}
          <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${
            event.status === 'published' ? 'bg-green-100 text-green-700' :
            event.status === 'cancelled' ? 'bg-red-100 text-red-700' :
            event.status === 'completed' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>{event.status}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{event.title}</h1>
        {event.description && <p className="mt-3 text-gray-600 leading-relaxed">{event.description}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
          <Calendar className="h-5 w-5 text-indigo-500" />
          <div>
            <p className="text-sm font-medium text-gray-900">{formatDate(event.start_time)}</p>
            <p className="text-xs text-gray-500">{event.recurrence !== 'one-time' ? `Repeats ${event.recurrence}` : 'One-time event'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
          <Clock className="h-5 w-5 text-indigo-500" />
          <div>
            <p className="text-sm font-medium text-gray-900">{formatTime(event.start_time)} - {formatTime(event.end_time)}</p>
            <p className="text-xs text-gray-500">{event.timezone || 'Local time'}</p>
          </div>
        </div>
        {event.location && (
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
            <MapPin className="h-5 w-5 text-indigo-500" />
            <p className="text-sm font-medium text-gray-900">{event.location}</p>
          </div>
        )}
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
          <Users className="h-5 w-5 text-indigo-500" />
          <div>
            <p className="text-sm font-medium text-gray-900">{signupCount} signed up</p>
            {event.max_capacity && <p className="text-xs text-gray-500">Max capacity: {event.max_capacity}</p>}
          </div>
        </div>
      </div>

      {event.goals && (
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-2"><Target className="h-4 w-4 text-indigo-500" /> Goals</h3>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{event.goals}</p>
        </div>
      )}

      {event.plan && (
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-2"><ClipboardList className="h-4 w-4 text-indigo-500" /> Plan</h3>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{event.plan}</p>
        </div>
      )}

      {event.accomplishments && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <h3 className="flex items-center gap-2 font-semibold text-green-900 mb-2"><Trophy className="h-4 w-4 text-green-600" /> Accomplishments</h3>
          <p className="text-sm text-green-800 whitespace-pre-wrap">{event.accomplishments}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <a href={googleCalUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <ExternalLink className="h-4 w-4" /> Add to Google Calendar
        </a>
        <button onClick={() => downloadICS(event)}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Download className="h-4 w-4" /> Download .ics
        </button>
      </div>
    </div>
  );
}
