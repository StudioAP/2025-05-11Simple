export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      inquiries: {
        Row: {
          content: string;
          created_at: string;
          email: string;
          id: string;
          is_read: boolean;
          name: string;
          school_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          email: string;
          id?: string;
          is_read?: boolean;
          name: string;
          school_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          email?: string;
          id?: string;
          is_read?: boolean;
          name?: string;
          school_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inquiries_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      photos: {
        Row: {
          created_at: string;
          id: string;
          image_url: string;
          order: number | null;
          school_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          image_url: string;
          order?: number | null;
          school_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          image_url?: string;
          order?: number | null;
          school_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "photos_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          full_name: string | null;
          id: string;
          subscription_status: string | null;
          trial_ends_at: string | null;
          trial_starts_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          full_name?: string | null;
          id: string;
          subscription_status?: string | null;
          trial_ends_at?: string | null;
          trial_starts_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          full_name?: string | null;
          id?: string;
          subscription_status?: string | null;
          trial_ends_at?: string | null;
          trial_starts_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      schools: {
        Row: {
          address: string | null;
          catchphrase: string | null;
          city: string | null;
          created_at: string;
          description: string | null;
          fee_structure: Json | null;
          id: string;
          images: string[] | null;
          is_active: boolean | null;
          keywords: string[] | null;
          prefecture: string | null;
          school_type: Database["public"]["Enums"]["school_type_enum"] | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          subscription_status: string | null;
          title: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          address?: string | null;
          catchphrase?: string | null;
          city?: string | null;
          created_at?: string;
          description?: string | null;
          fee_structure?: Json | null;
          id?: string;
          images?: string[] | null;
          is_active?: boolean | null;
          keywords?: string[] | null;
          prefecture?: string | null;
          school_type?: Database["public"]["Enums"]["school_type_enum"] | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: string | null;
          title: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          address?: string | null;
          catchphrase?: string | null;
          city?: string | null;
          created_at?: string;
          description?: string | null;
          fee_structure?: Json | null;
          id?: string;
          images?: string[] | null;
          is_active?: boolean | null;
          keywords?: string[] | null;
          prefecture?: string | null;
          school_type?: Database["public"]["Enums"]["school_type_enum"] | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: string | null;
          title?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "schools_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: {
          created_at: string;
          current_period_end: string;
          id: string;
          status: string | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          current_period_end: string;
          id?: string;
          status?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          current_period_end?: string;
          id?: string;
          status?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      school_type_enum: "piano" | "rhythmic" | "both";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"];
export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T];

// The rest of the type utilities can be included from the original generation, 
// or you can define them as needed.
// For brevity, I'm omitting the full list of helper types like TablesInsert, TablesUpdate etc.
// but they were part of the `generate_typescript_types` output and should be included here.

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never


export const Constants = {
  public: {
    Enums: {
      school_type_enum: ["piano", "rhythmic", "both"],
    },
  },
} as const;
