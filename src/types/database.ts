export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          phone: string | null;
          notification_preferences: Record<string, boolean>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          phone?: string | null;
          notification_preferences?: Record<string, boolean>;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          phone?: string | null;
          notification_preferences?: Record<string, boolean>;
          updated_at?: string;
        };
      };
      dependents: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          age: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          age?: number | null;
          notes?: string | null;
        };
        Update: {
          name?: string;
          age?: number | null;
          notes?: string | null;
        };
      };
      groups: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: string | null;
          image_url: string | null;
          visibility: string;
          created_by: string;
          invite_code: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description?: string | null;
          category?: string | null;
          image_url?: string | null;
          visibility?: string;
          created_by: string;
          invite_code?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          category?: string | null;
          image_url?: string | null;
          visibility?: string;
          updated_at?: string;
        };
      };
      group_members: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          role: string;
          joined_at: string;
        };
        Insert: {
          group_id: string;
          user_id: string;
          role?: string;
        };
        Update: {
          role?: string;
        };
      };
      events: {
        Row: {
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
          recurrence: string;
          max_capacity: number | null;
          signup_deadline: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          group_id: string;
          created_by: string;
          title: string;
          description?: string | null;
          category?: string | null;
          goals?: string | null;
          plan?: string | null;
          location?: string | null;
          virtual_link?: string | null;
          start_time: string;
          end_time: string;
          timezone?: string;
          recurrence?: string;
          max_capacity?: number | null;
          signup_deadline?: string | null;
          status?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          category?: string | null;
          goals?: string | null;
          plan?: string | null;
          accomplishments?: string | null;
          location?: string | null;
          virtual_link?: string | null;
          start_time?: string;
          end_time?: string;
          timezone?: string;
          recurrence?: string;
          max_capacity?: number | null;
          signup_deadline?: string | null;
          status?: string;
          updated_at?: string;
        };
      };
      event_signups: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          dependent_id: string | null;
          status: string;
          signed_up_at: string;
        };
        Insert: {
          event_id: string;
          user_id: string;
          dependent_id?: string | null;
          status?: string;
        };
        Update: {
          status?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string | null;
          related_event_id: string | null;
          related_group_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          type: string;
          title: string;
          message?: string | null;
          related_event_id?: string | null;
          related_group_id?: string | null;
        };
        Update: {
          is_read?: boolean;
        };
      };
      reminders: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          remind_at: string;
          sent: boolean;
          channel: string;
          created_at: string;
        };
        Insert: {
          event_id: string;
          user_id: string;
          remind_at: string;
          channel?: string;
        };
        Update: {
          sent?: boolean;
        };
      };
    };
  };
}
