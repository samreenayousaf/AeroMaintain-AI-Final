export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      cached_supplier_searches: {
        Row: {
          id: string;
          query_hash: string;
          query: string;
          results: Json;
          source: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          query_hash: string;
          query: string;
          results: Json;
          source?: string;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          query_hash?: string;
          query?: string;
          results?: Json;
          source?: string;
          expires_at?: string;
          created_at?: string;
        };
      };
      procurement_history: {
        Row: {
          id: string;
          organization_id: string;
          action: string;
          entity_type: string;
          entity_id: string | null;
          details: Json;
          performed_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          details?: Json;
          performed_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          details?: Json;
          performed_by?: string;
          created_at?: string;
        };
      };
      digital_twin_states: {
        Row: {
          id: string;
          aircraft_id: string;
          component_id: string | null;
          state_data: Json;
          temperature: number | null;
          pressure: number | null;
          vibration: number | null;
          rpm: number | null;
          last_updated: string;
        };
        Insert: {
          id?: string;
          aircraft_id: string;
          component_id?: string | null;
          state_data?: Json;
          temperature?: number | null;
          pressure?: number | null;
          vibration?: number | null;
          rpm?: number | null;
          last_updated?: string;
        };
        Update: {
          id?: string;
          aircraft_id?: string;
          component_id?: string | null;
          state_data?: Json;
          temperature?: number | null;
          pressure?: number | null;
          vibration?: number | null;
          rpm?: number | null;
          last_updated?: string;
        };
      };
      embeddings: {
        Row: {
          id: string;
          entity_type: string;
          entity_id: string;
          content: string;
          embedding: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          entity_type: string;
          entity_id: string;
          content: string;
          embedding?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          entity_type?: string;
          entity_id?: string;
          content?: string;
          embedding?: string | null;
          metadata?: Json;
          created_at?: string;
        };
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          icao_code: string | null;
          logo_url: string | null;
          subscription_tier: string;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icao_code?: string | null;
          logo_url?: string | null;
          subscription_tier?: string;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icao_code?: string | null;
          logo_url?: string | null;
          subscription_tier?: string;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: string;
          organization_id: string | null;
          avatar_url: string | null;
          is_active: boolean;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string;
          role?: string;
          organization_id?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: string;
          organization_id?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      aircraft: {
        Row: {
          id: string;
          organization_id: string;
          tail_number: string;
          model: string;
          manufacturer: string;
          engine_type: string;
          serial_number: string | null;
          status: string;
          health_score: number;
          location: string | null;
          flight_hours: number;
          cycles: number;
          inspection_status: string;
          next_due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          tail_number: string;
          model: string;
          manufacturer: string;
          engine_type: string;
          serial_number?: string | null;
          status?: string;
          health_score?: number;
          location?: string | null;
          flight_hours?: number;
          cycles?: number;
          inspection_status?: string;
          next_due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          tail_number?: string;
          model?: string;
          manufacturer?: string;
          engine_type?: string;
          serial_number?: string | null;
          status?: string;
          health_score?: number;
          location?: string | null;
          flight_hours?: number;
          cycles?: number;
          inspection_status?: string;
          next_due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      aircraft_systems: {
        Row: {
          id: string;
          aircraft_id: string;
          parent_system_id: string | null;
          system_name: string;
          component_name: string;
          part_number: string | null;
          position: string | null;
          health_percent: number;
          risk_level: string;
          failure_probability: number;
          last_inspected_at: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          aircraft_id: string;
          parent_system_id?: string | null;
          system_name: string;
          component_name: string;
          part_number?: string | null;
          position?: string | null;
          health_percent?: number;
          risk_level?: string;
          failure_probability?: number;
          last_inspected_at?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          aircraft_id?: string;
          parent_system_id?: string | null;
          system_name?: string;
          component_name?: string;
          part_number?: string | null;
          position?: string | null;
          health_percent?: number;
          risk_level?: string;
          failure_probability?: number;
          last_inspected_at?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      inspections: {
        Row: {
          id: string;
          aircraft_id: string;
          mechanic_id: string;
          type: string;
          status: string;
          started_at: string;
          completed_at: string | null;
          summary: string | null;
          voice_session_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          aircraft_id: string;
          mechanic_id: string;
          type: string;
          status?: string;
          started_at?: string;
          completed_at?: string | null;
          summary?: string | null;
          voice_session_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          aircraft_id?: string;
          mechanic_id?: string;
          type?: string;
          status?: string;
          started_at?: string;
          completed_at?: string | null;
          summary?: string | null;
          voice_session_id?: string | null;
          created_at?: string;
        };
      };
      voice_sessions: {
        Row: {
          id: string;
          inspection_id: string | null;
          mechanic_id: string;
          audio_url: string | null;
          transcript: string | null;
          status: string;
          duration_seconds: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          inspection_id?: string | null;
          mechanic_id: string;
          audio_url?: string | null;
          transcript?: string | null;
          status?: string;
          duration_seconds?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          inspection_id?: string | null;
          mechanic_id?: string;
          audio_url?: string | null;
          transcript?: string | null;
          status?: string;
          duration_seconds?: number;
          created_at?: string;
        };
      };
      voice_transcripts: {
        Row: {
          id: string;
          session_id: string;
          text: string;
          confidence: number;
          is_final: boolean;
          sequence_number: number;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          text: string;
          confidence: number;
          is_final: boolean;
          sequence_number: number;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          text?: string;
          confidence?: number;
          is_final?: boolean;
          sequence_number?: number;
          metadata?: Json;
          created_at?: string;
        };
      };
      defects: {
        Row: {
          id: string;
          inspection_id: string | null;
          aircraft_id: string;
          component_id: string | null;
          description: string;
          entity_extracted: Json;
          severity: string;
          status: string;
          image_urls: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          inspection_id?: string | null;
          aircraft_id: string;
          component_id?: string | null;
          description: string;
          entity_extracted?: Json;
          severity: string;
          status?: string;
          image_urls?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          inspection_id?: string | null;
          aircraft_id?: string;
          component_id?: string | null;
          description?: string;
          entity_extracted?: Json;
          severity?: string;
          status?: string;
          image_urls?: string[];
          created_at?: string;
        };
      };
      ai_analyses: {
        Row: {
          id: string;
          defect_id: string;
          root_cause: string;
          confidence_score: number;
          severity: string;
          failure_probability: number;
          recommended_action: string;
          affected_systems: string[];
          predicted_next_failure: string | null;
          estimated_downtime_hours: number;
          model_used: string;
          analysis_raw: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          defect_id: string;
          root_cause: string;
          confidence_score?: number;
          severity: string;
          failure_probability?: number;
          recommended_action: string;
          affected_systems?: string[];
          predicted_next_failure?: string | null;
          estimated_downtime_hours?: number;
          model_used?: string;
          analysis_raw?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          defect_id?: string;
          root_cause?: string;
          confidence_score?: number;
          severity?: string;
          failure_probability?: number;
          recommended_action?: string;
          affected_systems?: string[];
          predicted_next_failure?: string | null;
          estimated_downtime_hours?: number;
          model_used?: string;
          analysis_raw?: Json;
          created_at?: string;
        };
      };
      work_orders: {
        Row: {
          id: string;
          defect_id: string;
          aircraft_id: string;
          assigned_to: string | null;
          status: string;
          priority: string;
          due_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          defect_id: string;
          aircraft_id: string;
          assigned_to?: string | null;
          status?: string;
          priority?: string;
          due_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          defect_id?: string;
          aircraft_id?: string;
          assigned_to?: string | null;
          status?: string;
          priority?: string;
          due_date?: string | null;
          created_at?: string;
        };
      };
      maintenance_logs: {
        Row: {
          id: string;
          aircraft_id: string;
          work_order_id: string | null;
          component_id: string | null;
          mechanic_id: string;
          description: string;
          hours_spent: number;
          completed_at: string;
        };
        Insert: {
          id?: string;
          aircraft_id: string;
          work_order_id?: string | null;
          component_id?: string | null;
          mechanic_id: string;
          description: string;
          hours_spent?: number;
          completed_at?: string;
        };
        Update: {
          id?: string;
          aircraft_id?: string;
          work_order_id?: string | null;
          component_id?: string | null;
          mechanic_id?: string;
          description?: string;
          hours_spent?: number;
          completed_at?: string;
        };
      };
      suppliers: {
        Row: {
          id: string;
          name: string;
          contact_info: Json;
          rating: number;
          certifications: string[];
          locations: string[];
          bright_data_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          contact_info?: Json;
          rating?: number;
          certifications?: string[];
          locations?: string[];
          bright_data_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          contact_info?: Json;
          rating?: number;
          certifications?: string[];
          locations?: string[];
          bright_data_id?: string | null;
          created_at?: string;
        };
      };
      parts: {
        Row: {
          id: string;
          part_number: string;
          name: string;
          category: string;
          aircraft_model_compatibility: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          part_number: string;
          name: string;
          category?: string;
          aircraft_model_compatibility?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          part_number?: string;
          name?: string;
          category?: string;
          aircraft_model_compatibility?: string[];
          created_at?: string;
        };
      };
      supplier_parts: {
        Row: {
          id: string;
          supplier_id: string;
          part_id: string;
          price: number;
          currency: string;
          delivery_time_days: number;
          stock_qty: number;
          moq: number;
          last_updated: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          part_id: string;
          price?: number;
          currency?: string;
          delivery_time_days?: number;
          stock_qty?: number;
          moq?: number;
          last_updated?: string;
        };
        Update: {
          id?: string;
          supplier_id?: string;
          part_id?: string;
          price?: number;
          currency?: string;
          delivery_time_days?: number;
          stock_qty?: number;
          moq?: number;
          last_updated?: string;
        };
      };
      purchase_orders: {
        Row: {
          id: string;
          work_order_id: string | null;
          supplier_id: string;
          part_id: string;
          quantity: number;
          unit_price: number;
          total: number;
          status: string;
          requested_by: string;
          approved_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          work_order_id?: string | null;
          supplier_id: string;
          part_id: string;
          quantity?: number;
          unit_price?: number;
          total?: number;
          status?: string;
          requested_by: string;
          approved_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          work_order_id?: string | null;
          supplier_id?: string;
          part_id?: string;
          quantity?: number;
          unit_price?: number;
          total?: number;
          status?: string;
          requested_by?: string;
          approved_by?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          data: Json;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type?: string;
          title: string;
          message?: string;
          data?: Json;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          data?: Json;
          read_at?: string | null;
          created_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          type: string;
          title: string;
          data: Json;
          generated_by: string;
          date_range: Json | null;
          export_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          title: string;
          data?: Json;
          generated_by: string;
          date_range?: Json | null;
          export_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          title?: string;
          data?: Json;
          generated_by?: string;
          date_range?: Json | null;
          export_url?: string | null;
          created_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          entity_type: string;
          entity_id: string | null;
          changes: Json;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          changes?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          changes?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}