// ===========================================
// OROSTONE DATABASE TYPES
// ===========================================
// Tieto typy korešpondujú so schémou v supabase/schema.sql

export type CustomerStatus = 'lead' | 'customer' | 'vip';
export type QuoteStatus = 'new' | 'in_progress' | 'quoted' | 'won' | 'lost';
export type FileType = 'image' | 'pdf' | 'cad';

// ===========================================
// TABLE TYPES
// ===========================================

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  city: string | null;
  status: CustomerStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  customer_id: string;
  project_type: string;
  item_needed: string | null;
  dimensions: string | null;
  decor: string | null;
  status: QuoteStatus;
  admin_notes: string | null;
  quoted_price: number | null;
  created_at: string;
  updated_at: string;
}

export interface QuoteFile {
  id: string;
  quote_id: string;
  file_name: string;
  file_path: string;
  file_type: FileType;
  file_size: number | null;
  created_at: string;
}

// ===========================================
// INSERT TYPES (bez auto-generovaných polí)
// ===========================================

export interface CustomerInsert {
  email: string;
  name: string;
  phone?: string;
  city?: string;
  status?: CustomerStatus;
  notes?: string;
}

export interface QuoteInsert {
  customer_id: string;
  project_type: string;
  item_needed?: string;
  dimensions?: string;
  decor?: string;
  status?: QuoteStatus;
  admin_notes?: string;
  quoted_price?: number;
}

export interface QuoteFileInsert {
  quote_id: string;
  file_name: string;
  file_path: string;
  file_type: FileType;
  file_size?: number;
}

// ===========================================
// SUPABASE DATABASE TYPE
// ===========================================

export interface Database {
  // Required by @supabase/supabase-js v2.90+ for proper type inference on
  // .from(table).insert(...) / .update(...) — without this, table types
  // collapse to `never` and trigger TS2769 No overload matches this call.
  __InternalSupabase: {
    PostgrestVersion: '12';
  };
  public: {
    Tables: {
      customers: {
        Row: Customer;
        Insert: CustomerInsert;
        Update: Partial<CustomerInsert>;
        Relationships: [];
      };
      quotes: {
        Row: Quote;
        Insert: QuoteInsert;
        Update: Partial<QuoteInsert>;
        Relationships: [
          {
            foreignKeyName: 'quotes_customer_id_fkey';
            columns: ['customer_id'];
            isOneToOne: false;
            referencedRelation: 'customers';
            referencedColumns: ['id'];
          },
        ];
      };
      quote_files: {
        Row: QuoteFile;
        Insert: QuoteFileInsert;
        Update: Partial<QuoteFileInsert>;
        Relationships: [
          {
            foreignKeyName: 'quote_files_quote_id_fkey';
            columns: ['quote_id'];
            isOneToOne: false;
            referencedRelation: 'quotes';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      customer_status: CustomerStatus;
      quote_status: QuoteStatus;
      file_type: FileType;
    };
    CompositeTypes: Record<string, never>;
  };
}

// ===========================================
// FORM DATA TYPE (pre QuoteWizard)
// ===========================================

export interface QuoteFormData {
  name: string;
  phone: string;
  email: string;
  description: string;
  files: File[];
}

