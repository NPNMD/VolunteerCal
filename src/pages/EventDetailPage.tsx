import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { useSignups } from '@/hooks/useSignups';
import { useGroups } from '@/hooks/useGroups';
import { profilesService } from '@/services/profiles.service';
import { EventDetail } from '@/components/events/EventDetail';
import { SignUpButton } from '@/components/events/SignUpButton';
import { DependentSignUp } from '@/components/events/DependentSignUp';
import { isPast } from '@/utils/dateHelpers';
import type { Dependent } from '@/types';

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentEvent, fetchEvent, deleteEvent } = useEvents();
  const { signups, isUserSignedUp, currentSignup, signupCount, loading, fetchSignups, checkSignupStatus, signUp, cancelSignup } = useSignups();
  const { members, fetchMembers } = useGroups();
  const [dependents, setDependents] = useState<Dependent[]>([]);

  useEffect(() => {
    if (id) {
      fetchEvent(id);
      fetchSignups(id);
    }
  }, [id, fetchEvent, fetchSignups]);

  useEffect(() => {
    if (currentEvent?.group_id) {
      fetchMembers(currentEvent.group_id);
    }
  }, [currentEvent?.group_id, fetchMembers]);

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
  const isCreator = currentEvent.created_by === user?.id;
  const isGroupAdmin = members.some(m => m.user_id === user?.id && m.role === 'admin');
  const canDeleteEvent = isCreator || isGroupAdmin;

  const handleDeleteEvent = async () => {
    if (!id || !confirm('Are you sure you want to delete this event? This cannot be undone.')) return;
    await deleteEvent(id);
    navigate(`/groups/${currentEvent.group_id}`);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link to={`/groups/${currentEvent.group_id}`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" /> Back to group
        </Link>
        {canDeleteEvent && (
          <button onClick={handleDeleteEvent}
            className="inline-flex items-center gap-1 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 active:bg-red-200">
            <Trash2 className="h-4 w-4" /> Delete Event
          </button>
        )}
      </div>

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
