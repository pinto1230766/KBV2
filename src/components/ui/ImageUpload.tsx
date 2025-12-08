import React, { useRef, useState, useId } from 'react';
import { Camera, Trash2, User } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (imageUrl: string | undefined) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Photo',
  size = 'md',
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const id = useId();

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5 Mo');
      return;
    }

    setIsLoading(true);

    try {
      // Redimensionner et compresser l'image
      const resizedImage = await resizeImage(file, 300, 300);
      onChange(resizedImage);
    } catch (error) {
      console.error('Erreur lors du traitement de l\'image:', error);
      alert('Erreur lors du traitement de l\'image');
    } finally {
      setIsLoading(false);
    }
  };

  const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          // Calculer les nouvelles dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Impossible de créer le contexte canvas'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Convertir en base64 avec compression JPEG
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Erreur de chargement de l\'image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
      reader.readAsDataURL(file);
    });
  };

  const handleRemove = () => {
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <div
            onClick={handleClick}
            className={`
              ${sizeClasses[size]}
              rounded-full overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600
              hover:border-primary-500 dark:hover:border-primary-400
              transition-colors cursor-pointer
              flex items-center justify-center
              bg-gray-100 dark:bg-gray-700
              ${isLoading ? 'opacity-50' : ''}
            `}
          >
            {value ? (
              <img
                src={value}
                alt="Photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className={`${iconSizes[size]} text-gray-400 dark:text-gray-500`} />
            )}
          </div>
          
          {/* Badge caméra */}
          <button
            type="button"
            onClick={handleClick}
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center shadow-lg transition-colors"
            title="Changer la photo"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Supprimer la photo"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}

        <input
          id={id}
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          aria-label={label}
        />
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Formats acceptés : JPG, PNG, GIF. Max 5 Mo.
      </p>
    </div>
  );
};
