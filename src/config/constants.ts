export const APP_NAME = 'VolunteerCal';

export const EVENT_CATEGORIES = [
  'cleanup',
  'fundraiser',
  'mentoring',
  'food-drive',
  'tutoring',
  'community-service',
  'sports',
  'arts',
  'health',
  'environment',
  'education',
  'other',
] as const;

export const EVENT_STATUSES = ['draft', 'published', 'cancelled', 'completed'] as const;

export const RECURRENCE_OPTIONS = ['one-time', 'weekly', 'monthly'] as const;

export const GROUP_CATEGORIES = [
  'nonprofit',
  'school',
  'church',
  'community',
  'sports',
  'environmental',
  'health',
  'education',
  'arts',
  'other',
] as const;

export const MEMBER_ROLES = ['admin', 'member'] as const;

export const SIGNUP_STATUSES = ['confirmed', 'waitlisted', 'cancelled'] as const;

export const NOTIFICATION_TYPES = [
  'event_reminder',
  'event_update',
  'event_cancelled',
  'group_invite',
  'new_member',
  'signup_confirmation',
] as const;

export const GROUP_COLORS: Record<string, string> = {
  nonprofit: '#3B82F6',
  school: '#F59E0B',
  church: '#8B5CF6',
  community: '#10B981',
  sports: '#EF4444',
  environmental: '#22C55E',
  health: '#EC4899',
  education: '#6366F1',
  arts: '#F97316',
  other: '#6B7280',
};
