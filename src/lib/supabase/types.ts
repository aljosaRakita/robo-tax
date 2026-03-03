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
          provider: string | null;
          integration_status: string;
          last_synced_at: string | null;
          metadata: Record<string, unknown>;
        };
        Insert: {
          user_id: string;
          power_up_id: string;
          created_at?: string;
          provider?: string | null;
          integration_status?: string;
          last_synced_at?: string | null;
          metadata?: Record<string, unknown>;
        };
        Update: {
          user_id?: string;
          power_up_id?: string;
          created_at?: string;
          provider?: string | null;
          integration_status?: string;
          last_synced_at?: string | null;
          metadata?: Record<string, unknown>;
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
      tax_strategies: {
        Row: {
          id: string;
          title: string;
          workflow: string;
          priority: number;
        };
        Insert: {
          id: string;
          title: string;
          workflow: string;
          priority: number;
        };
        Update: {
          id?: string;
          title?: string;
          workflow?: string;
          priority?: number;
        };
        Relationships: [];
      };
      integration_tokens: {
        Row: {
          id: string;
          user_id: string;
          provider: string;
          access_token_enc: string | null;
          refresh_token_enc: string | null;
          token_expires_at: string | null;
          plaid_item_id: string | null;
          plaid_access_token_enc: string | null;
          provider_user_id: string | null;
          scopes: string[];
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: string;
          access_token_enc?: string | null;
          refresh_token_enc?: string | null;
          token_expires_at?: string | null;
          plaid_item_id?: string | null;
          plaid_access_token_enc?: string | null;
          provider_user_id?: string | null;
          scopes?: string[];
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          provider?: string;
          access_token_enc?: string | null;
          refresh_token_enc?: string | null;
          token_expires_at?: string | null;
          plaid_item_id?: string | null;
          plaid_access_token_enc?: string | null;
          provider_user_id?: string | null;
          scopes?: string[];
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      integration_data: {
        Row: {
          id: string;
          user_id: string;
          provider: string;
          data_type: string;
          data: Record<string, unknown>;
          fetched_at: string;
          sync_cursor: string | null;
          is_stale: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: string;
          data_type: string;
          data?: Record<string, unknown>;
          fetched_at?: string;
          sync_cursor?: string | null;
          is_stale?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          provider?: string;
          data_type?: string;
          data?: Record<string, unknown>;
          fetched_at?: string;
          sync_cursor?: string | null;
          is_stale?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      strategy_triggers: {
        Row: {
          id: string;
          strategy_id: string;
          provider: string;
          data_type: string;
          condition: Record<string, unknown>;
          savings_formula: string;
          savings_floor: number | null;
          savings_ceiling: number | null;
          requires_all: string[];
          description: string | null;
          enabled: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          strategy_id: string;
          provider: string;
          data_type: string;
          condition?: Record<string, unknown>;
          savings_formula: string;
          savings_floor?: number | null;
          savings_ceiling?: number | null;
          requires_all?: string[];
          description?: string | null;
          enabled?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          strategy_id?: string;
          provider?: string;
          data_type?: string;
          condition?: Record<string, unknown>;
          savings_formula?: string;
          savings_floor?: number | null;
          savings_ceiling?: number | null;
          requires_all?: string[];
          description?: string | null;
          enabled?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "strategy_triggers_strategy_id_fkey";
            columns: ["strategy_id"];
            isOneToOne: false;
            referencedRelation: "tax_strategies";
            referencedColumns: ["id"];
          },
        ];
      };
      user_strategy_matches: {
        Row: {
          id: string;
          user_id: string;
          strategy_id: string;
          trigger_id: string;
          estimated_low: number;
          estimated_base: number;
          estimated_high: number;
          confidence: number;
          evidence: Record<string, unknown>;
          reasoning: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          strategy_id: string;
          trigger_id: string;
          estimated_low?: number;
          estimated_base?: number;
          estimated_high?: number;
          confidence?: number;
          evidence?: Record<string, unknown>;
          reasoning?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          strategy_id?: string;
          trigger_id?: string;
          estimated_low?: number;
          estimated_base?: number;
          estimated_high?: number;
          confidence?: number;
          evidence?: Record<string, unknown>;
          reasoning?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_strategy_matches_strategy_id_fkey";
            columns: ["strategy_id"];
            isOneToOne: false;
            referencedRelation: "tax_strategies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_strategy_matches_trigger_id_fkey";
            columns: ["trigger_id"];
            isOneToOne: false;
            referencedRelation: "strategy_triggers";
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
