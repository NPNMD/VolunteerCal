import { useState } from 'react';
import { Plus, Trash2, User } from 'lucide-react';
import type { Dependent } from '@/types';

interface Props {
  dependents: Dependent[];
  onAdd: (dep: { name: string; age?: number; notes?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function DependentsList({ dependents, onAdd, onDelete }: Props) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [notes, setNotes] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onAdd({ name, age: age ? parseInt(age) : undefined, notes: notes || undefined });
    setName(''); setAge(''); setNotes(''); setAdding(false);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Dependents</h3>
        <button onClick={() => setAdding(!adding)}
          className="flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-100">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="mb-4 space-y-3 rounded-lg bg-gray-50 p-4">
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
          <div className="flex gap-3">
            <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)}
              className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            <input type="text" placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700">Save</button>
            <button type="button" onClick={() => setAdding(false)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      {dependents.length === 0 ? (
        <p className="text-sm text-gray-500">No dependents added yet. Add family members you can sign up for events.</p>
      ) : (
        <div className="space-y-2">
          {dependents.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{d.name}</p>
                  <p className="text-xs text-gray-500">{d.age ? `Age ${d.age}` : ''}{d.notes ? ` - ${d.notes}` : ''}</p>
                </div>
              </div>
              <button onClick={() => onDelete(d.id)} className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
