import { UserPlus, UserMinus, Clock } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Props {
  isSignedUp: boolean;
  isWaitlisted?: boolean;
  isPastDeadline?: boolean;
  isFull?: boolean;
  loading?: boolean;
  onSignUp: () => void;
  onCancel: () => void;
}

export function SignUpButton({ isSignedUp, isWaitlisted, isPastDeadline, isFull, loading, onSignUp, onCancel }: Props) {
  if (isPastDeadline) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-500">
        <Clock className="h-4 w-4" /> Sign-up deadline passed
      </div>
    );
  }

  if (isSignedUp) {
    return (
      <div className="flex items-center gap-3">
        <span className={cn('rounded-lg px-4 py-2.5 text-sm font-medium',
          isWaitlisted ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
        )}>
          {isWaitlisted ? 'On Waitlist' : 'Signed Up'}
        </span>
        <button onClick={onCancel} disabled={loading}
          className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50">
          <UserMinus className="h-4 w-4" /> Cancel
        </button>
      </div>
    );
  }

  return (
    <button onClick={onSignUp} disabled={loading}
      className={cn(
        'flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50',
        isFull ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'
      )}>
      <UserPlus className="h-4 w-4" />
      {loading ? 'Processing...' : isFull ? 'Join Waitlist' : 'Sign Up'}
    </button>
  );
}
