import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { FileType, QuoteFileInsert } from '../types/database.types';

// ===========================================
// STORAGE SERVICE
// ===========================================

const BUCKET_NAME = 'quote-files';

// Povolené MIME typy
const ALLOWED_MIME_TYPES: Record<string, FileType> = {
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/webp': 'image',
  'application/pdf': 'pdf',
  'application/acad': 'cad',
  'application/x-acad': 'cad',
  'application/autocad_dwg': 'cad',
  'image/vnd.dwg': 'cad',
  'application/dwg': 'cad',
  'application/dxf': 'cad',
  'image/vnd.dxf': 'cad',
};

// Max veľkosť súboru (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export interface UploadResult {
  success: boolean;
  uploadedFiles: string[];
  errors: string[];
}

/**
 * Nahrá súbory pre konkrétny dopyt
 */
export async function uploadQuoteFiles(
  quoteId: string,
  files: File[]
): Promise<UploadResult> {
  const result: UploadResult = {
    success: true,
    uploadedFiles: [],
    errors: [],
  };

  // Ak nie je Supabase nakonfigurovaný, simuluj úspech
  if (!isSupabaseConfigured()) {
    console.warn('Supabase nie je nakonfigurovaný - simulujem upload');
    result.uploadedFiles = files.map(f => f.name);
    return result;
  }

  for (const file of files) {
    // Validácia typu súboru
    const fileType = getFileType(file.type);
    if (!fileType) {
      result.errors.push(`Nepodporovaný typ súboru: ${file.name}`);
      continue;
    }

    // Validácia veľkosti
    if (file.size > MAX_FILE_SIZE) {
      result.errors.push(`Súbor ${file.name} je príliš veľký (max 50MB)`);
      continue;
    }

    try {
      // Vytvor unikátny názov súboru
      const timestamp = Date.now();
      const sanitizedName = sanitizeFileName(file.name);
      const filePath = `quotes/${quoteId}/${timestamp}-${sanitizedName}`;

      // Nahraj do Storage
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        result.errors.push(`Chyba pri nahrávaní ${file.name}`);
        continue;
      }

      // Vytvor záznam v databáze
      const fileRecord: QuoteFileInsert = {
        quote_id: quoteId,
        file_name: file.name,
        file_path: filePath,
        file_type: fileType,
        file_size: file.size,
      };

      const { error: dbError } = await supabase
        .from('quote_files')
        .insert(fileRecord);

      if (dbError) {
        console.error('DB error:', dbError);
        // Súbor je nahraný, ale záznam sa nevytvoril
        result.errors.push(`Chyba pri ukladaní záznamu pre ${file.name}`);
      }

      result.uploadedFiles.push(file.name);

    } catch (error) {
      console.error('Unexpected upload error:', error);
      result.errors.push(`Neočakávaná chyba pri ${file.name}`);
    }
  }

  result.success = result.errors.length === 0;
  return result;
}

/**
 * Získa URL pre stiahnutie súboru (vyžaduje autentifikáciu)
 */
export async function getFileUrl(filePath: string): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  const { data } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, 3600); // 1 hodina platnosti

  return data?.signedUrl || null;
}

/**
 * Získa všetky súbory pre dopyt
 */
export async function getQuoteFiles(quoteId: string) {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase
    .from('quote_files')
    .select('*')
    .eq('quote_id', quoteId);

  if (error) {
    console.error('Error fetching files:', error);
    return [];
  }

  return data || [];
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Určí typ súboru podľa MIME type
 */
function getFileType(mimeType: string): FileType | null {
  return ALLOWED_MIME_TYPES[mimeType] || null;
}

/**
 * Sanitizuje názov súboru pre bezpečné uloženie
 */
function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

/**
 * Kontrola či je súbor povolený
 */
export function isFileAllowed(file: File): boolean {
  return !!getFileType(file.type) && file.size <= MAX_FILE_SIZE;
}

/**
 * Získa čitateľnú veľkosť súboru
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

