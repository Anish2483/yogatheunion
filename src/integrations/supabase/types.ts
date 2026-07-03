export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      action_items: {
        Row: {
          created_at: string
          created_by: string
          description: string
          due_date: string | null
          id: string
          owner_id: string | null
          response_id: string | null
          retro_id: string
          status: Database["public"]["Enums"]["action_item_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          due_date?: string | null
          id?: string
          owner_id?: string | null
          response_id?: string | null
          retro_id: string
          status?: Database["public"]["Enums"]["action_item_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          due_date?: string | null
          id?: string
          owner_id?: string | null
          response_id?: string | null
          retro_id?: string
          status?: Database["public"]["Enums"]["action_item_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "action_items_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_items_retro_id_fkey"
            columns: ["retro_id"]
            isOneToOne: false
            referencedRelation: "retros"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string | null
          id: string
          listing_id: string
          message: string | null
          name: string
          phone: string
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          listing_id: string
          message?: string | null
          name: string
          phone: string
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          listing_id?: string
          message?: string | null
          name?: string
          phone?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          address: string | null
          amenities: string[]
          category: string
          city: string
          cover_image: string | null
          created_at: string
          description: string | null
          email: string | null
          featured: boolean
          gallery: string[]
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          owner_id: string | null
          phone: string | null
          price_max: number | null
          price_min: number | null
          rating_avg: number
          rating_count: number
          slug: string
          state: string
          status: string
          tagline: string | null
          tier: string
          updated_at: string
          verified: boolean
          view_count: number
          website: string | null
          yoga_styles: string[]
        }
        Insert: {
          address?: string | null
          amenities?: string[]
          category?: string
          city?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          featured?: boolean
          gallery?: string[]
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          owner_id?: string | null
          phone?: string | null
          price_max?: number | null
          price_min?: number | null
          rating_avg?: number
          rating_count?: number
          slug: string
          state?: string
          status?: string
          tagline?: string | null
          tier?: string
          updated_at?: string
          verified?: boolean
          view_count?: number
          website?: string | null
          yoga_styles?: string[]
        }
        Update: {
          address?: string | null
          amenities?: string[]
          category?: string
          city?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          featured?: boolean
          gallery?: string[]
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          owner_id?: string | null
          phone?: string | null
          price_max?: number | null
          price_min?: number | null
          rating_avg?: number
          rating_count?: number
          slug?: string
          state?: string
          status?: string
          tagline?: string | null
          tier?: string
          updated_at?: string
          verified?: boolean
          view_count?: number
          website?: string | null
          yoga_styles?: string[]
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          brand: string | null
          category: string
          created_at: string
          description: string | null
          id: string
          image: string | null
          is_ad: boolean
          mrp: number | null
          name: string
          price: number
          slug: string
        }
        Insert: {
          active?: boolean
          brand?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          is_ad?: boolean
          mrp?: number | null
          name: string
          price: number
          slug: string
        }
        Update: {
          active?: boolean
          brand?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          is_ad?: boolean
          mrp?: number | null
          name?: string
          price?: number
          slug?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      response_comments: {
        Row: {
          created_at: string
          id: string
          response_id: string
          text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          response_id: string
          text: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          response_id?: string
          text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "response_comments_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "responses"
            referencedColumns: ["id"]
          },
        ]
      }
      response_groups: {
        Row: {
          created_at: string
          id: string
          name: string
          question_id: string
          retro_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          question_id: string
          retro_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          question_id?: string
          retro_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "response_groups_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "retro_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "response_groups_retro_id_fkey"
            columns: ["retro_id"]
            isOneToOne: false
            referencedRelation: "retros"
            referencedColumns: ["id"]
          },
        ]
      }
      response_upvotes: {
        Row: {
          created_at: string
          id: string
          response_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          response_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          response_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "response_upvotes_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "responses"
            referencedColumns: ["id"]
          },
        ]
      }
      responses: {
        Row: {
          created_at: string
          group_id: string | null
          id: string
          is_action_item: boolean
          question_id: string
          retro_id: string
          sentiment: number | null
          text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          group_id?: string | null
          id?: string
          is_action_item?: boolean
          question_id: string
          retro_id: string
          sentiment?: number | null
          text: string
          user_id: string
        }
        Update: {
          created_at?: string
          group_id?: string | null
          id?: string
          is_action_item?: boolean
          question_id?: string
          retro_id?: string
          sentiment?: number | null
          text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "responses_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "response_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "retro_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_retro_id_fkey"
            columns: ["retro_id"]
            isOneToOne: false
            referencedRelation: "retros"
            referencedColumns: ["id"]
          },
        ]
      }
      retro_participants: {
        Row: {
          id: string
          joined_at: string
          retro_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          retro_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          retro_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "retro_participants_retro_id_fkey"
            columns: ["retro_id"]
            isOneToOne: false
            referencedRelation: "retros"
            referencedColumns: ["id"]
          },
        ]
      }
      retro_questions: {
        Row: {
          created_at: string
          id: string
          question_text: string
          retro_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          question_text: string
          retro_id: string
          sort_order: number
        }
        Update: {
          created_at?: string
          id?: string
          question_text?: string
          retro_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "retro_questions_retro_id_fkey"
            columns: ["retro_id"]
            isOneToOne: false
            referencedRelation: "retros"
            referencedColumns: ["id"]
          },
        ]
      }
      retros: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          format: string
          id: string
          project_id: string | null
          status: Database["public"]["Enums"]["retro_status"]
          team_id: string | null
          timeline_end: string | null
          timeline_start: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          format?: string
          id?: string
          project_id?: string | null
          status?: Database["public"]["Enums"]["retro_status"]
          team_id?: string | null
          timeline_end?: string | null
          timeline_start?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          format?: string
          id?: string
          project_id?: string | null
          status?: Database["public"]["Enums"]["retro_status"]
          team_id?: string | null
          timeline_end?: string | null
          timeline_start?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "retros_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retros_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          body: string
          created_at: string
          id: string
          listing_id: string
          rating: number
          title: string | null
          user_id: string
          vendor_reply: string | null
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          listing_id: string
          rating: number
          title?: string | null
          user_id: string
          vendor_reply?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          listing_id?: string
          rating?: number
          title?: string | null
          user_id?: string
          vendor_reply?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      timeline_entries: {
        Row: {
          created_at: string
          description: string
          entry_date: string
          entry_time: string | null
          id: string
          retro_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          entry_date: string
          entry_time?: string | null
          id?: string
          retro_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          entry_date?: string
          entry_time?: string | null
          id?: string
          retro_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_entries_retro_id_fkey"
            columns: ["retro_id"]
            isOneToOne: false
            referencedRelation: "retros"
            referencedColumns: ["id"]
          },
        ]
      }
      top3_entries: {
        Row: {
          created_at: string
          id: string
          rank: number
          retro_id: string
          text: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rank: number
          retro_id: string
          text: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rank?: number
          retro_id?: string
          text?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "top3_entries_retro_id_fkey"
            columns: ["retro_id"]
            isOneToOne: false
            referencedRelation: "retros"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      action_item_status: "open" | "done"
      app_role: "admin" | "vendor" | "user"
      retro_status: "open" | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      action_item_status: ["open", "done"],
      app_role: ["admin", "vendor", "user"],
      retro_status: ["open", "closed"],
    },
  },
} as const
