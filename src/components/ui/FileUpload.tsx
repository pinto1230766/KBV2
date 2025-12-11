import React, { useCallback, useState } from 'react';
import { validateUploadedFile } from '@/utils/securityHeaders';
import { useErrorNotifications } from '@/hooks/useErrorNotifications';
import { Button } from '@/components/ui/Button';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  onFileRejected?: (reason: string) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // en bytes
  className?: string;
  disabled?: boolean;
  showPreview?: boolean;
}

interface FileWithValidation {
  file: File;
  isValid: boolean;
  error?: string;
  preview?: string;
}

export function FileUpload({
  onFilesSelected,
  onFileRejected,
  accept = "image/*,.pdf",
  multiple = false,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  className,
  disabled = false,
  showPreview = true
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithValidation[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { showError, showSuccess } = useErrorNotifications();

  // Configuration des types de fichiers autorisés
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const allowedExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.webp',
    '.pdf', '.txt', '.doc', '.docx'
  ];

  const validateFile = useCallback((file: File): FileWithValidation => {
    const validation = validateUploadedFile(file, {
      maxSize,
      allowedTypes,
      allowedExtensions
    });

    const result: FileWithValidation = {
      file,
      isValid: validation.valid,
      error: validation.error
    };

    // Créer un aperçu pour les images
    if (validation.valid && file.type.startsWith('image/') && showPreview) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFiles(prev => prev.map(f => 
          f.file === file ? { ...f, preview: e.target?.result as string } : f
        ));
      };
      reader.readAsDataURL(file);
    }

    return result;
  }, [maxSize, showPreview]);

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles = Array.from(fileList);
    
    // Vérifier le nombre maximum de fichiers
    if (files.length + newFiles.length > maxFiles) {
      showError(
        'Trop de fichiers',
        `Maximum ${maxFiles} fichiers autorisés (${files.length} déjà sélectionnés)`
      );
      return;
    }

    // Valider chaque fichier
    const validatedFiles = newFiles.map(validateFile);
    const validFiles = validatedFiles.filter(f => f.isValid);
    const invalidFiles = validatedFiles.filter(f => !f.isValid);

    // Traiter les fichiers valides
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      onFilesSelected(validFiles.map(f => f.file));
      
      if (validFiles.length === newFiles.length) {
        showSuccess('Succès', `${validFiles.length} fichier(s) ajouté(s) avec succès`);
      } else {
        showError(
          'Fichiers partiellement acceptés',
          `${validFiles.length}/${newFiles.length} fichiers acceptés`
        );
      }
    }

    // Traiter les fichiers invalides
    if (invalidFiles.length > 0) {
      invalidFiles.forEach(f => {
        if (f.error) {
          showError('Fichier refusé', `${f.file.name}: ${f.error}`);
          onFileRejected?.(f.error);
        }
      });
    }
  }, [files.length, maxFiles, validateFile, onFilesSelected, onFileRejected, showError, showSuccess]);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const openFileDialog = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = multiple;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      handleFiles(target.files);
    };
    input.click();
  }, [accept, multiple, handleFiles]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Zone de drop */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          isDragging 
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950" 
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!disabled ? openFileDialog : undefined}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Formats acceptés: {allowedExtensions.join(', ')} • Taille max: {Math.round(maxSize / (1024 * 1024))}MB
        </p>
        {multiple && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Maximum {maxFiles} fichiers
          </p>
        )}
      </div>

      {/* Liste des fichiers */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Fichiers sélectionnés ({files.length})
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((fileWithValidation, index) => (
              <div
                key={`${fileWithValidation.file.name}-${index}`}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg border",
                  fileWithValidation.isValid
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                    : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                )}
              >
                {/* Aperçu de l'image */}
                {fileWithValidation.preview && (
                  <img
                    src={fileWithValidation.preview}
                    alt={fileWithValidation.file.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                )}
                
                {/* Icône de fichier */}
                {!fileWithValidation.preview && (
                  <File className="w-10 h-10 text-gray-400" />
                )}

                {/* Informations du fichier */}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium truncate",
                    fileWithValidation.isValid
                      ? "text-green-900 dark:text-green-100"
                      : "text-red-900 dark:text-red-100"
                  )}>
                    {fileWithValidation.file.name}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{Math.round(fileWithValidation.file.size / 1024)} KB</span>
                    <span>•</span>
                    <span>{fileWithValidation.file.type}</span>
                  </div>
                  {fileWithValidation.error && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {fileWithValidation.error}
                    </p>
                  )}
                </div>

                {/* Statut */}
                <div className="flex-shrink-0">
                  {fileWithValidation.isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>

                {/* Bouton de suppression */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Supprimer le fichier"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Button
          onClick={openFileDialog}
          disabled={disabled}
          variant="outline"
          leftIcon={<Upload className="w-4 h-4" />}
        >
          {multiple ? 'Ajouter des fichiers' : 'Sélectionner un fichier'}
        </Button>

        {files.length > 0 && (
          <Button
            onClick={() => {
              const validFiles = files.filter(f => f.isValid).map(f => f.file);
              onFilesSelected(validFiles);
              showSuccess('Succès', `${validFiles.length} fichier(s) prêt(s) pour l'upload`);
            }}
            disabled={disabled || files.every(f => !f.isValid)}
            variant="primary"
          >
            Confirmer ({files.filter(f => f.isValid).length})
          </Button>
        )}
      </div>
    </div>
  );
}

// Composant spécialisé pour les images
export function ImageUpload(props: Omit<FileUploadProps, 'accept'>) {
  return (
    <FileUpload
      {...props}
      accept="image/*"
      showPreview={true}
    />
  );
}

// Composant spécialisé pour les documents
export function DocumentUpload(props: Omit<FileUploadProps, 'accept'>) {
  return (
    <FileUpload
      {...props}
      accept=".pdf,.doc,.docx,.txt"
      showPreview={false}
    />
  );
}

export default FileUpload;
