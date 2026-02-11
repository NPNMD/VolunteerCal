import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import type { Dependent } from '@/types';

interface Props {
  dependents: Dependent[];
  onSignUp: (dependentId: string) => Promise<void>;
  signedUpDependentIds: string[];
}

export function DependentSignUp({ dependents, onSignUp, signedUpDependentIds }: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  if (dependents.length === 0) return null;

  const handleSignUp = async (depId: string) => {
    setLoading(depId);
    try {
      await onSignUp(depId);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <h4 className="mb-3 text-sm font-semibold text-gray-900">Sign up dependents</h4>
      <div className="space-y-2">
        {dependents.map((dep) => {
          const isSignedUp = signedUpDependentIds.includes(dep.id);
          return (
            <div key={dep.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <span className="text-sm text-gray-700">{dep.name}{dep.age ? ` (${dep.age})` : ''}</span>
              {isSignedUp ? (
                <span className="text-xs font-medium text-green-600">Signed Up</span>
              ) : (
                <button onClick={() => handleSignUp(dep.id)} disabled={loading === dep.id}
                  className="flex items-center gap-1 rounded bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-200 disabled:opacity-50">
                  <UserPlus className="h-3 w-3" /> {loading === dep.id ? '...' : 'Sign Up'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
