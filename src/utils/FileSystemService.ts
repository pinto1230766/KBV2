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
  private readonly DEFAULT_DIRECTORY = Directory.Documents;

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
    console.log('[DEBUG] saveToDocuments called with:', {
      filename: options.filename,
      dataLength: options.data.length,
      mimeType: options.mimeType
    });
    try {
      // Vérifier si on est sur mobile (Capacitor)
      const isNative = this.isNativePlatform();
      console.log('[DEBUG] Platform detection - isNative:', isNative);
      console.log('[DEBUG] Capacitor object:', (window as any).Capacitor);
      console.log('[DEBUG] Platform info:', (window as any).Capacitor?.getPlatform?.());

      if (isNative) {
        console.log('[DEBUG] Using native save path');
        return await this.saveNative(options);
      } else {
        console.log('[DEBUG] Using web save path');
        return await this.saveWeb(options);
      }
    } catch (error) {
      console.error('[DEBUG] Erreur sauvegarde dans saveToDocuments:', error);
      console.error('[DEBUG] Error type:', typeof error);
      console.error('[DEBUG] Error constructor:', error?.constructor?.name);
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
    console.log('[DEBUG] Starting native save for:', options.filename);
    try {
      // Vérifier et demander les permissions si nécessaire
      console.log('[DEBUG] Checking and requesting filesystem permissions...');
      try {
        const permResult = await Filesystem.checkPermissions();
        console.log('[DEBUG] Filesystem permissions:', permResult);

        // Si les permissions ne sont pas accordées, les demander
        if (!permResult.publicStorage) {
          console.log('[DEBUG] Requesting filesystem permissions...');
          const requestResult = await Filesystem.requestPermissions();
          console.log('[DEBUG] Permission request result:', requestResult);

          if (!requestResult.publicStorage) {
            console.log('[DEBUG] Permissions refused, will try fallback methods');
            // Ne pas throw ici, continuer avec les fallbacks
          }
        }
      } catch (permError) {
        console.error('[DEBUG] Permission error:', permError);
        console.log('[DEBUG] Continuing with fallback methods despite permission error');
        // Ne pas throw ici, continuer avec les fallbacks
      }

      // Essayer plusieurs stratégies de sauvegarde (priorité aux répertoires accessibles)
      console.log('[DEBUG] Testing multiple save strategies...');
      const saveStrategies = [
        {
          name: 'External/KBV',
          options: {
            path: `${this.KBV_FOLDER}/${options.filename}`,
            data: options.data,
            directory: Directory.External,
            encoding: 'utf8' as any,
          },
          prepare: async () => {
            try {
              console.log('[DEBUG] Preparing External/KBV strategy - creating folder...');
              await this.ensureKBVFolderInExternal();
              console.log('[DEBUG] KBV folder ready in External');
            } catch (e) {
              console.log('[DEBUG] Could not create KBV folder in External, trying without it. Error:', e);
            }
          }
        },
        {
          name: 'External direct',
          options: {
            path: options.filename,
            data: options.data,
            directory: Directory.External,
            encoding: 'utf8' as any,
          },
          prepare: async () => {
            console.log('[DEBUG] Using External direct - no preparation needed');
          }
        },
        {
          name: 'Documents/KBV',
          options: {
            path: `${this.KBV_FOLDER}/${options.filename}`,
            data: options.data,
            directory: this.DEFAULT_DIRECTORY,
            encoding: 'utf8' as any,
          },
          prepare: async () => {
            try {
              console.log('[DEBUG] Preparing Documents/KBV strategy - creating folder...');
              await this.ensureKBVFolderExists();
              console.log('[DEBUG] KBV folder ready for Documents/KBV strategy');
            } catch (e) {
              console.log('[DEBUG] Could not create KBV folder, trying without it. Error:', e);
            }
          }
        },
        {
          name: 'Documents direct',
          options: {
            path: options.filename,
            data: options.data,
            directory: this.DEFAULT_DIRECTORY,
            encoding: 'utf8' as any,
          },
          prepare: async () => {
            console.log('[DEBUG] Using Documents direct - no preparation needed');
          }
        },
        {
          name: 'ExternalStorage/KBV',
          options: {
            path: `${this.KBV_FOLDER}/${options.filename}`,
            data: options.data,
            directory: Directory.ExternalStorage,
            encoding: 'utf8' as any,
          },
          prepare: async () => {
            console.log('[DEBUG] Using ExternalStorage/KBV - no preparation needed');
          }
        },
        {
          name: 'ExternalStorage direct',
          options: {
            path: options.filename,
            data: options.data,
            directory: Directory.ExternalStorage,
            encoding: 'utf8' as any,
          },
          prepare: async () => {
            console.log('[DEBUG] Using ExternalStorage direct - no preparation needed');
          }
        }
      ];

      for (const strategy of saveStrategies) {
        try {
          console.log(`[DEBUG] Attempting ${strategy.name} strategy...`);
          await strategy.prepare();

          console.log(`[DEBUG] ${strategy.name} - Write options:`, {
            path: strategy.options.path,
            directory: strategy.options.directory,
            dataLength: strategy.options.data.length,
            encoding: strategy.options.encoding
          });
          const result = await Filesystem.writeFile(strategy.options);
          console.log(`[DEBUG] ${strategy.name} - File written successfully, URI:`, result.uri);

          return {
            success: true,
            path: result.uri,
          };
        } catch (strategyError: any) {
          console.log(`[DEBUG] ${strategy.name} strategy failed:`, strategyError);
          console.log(`[DEBUG] ${strategy.name} error details:`, {
            message: strategyError?.message,
            code: strategyError?.code,
            name: strategyError?.name,
            stack: strategyError?.stack
          });
          // Check for specific error types
          if (strategyError?.message?.includes('permission') || strategyError?.code === 'EACCES') {
            console.error(`[DEBUG] ${strategy.name} - PERMISSION DENIED`);
          } else if (strategyError?.message?.includes('storage') || strategyError?.message?.includes('disk')) {
            console.error(`[DEBUG] ${strategy.name} - STORAGE ERROR`);
          }
          // Continue to next strategy
        }
      }

      // Si toutes les stratégies ont échoué, throw l'erreur
      throw new Error('Toutes les méthodes de sauvegarde ont échoué');

    } catch (error) {
      console.error('[DEBUG] Erreur sauvegarde native:', error);
      console.error('[DEBUG] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        filename: options.filename,
        dataLength: options.data.length
      });

      // Retourner une erreur plus descriptive
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue lors de la sauvegarde',
      };
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
      console.log('[DEBUG] Creating KBV directory in Documents...');
      const mkdirOptions = {
        path: this.KBV_FOLDER,
        directory: this.DEFAULT_DIRECTORY,
        recursive: true,
      };
      console.log('[DEBUG] mkdir options:', mkdirOptions);
      await Filesystem.mkdir(mkdirOptions);
      console.log('[DEBUG] KBV directory created successfully in Documents');
    } catch (error: any) {
      console.log('[DEBUG] KBV directory creation error:', error);
      console.log('[DEBUG] Error details:', {
        message: error?.message,
        code: error?.code,
        name: error?.name,
        stack: error?.stack
      });
      // Check if it's a permission-related error
      if (error?.message?.includes('permission') || error?.message?.includes('access') || error?.code === 'EACCES') {
        console.error('[DEBUG] PERMISSION ERROR: Cannot create KBV folder due to permissions');
        throw new Error('Permissions insuffisantes pour créer le dossier KBV. Vérifiez les permissions de stockage.');
      }
      // Ignorer l'erreur si le dossier existe déjà
      if (error?.message?.includes('exists') || error?.message?.includes('already exists')) {
        console.log('[DEBUG] KBV directory already exists');
        return;
      }
      throw error;
    }
  }

  /**
   * Créer le dossier KBV dans External s'il n'existe pas
   */
  private async ensureKBVFolderInExternal(): Promise<void> {
    try {
      console.log('[DEBUG] Creating KBV directory in External...');
      const mkdirOptions = {
        path: this.KBV_FOLDER,
        directory: Directory.External,
        recursive: true,
      };
      console.log('[DEBUG] mkdir options for External:', mkdirOptions);
      await Filesystem.mkdir(mkdirOptions);
      console.log('[DEBUG] KBV directory created successfully in External');
    } catch (error: any) {
      console.log('[DEBUG] KBV directory creation error in External:', error);
      console.log('[DEBUG] Error details:', {
        message: error?.message,
        code: error?.code,
        name: error?.name,
        stack: error?.stack
      });
      // Check if it's a permission-related error
      if (error?.message?.includes('permission') || error?.message?.includes('access') || error?.code === 'EACCES') {
        console.error('[DEBUG] PERMISSION ERROR: Cannot create KBV folder in External due to permissions');
        throw new Error('Permissions insuffisantes pour créer le dossier KBV. Vérifiez les permissions de stockage.');
      }
      // Ignorer l'erreur si le dossier existe déjà
      if (error?.message?.includes('exists') || error?.message?.includes('already exists')) {
        console.log('[DEBUG] KBV directory already exists in External');
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
        directory: this.DEFAULT_DIRECTORY,
        encoding: 'utf8' as any,
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
        directory: this.DEFAULT_DIRECTORY,
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
        directory: this.DEFAULT_DIRECTORY,
      });
    } catch (error) {
      console.error('Erreur suppression fichier:', error);
      throw error;
    }
  }

  /**
   * Obtenir le chemin complet du dossier KBV dans Documents
   */
  async getKBVFolderPath(): Promise<string> {
    try {
      const result = await Filesystem.getUri({
        path: this.KBV_FOLDER,
        directory: this.DEFAULT_DIRECTORY,
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
        directory: this.DEFAULT_DIRECTORY,
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
    const capacitor = (window as any).Capacitor;
    const isNative = capacitor?.isNativePlatform?.() || false;
    const platform = capacitor?.getPlatform?.() || 'unknown';

    console.log('[DEBUG] Platform detection:', {
      isNative,
      platform,
      capacitorPresent: !!capacitor,
      isNativePlatformFn: typeof capacitor?.isNativePlatform,
      getPlatformFn: typeof capacitor?.getPlatform
    });

    return isNative;
  }
}

export const fileSystemService = FileSystemService.getInstance();
