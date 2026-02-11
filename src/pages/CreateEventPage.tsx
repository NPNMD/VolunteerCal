import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { EventForm } from '@/components/events/EventForm';

export function CreateEventPage() {
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get('group') || '';
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createEvent } = useEvents();

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!user) return;
    const event = await createEvent({ ...values, created_by: user.id } as any);
    navigate(`/events/${event.id}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to={groupId ? `/groups/${groupId}` : '/groups'} className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Create Event</h1>
        <EventForm groupId={groupId} onSubmit={handleSubmit} onCancel={() => navigate(-1)} />
      </div>
    </div>
  );
}
