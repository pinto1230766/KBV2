import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

export interface SaveFileOptions {
  filename: string;
  data: string;
  mimeType?: string;
}

export interface SaveFileResult {
  success: boolean;
  path?: string;
  error?: string;
}

class FileSystemService {
  private static instance: FileSystemService;
  private readonly KBV_FOLDER = 'KBV';

  static getInstance(): FileSystemService {
    if (!FileSystemService.instance) {
      FileSystemService.instance = new FileSystemService();
    }
    return FileSystemService.instance;
  }

  /**
   * Sauvegarde un fichier dans Documents/KBV/
   */
  async saveToDocuments(options: SaveFileOptions): Promise<SaveFileResult> {
    try {
      // Vérifier si on est sur mobile (Capacitor)
      const isNative = this.isNativePlatform();

      if (isNative) {
        return await this.saveNative(options);
      } else {
        return await this.saveWeb(options);
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Sauvegarde native (Android/iOS) dans Documents/KBV/
   */
  private async saveNative(options: SaveFileOptions): Promise<SaveFileResult> {
    try {
      // Créer le dossier KBV s'il n'existe pas
      await this.ensureKBVFolderExists();

      // Sauvegarder le fichier
      const result = await Filesystem.writeFile({
        path: `${this.KBV_FOLDER}/${options.filename}`,
        data: options.data,
        directory: Directory.Documents,
        encoding: 'utf8',
      });

      return {
        success: true,
        path: result.uri,
      };
    } catch (error) {
      console.error('Erreur sauvegarde native:', error);
      throw error;
    }
  }

  /**
   * Sauvegarde web (navigateur)
   */
  private async saveWeb(options: SaveFileOptions): Promise<SaveFileResult> {
    try {
      const blob = new Blob([options.data], { 
        type: options.mimeType || 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = options.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return {
        success: true,
        path: `Téléchargements/${options.filename}`,
      };
    } catch (error) {
      console.error('Erreur sauvegarde web:', error);
      throw error;
    }
  }

  /**
   * Créer le dossier KBV dans Documents s'il n'existe pas
   */
  private async ensureKBVFolderExists(): Promise<void> {
    try {
      await Filesystem.mkdir({
        path: this.KBV_FOLDER,
        directory: Directory.Documents,
        recursive: true,
      });
    } catch (error: any) {
      // Ignorer l'erreur si le dossier existe déjà
      if (error?.message?.includes('exists')) {
        return;
      }
      throw error;
    }
  }

  /**
   * Lire un fichier depuis Documents/KBV/
   */
  async readFromDocuments(filename: string): Promise<string> {
    try {
      const result = await Filesystem.readFile({
        path: `${this.KBV_FOLDER}/${filename}`,
        directory: Directory.Documents,
        encoding: 'utf8',
      });

      return result.data as string;
    } catch (error) {
      console.error('Erreur lecture fichier:', error);
      throw error;
    }
  }

  /**
   * Lister les fichiers dans Documents/KBV/
   */
  async listKBVFiles(): Promise<string[]> {
    try {
      const result = await Filesystem.readdir({
        path: this.KBV_FOLDER,
        directory: Directory.Documents,
      });

      return result.files.map((f: string | { name: string }) => typeof f === 'string' ? f : f.name);
    } catch (error: any) {
      // Si le dossier n'existe pas, retourner un tableau vide
      if (error?.message?.includes('does not exist')) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Supprimer un fichier de Documents/KBV/
   */
  async deleteFromDocuments(filename: string): Promise<void> {
    try {
      await Filesystem.deleteFile({
        path: `${this.KBV_FOLDER}/${filename}`,
        directory: Directory.Documents,
      });
    } catch (error) {
      console.error('Erreur suppression fichier:', error);
      throw error;
    }
  }

  /**
   * Obtenir le chemin complet du dossier KBV
   */
  async getKBVFolderPath(): Promise<string> {
    try {
      const result = await Filesystem.getUri({
        path: this.KBV_FOLDER,
        directory: Directory.Documents,
      });
      return result.uri;
    } catch (error) {
      return 'Documents/KBV';
    }
  }

  /**
   * Partager un fichier (utile pour Android)
   */
  async shareFile(filename: string, title: string = 'Partager la sauvegarde'): Promise<void> {
    try {
      const canShare = await Share.canShare();
      if (!canShare.value) {
        throw new Error('Le partage n\'est pas disponible');
      }

      const fileUri = await Filesystem.getUri({
        path: `${this.KBV_FOLDER}/${filename}`,
        directory: Directory.Documents,
      });

      await Share.share({
        title,
        text: `Sauvegarde KBV: ${filename}`,
        url: fileUri.uri,
        dialogTitle: title,
      });
    } catch (error) {
      console.error('Erreur partage fichier:', error);
      throw error;
    }
  }

  /**
   * Vérifier si on est sur une plateforme native
   */
  private isNativePlatform(): boolean {
    return (window as any).Capacitor?.isNativePlatform?.() || false;
  }
}

export const fileSystemService = FileSystemService.getInstance();
