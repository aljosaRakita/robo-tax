export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          email_verified: boolean;
          phone_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          phone?: string | null;
          email_verified?: boolean;
          phone_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string | null;
          email_verified?: boolean;
          phone_verified?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          label: string;
          icon: string;
          description: string;
          sort_order: number;
        };
        Insert: {
          id: string;
          label: string;
          icon: string;
          description: string;
          sort_order: number;
        };
        Update: {
          id?: string;
          label?: string;
          icon?: string;
          description?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      power_ups: {
        Row: {
          id: string;
          name: string;
          description: string;
          category_id: string;
          logo_url: string;
          savings_weight: number;
          is_native: boolean;
          enabled: boolean;
        };
        Insert: {
          id: string;
          name: string;
          description: string;
          category_id: string;
          logo_url: string;
          savings_weight?: number;
          is_native?: boolean;
          enabled?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          category_id?: string;
          logo_url?: string;
          savings_weight?: number;
          is_native?: boolean;
          enabled?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "power_ups_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      user_connections: {
        Row: {
          user_id: string;
          power_up_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          power_up_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          power_up_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_connections_power_up_id_fkey";
            columns: ["power_up_id"];
            isOneToOne: false;
            referencedRelation: "power_ups";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
