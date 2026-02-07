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
  public: {
    Tables: {
      customers: {
        Row: Customer;
        Insert: CustomerInsert;
        Update: Partial<CustomerInsert>;
      };
      quotes: {
        Row: Quote;
        Insert: QuoteInsert;
        Update: Partial<QuoteInsert>;
      };
      quote_files: {
        Row: QuoteFile;
        Insert: QuoteFileInsert;
        Update: Partial<QuoteFileInsert>;
      };
    };
    Enums: {
      customer_status: CustomerStatus;
      quote_status: QuoteStatus;
      file_type: FileType;
    };
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

