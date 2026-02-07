import { useState, useEffect } from 'react';
import { CollectionGalleryImage } from '../types';
import { getCollectionGalleryImages } from '../services/collectionGallery.service';

interface UseCollectionGalleryReturn {
  images: CollectionGalleryImage[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook pre načítanie galérie obrázkov kolekcie
 */
export function useCollectionGallery(
  galleryFolder?: string
): UseCollectionGalleryReturn {
  const [images, setImages] = useState<CollectionGalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    if (!galleryFolder) {
      setImages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetchedImages = await getCollectionGalleryImages(galleryFolder);
      setImages(fetchedImages);
    } catch (err) {
      console.error('Chyba pri načítaní galérie:', err);
      setError('Nepodarilo sa načítať galériu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [galleryFolder]);

  return {
    images,
    loading,
    error,
    refetch: fetchImages,
  };
}
