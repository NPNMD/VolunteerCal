import { useState } from 'react';
import { EVENT_CATEGORIES, RECURRENCE_OPTIONS } from '@/config/constants';
import { toInputDatetime } from '@/utils/dateHelpers';
import type { CalendarEvent } from '@/types';

interface Props {
  initialValues?: Partial<CalendarEvent>;
  groupId: string;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function EventForm({ initialValues, groupId, onSubmit, onCancel, submitLabel = 'Create Event' }: Props) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [category, setCategory] = useState(initialValues?.category || '');
  const [goals, setGoals] = useState(initialValues?.goals || '');
  const [plan, setPlan] = useState(initialValues?.plan || '');
  const [location, setLocation] = useState(initialValues?.location || '');
  const [virtualLink, setVirtualLink] = useState(initialValues?.virtual_link || '');
  const [startTime, setStartTime] = useState(initialValues?.start_time ? toInputDatetime(initialValues.start_time) : '');
  const [endTime, setEndTime] = useState(initialValues?.end_time ? toInputDatetime(initialValues.end_time) : '');
  const [recurrence, setRecurrence] = useState<string>(initialValues?.recurrence || 'one-time');
  const [maxCapacity, setMaxCapacity] = useState(initialValues?.max_capacity?.toString() || '');
  const [signupDeadline, setSignupDeadline] = useState(initialValues?.signup_deadline ? toInputDatetime(initialValues.signup_deadline) : '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required'); return; }
    if (!startTime || !endTime) { setError('Start and end time are required'); return; }
    if (new Date(startTime) >= new Date(endTime)) { setError('End time must be after start time'); return; }

    setSaving(true);
    setError('');
    try {
      await onSubmit({
        group_id: groupId,
        title, description, category, goals, plan,
        location, virtual_link: virtualLink,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        recurrence,
        max_capacity: maxCapacity ? parseInt(maxCapacity) : null,
        signup_deadline: signupDeadline ? new Date(signupDeadline).toISOString() : null,
        status: 'published',
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Event Title *</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="e.g., Park Cleanup Day" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputCls} placeholder="What is this event about?" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
            <option value="">Select category</option>
            {EVENT_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Recurrence</label>
          <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)} className={inputCls}>
            {RECURRENCE_OPTIONS.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Goals</label>
        <textarea value={goals} onChange={(e) => setGoals(e.target.value)} rows={2} className={inputCls} placeholder="What do you hope to accomplish?" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Plan / Agenda</label>
        <textarea value={plan} onChange={(e) => setPlan(e.target.value)} rows={2} className={inputCls} placeholder="Step-by-step plan for the event" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Start Time *</label>
          <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">End Time *</label>
          <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputCls} placeholder="Physical address" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Virtual Link</label>
          <input type="url" value={virtualLink} onChange={(e) => setVirtualLink(e.target.value)} className={inputCls} placeholder="Zoom/Meet link" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Max Capacity</label>
          <input type="number" value={maxCapacity} onChange={(e) => setMaxCapacity(e.target.value)} className={inputCls} placeholder="Leave blank for unlimited" min="1" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Sign-up Deadline</label>
          <input type="datetime-local" value={signupDeadline} onChange={(e) => setSignupDeadline(e.target.value)} className={inputCls} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {saving ? 'Saving...' : submitLabel}
        </button>
        <button type="button" onClick={onCancel}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
      </div>
    </form>
  );
}
