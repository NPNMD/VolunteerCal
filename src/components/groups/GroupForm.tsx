import { useState } from 'react';
import { GROUP_CATEGORIES } from '@/config/constants';

interface Props {
  initialValues?: { name: string; description: string; category: string; visibility: string };
  onSubmit: (values: { name: string; description: string; category: string; visibility: string }) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function GroupForm({ initialValues, onSubmit, onCancel, submitLabel = 'Create Group' }: Props) {
  const [name, setName] = useState(initialValues?.name || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [category, setCategory] = useState(initialValues?.category || '');
  const [visibility, setVisibility] = useState(initialValues?.visibility || 'public');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Group name is required'); return; }
    setSaving(true);
    setError('');
    try {
      await onSubmit({ name, description, category, visibility });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Group Name *</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          placeholder="e.g., Helping Hands Foundation" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          placeholder="What is this group about?" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
          <option value="">Select category</option>
          {GROUP_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Visibility</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="visibility" value="public" checked={visibility === 'public'} onChange={() => setVisibility('public')} className="text-indigo-600" />
            Public
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="visibility" value="private" checked={visibility === 'private'} onChange={() => setVisibility('private')} className="text-indigo-600" />
            Private
          </label>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {saving ? 'Saving...' : submitLabel}
        </button>
        <button type="button" onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
      </div>
    </form>
  );
}
