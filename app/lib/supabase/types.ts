export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      attendances: {
        Row: {
          created_at: string;
          id: string;
          member_id: string;
          note: string | null;
          session_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          member_id: string;
          note?: string | null;
          session_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          member_id?: string;
          note?: string | null;
          session_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "attendances_member_id_fkey";
            columns: ["member_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attendances_member_id_fkey";
            columns: ["member_id"];
            isOneToOne: false;
            referencedRelation: "members_with_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attendances_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "sessions_with_turnout";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attendances_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "training_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: {
          created_at: string;
          description: string | null;
          end_date: string | null;
          id: string;
          is_published: boolean;
          kind: string;
          location: string | null;
          start_date: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          is_published?: boolean;
          kind: string;
          location?: string | null;
          start_date: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          is_published?: boolean;
          kind?: string;
          location?: string | null;
          start_date?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      join_requests: {
        Row: {
          converted_member_id: string | null;
          created_at: string;
          email: string;
          experience: string | null;
          full_name: string;
          id: string;
          message: string | null;
          phone: string | null;
          program: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          converted_member_id?: string | null;
          created_at?: string;
          email: string;
          experience?: string | null;
          full_name: string;
          id?: string;
          message?: string | null;
          phone?: string | null;
          program?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          converted_member_id?: string | null;
          created_at?: string;
          email?: string;
          experience?: string | null;
          full_name?: string;
          id?: string;
          message?: string | null;
          phone?: string | null;
          program?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "join_requests_converted_member_id_fkey";
            columns: ["converted_member_id"];
            isOneToOne: true;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "join_requests_converted_member_id_fkey";
            columns: ["converted_member_id"];
            isOneToOne: true;
            referencedRelation: "members_with_stats";
            referencedColumns: ["id"];
          },
        ];
      };
      members: {
        Row: {
          belt_rank: string;
          created_at: string;
          email: string | null;
          full_name: string;
          id: string;
          joined_on: string | null;
          matricule: string | null;
          notes: string | null;
          phone: string | null;
          profile_id: string | null;
          program: string | null;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          belt_rank?: string;
          created_at?: string;
          email?: string | null;
          full_name: string;
          id?: string;
          joined_on?: string | null;
          matricule?: string | null;
          notes?: string | null;
          phone?: string | null;
          profile_id?: string | null;
          program?: string | null;
          status?: string;
          updated_at?: string | null;
        };
        Update: {
          belt_rank?: string;
          created_at?: string;
          email?: string | null;
          full_name?: string;
          id?: string;
          joined_on?: string | null;
          matricule?: string | null;
          notes?: string | null;
          phone?: string | null;
          profile_id?: string | null;
          program?: string | null;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "members_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          role: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          full_name?: string | null;
          id: string;
          role?: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          role?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      session_coordinators: {
        Row: {
          created_at: string;
          id: string;
          member_id: string;
          role: string | null;
          session_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          member_id: string;
          role?: string | null;
          session_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          member_id?: string;
          role?: string | null;
          session_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "session_coordinators_member_id_fkey";
            columns: ["member_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "session_coordinators_member_id_fkey";
            columns: ["member_id"];
            isOneToOne: false;
            referencedRelation: "members_with_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "session_coordinators_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "sessions_with_turnout";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "session_coordinators_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "training_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      session_media: {
        Row: {
          caption: string | null;
          created_at: string;
          id: string;
          is_cover: boolean;
          media_type: string;
          public_id: string | null;
          session_id: string;
          thumbnail_url: string | null;
          url: string;
        };
        Insert: {
          caption?: string | null;
          created_at?: string;
          id?: string;
          is_cover?: boolean;
          media_type?: string;
          public_id?: string | null;
          session_id: string;
          thumbnail_url?: string | null;
          url: string;
        };
        Update: {
          caption?: string | null;
          created_at?: string;
          id?: string;
          is_cover?: boolean;
          media_type?: string;
          public_id?: string | null;
          session_id?: string;
          thumbnail_url?: string | null;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "session_media_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "sessions_with_turnout";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "session_media_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "training_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      training_sessions: {
        Row: {
          coach: string | null;
          created_at: string;
          end_time: string | null;
          focus: string | null;
          id: string;
          notes: string | null;
          start_time: string | null;
          updated_at: string | null;
        };
        Insert: {
          coach?: string | null;
          created_at?: string;
          end_time?: string | null;
          focus?: string | null;
          id?: string;
          notes?: string | null;
          start_time?: string | null;
          updated_at?: string | null;
        };
        Update: {
          coach?: string | null;
          created_at?: string;
          end_time?: string | null;
          focus?: string | null;
          id?: string;
          notes?: string | null;
          start_time?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      members_with_stats: {
        Row: {
          belt_rank: string | null;
          created_at: string | null;
          email: string | null;
          full_name: string | null;
          id: string | null;
          joined_on: string | null;
          last_attended: string | null;
          matricule: string | null;
          notes: string | null;
          phone: string | null;
          profile_id: string | null;
          program: string | null;
          sessions_since_promotion: number | null;
          sessions_total: number | null;
          status: string | null;
          updated_at: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "members_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      sessions_with_turnout: {
        Row: {
          attended_count: number | null;
          coach: string | null;
          created_at: string | null;
          end_time: string | null;
          focus: string | null;
          id: string | null;
          notes: string | null;
          start_time: string | null;
          updated_at: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      get_public_stats: { Args: never; Returns: Json };
      is_coach_or_admin: { Args: never; Returns: boolean };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
