/**
 * Utility for compressing base64 images to reduce backup size
 */

/**
 * Compress a base64 image by resizing and reducing quality
 * @param base64 - The base64 image string (with or without data URL prefix)
 * @param maxWidth - Maximum width in pixels (default: 200)
 * @param maxHeight - Maximum height in pixels (default: 200)
 * @param quality - JPEG quality 0-1 (default: 0.6)
 * @returns Compressed base64 string
 */
export async function compressBase64Image(
  base64: string,
  maxWidth: number = 200,
  maxHeight: number = 200,
  quality: number = 0.6
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Handle both formats: with and without data URL prefix
      const hasPrefix = base64.startsWith('data:');
      const imageData = hasPrefix ? base64 : `data:image/jpeg;base64,${base64}`;

      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Use better image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed JPEG
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };

      img.onerror = () => {
        // If image fails to load, return original (might not be a valid image)
        resolve(base64);
      };

      img.src = imageData;
    } catch (error) {
      // On any error, return original
      resolve(base64);
    }
  });
}

/**
 * Check if a string is a base64 image
 */
export function isBase64Image(str: string | undefined | null): boolean {
  if (!str) return false;
  return str.startsWith('data:image/') || 
         (str.length > 1000 && /^[A-Za-z0-9+/=]+$/.test(str.substring(0, 100)));
}

/**
 * Compress all photoUrl fields in an object recursively
 */
export async function compressPhotosInData<T>(data: T): Promise<T> {
  if (!data || typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    const results = await Promise.all(
      data.map(item => compressPhotosInData(item))
    );
    return results as T;
  }

  const result = { ...data } as Record<string, unknown>;

  for (const key of Object.keys(result)) {
    const value = result[key];

    // Compress photoUrl fields
    if (key === 'photoUrl' && typeof value === 'string' && isBase64Image(value)) {
      try {
        result[key] = await compressBase64Image(value);
        console.log(`[Compression] Compressed photo: ${value.length} -> ${(result[key] as string).length} chars`);
      } catch (error) {
        console.warn(`[Compression] Failed to compress photo:`, error);
      }
    } 
    // Recursively process nested objects and arrays
    else if (value && typeof value === 'object') {
      result[key] = await compressPhotosInData(value);
    }
  }

  return result as T;
}
