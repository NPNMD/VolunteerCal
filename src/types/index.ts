export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  notification_preferences: NotificationPreferences;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  email_reminders: boolean;
  event_updates: boolean;
  group_activity: boolean;
}

export interface Dependent {
  id: string;
  user_id: string;
  name: string;
  age: number | null;
  notes: string | null;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  visibility: 'public' | 'private';
  created_by: string;
  invite_code: string;
  created_at: string;
  updated_at: string;
  member_count?: number;
  creator?: Profile;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  profile?: Profile;
}

export interface CalendarEvent {
  id: string;
  group_id: string;
  created_by: string;
  title: string;
  description: string | null;
  category: string | null;
  goals: string | null;
  plan: string | null;
  accomplishments: string | null;
  location: string | null;
  virtual_link: string | null;
  start_time: string;
  end_time: string;
  timezone: string;
  recurrence: 'one-time' | 'weekly' | 'monthly';
  max_capacity: number | null;
  signup_deadline: string | null;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
  group?: Group;
  creator?: Profile;
  signup_count?: number;
}

export interface EventSignup {
  id: string;
  event_id: string;
  user_id: string;
  dependent_id: string | null;
  status: 'confirmed' | 'waitlisted' | 'cancelled';
  signed_up_at: string;
  profile?: Profile;
  dependent?: Dependent;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string | null;
  related_event_id: string | null;
  related_group_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Reminder {
  id: string;
  event_id: string;
  user_id: string;
  remind_at: string;
  sent: boolean;
  channel: 'email' | 'in_app' | 'both';
  created_at: string;
}

export interface SearchFilters {
  query: string;
  creator: string;
  category: string;
  group_id: string;
  date_from: string;
  date_to: string;
}
