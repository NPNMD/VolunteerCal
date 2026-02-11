import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { useSignups } from '@/hooks/useSignups';
import { profilesService } from '@/services/profiles.service';
import { EventDetail } from '@/components/events/EventDetail';
import { SignUpButton } from '@/components/events/SignUpButton';
import { DependentSignUp } from '@/components/events/DependentSignUp';
import { isPast } from '@/utils/dateHelpers';
import type { Dependent } from '@/types';

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { currentEvent, fetchEvent } = useEvents();
  const { signups, isUserSignedUp, currentSignup, signupCount, loading, fetchSignups, checkSignupStatus, signUp, cancelSignup } = useSignups();
  const [dependents, setDependents] = useState<Dependent[]>([]);

  useEffect(() => {
    if (id) {
      fetchEvent(id);
      fetchSignups(id);
    }
  }, [id, fetchEvent, fetchSignups]);

  useEffect(() => {
    if (id && user) {
      checkSignupStatus(id, user.id);
      profilesService.getDependents(user.id).then(setDependents).catch(() => {});
    }
  }, [id, user, checkSignupStatus]);

  if (!currentEvent) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" /></div>;
  }

  const isPastDeadline = currentEvent.signup_deadline ? isPast(currentEvent.signup_deadline) : false;
  const isFull = currentEvent.max_capacity ? signupCount >= currentEvent.max_capacity : false;
  const signedUpDependentIds = signups.filter(s => s.user_id === user?.id && s.dependent_id).map(s => s.dependent_id!);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to={`/groups/${currentEvent.group_id}`} className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back to group
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
        <EventDetail event={currentEvent} signupCount={signupCount} />

        {user && currentEvent.status === 'published' && (
          <div className="mt-8 space-y-4 border-t border-gray-200 pt-6">
            <SignUpButton
              isSignedUp={isUserSignedUp}
              isWaitlisted={currentSignup?.status === 'waitlisted'}
              isPastDeadline={isPastDeadline}
              isFull={isFull}
              loading={loading}
              onSignUp={() => signUp(currentEvent.id, user.id)}
              onCancel={() => currentSignup && cancelSignup(currentSignup.id)}
            />

            {isUserSignedUp && dependents.length > 0 && (
              <DependentSignUp
                dependents={dependents}
                signedUpDependentIds={signedUpDependentIds}
                onSignUp={async (depId) => { await signUp(currentEvent.id, user.id, depId); }}
              />
            )}
          </div>
        )}

        {/* Signed up list */}
        {signups.length > 0 && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="mb-3 font-semibold text-gray-900">Signed Up ({signups.length})</h3>
            <div className="flex flex-wrap gap-2">
              {signups.map(s => (
                <span key={s.id} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {(s.profile as any)?.full_name || 'Volunteer'}{s.dependent_id ? ` + ${(s.dependent as any)?.name || 'dependent'}` : ''}
                  {s.status === 'waitlisted' && ' (waitlisted)'}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
