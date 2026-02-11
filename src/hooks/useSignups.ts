import { useState, useCallback } from 'react';
import { signupsService } from '@/services/signups.service';
import type { EventSignup } from '@/types';

export function useSignups() {
  const [signups, setSignups] = useState<EventSignup[]>([]);
  const [userSignups, setUserSignups] = useState<EventSignup[]>([]);
  const [isUserSignedUp, setIsUserSignedUp] = useState(false);
  const [currentSignup, setCurrentSignup] = useState<EventSignup | null>(null);
  const [signupCount, setSignupCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSignups = useCallback(async (eventId: string) => {
    setLoading(true);
    try {
      const data = await signupsService.getSignups(eventId);
      setSignups(data);
      const count = await signupsService.getSignupCount(eventId);
      setSignupCount(count);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch signups');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserSignups = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const data = await signupsService.getUserSignups(userId);
      setUserSignups(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch your signups');
    } finally {
      setLoading(false);
    }
  }, []);

  const checkSignupStatus = useCallback(async (eventId: string, userId: string) => {
    try {
      const signup = await signupsService.isSignedUp(eventId, userId);
      setIsUserSignedUp(!!signup);
      setCurrentSignup(signup);
    } catch {
      setIsUserSignedUp(false);
    }
  }, []);

  const signUp = useCallback(async (eventId: string, userId: string, dependentId?: string) => {
    setLoading(true);
    try {
      const data = await signupsService.signUp(eventId, userId, dependentId);
      setSignups(prev => [...prev, data]);
      setSignupCount(prev => prev + 1);
      if (!dependentId) {
        setIsUserSignedUp(true);
        setCurrentSignup(data);
      }
      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelSignup = useCallback(async (signupId: string) => {
    try {
      await signupsService.cancelSignup(signupId);
      setSignups(prev => prev.filter(s => s.id !== signupId));
      setSignupCount(prev => Math.max(0, prev - 1));
      setIsUserSignedUp(false);
      setCurrentSignup(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to cancel signup');
      throw err;
    }
  }, []);

  return {
    signups, userSignups, isUserSignedUp, currentSignup, signupCount, loading, error,
    fetchSignups, fetchUserSignups, checkSignupStatus, signUp, cancelSignup,
  };
}
