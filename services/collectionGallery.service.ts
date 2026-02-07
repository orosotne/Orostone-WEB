import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { CollectionGalleryImage } from '../types';

// ===========================================
// COLLECTION GALLERY SERVICE
// ===========================================

const BUCKET_NAME = 'collection-galleries';

/**
 * Načíta všetky obrázky z priečinka galérie kolekcie
 */
export async function getCollectionGalleryImages(
  galleryFolder: string
): Promise<CollectionGalleryImage[]> {
  // Ak nie je Supabase nakonfigurovaný, vráť prázdne pole
  if (!isSupabaseConfigured()) {
    console.warn('Supabase nie je nakonfigurovaný');
    return [];
  }

  try {
    // Získaj zoznam súborov z priečinka
    const { data: files, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(galleryFolder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) {
      console.error('Chyba pri načítaní galérie:', error);
      return [];
    }

    if (!files || files.length === 0) {
      return [];
    }

    // Mapuj súbory na CollectionGalleryImage objekty
    const images: CollectionGalleryImage[] = files
      .filter(file => {
        // Filtruj iba obrázky (nie priečinky)
        return !file.id && file.name.match(/\.(jpg|jpeg|png|webp)$/i);
      })
      .map(file => {
        const filePath = `${galleryFolder}/${file.name}`;
        const publicUrl = getPublicUrl(filePath);
        const category = parseImageCategory(file.name);

        return {
          name: file.name,
          url: filePath,
          publicUrl,
          category,
        };
      });

    return images;
  } catch (error) {
    console.error('Neočakávaná chyba pri načítaní galérie:', error);
    return [];
  }
}

/**
 * Získa verejnú URL pre obrázok
 */
export function getPublicUrl(filePath: string): string {
  if (!isSupabaseConfigured()) {
    return '';
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Parsuje kategóriu z názvu súboru
 * Formát: {collection}-{kategória}-{popis}.jpg
 * Príklad: unita-inspiration-01.jpg → 'inspiration'
 */
export function parseImageCategory(
  filename: string
): 'inspiration' | 'realization' | 'detail' | undefined {
  const parts = filename.toLowerCase().split('-');

  if (parts.length < 2) {
    return undefined;
  }

  // Druhá časť je kategória
  const categoryPart = parts[1];

  if (categoryPart.includes('inspiration')) {
    return 'inspiration';
  }
  if (categoryPart.includes('realization')) {
    return 'realization';
  }
  if (categoryPart.includes('detail')) {
    return 'detail';
  }

  return undefined;
}

/**
 * Overí, či galéria existuje (má nejaké súbory)
 */
export async function galleryExists(galleryFolder: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    const { data: files, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(galleryFolder, {
        limit: 1,
      });

    if (error) {
      return false;
    }

    return files && files.length > 0;
  } catch {
    return false;
  }
}
