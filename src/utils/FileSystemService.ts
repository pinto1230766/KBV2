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
          name: 'Samsung/Documents/KBV',
          options: {
            path: `Documents/${this.KBV_FOLDER}/${options.filename}`,
            data: options.data,
            directory: Directory.ExternalStorage,
            encoding: 'utf8' as any,
          },
          prepare: async () => {
            try {
              console.log('[DEBUG] Preparing Samsung/Documents/KBV strategy - creating folder...');
              await Filesystem.mkdir({
                path: `Documents/${this.KBV_FOLDER}`,
                directory: Directory.ExternalStorage,
                recursive: true,
              });
              console.log('[DEBUG] KBV folder ready in Samsung/Documents');
            } catch (e: any) {
              if (!e?.message?.includes('exists')) {
                console.log('[DEBUG] Could not create KBV folder in Samsung/Documents:', e);
              }
            }
          }
        },
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
   * Lire un fichier depuis Documents/KBV/ (essaye aussi le chemin Samsung)
   */
  async readFromDocuments(filename: string): Promise<string> {
    // Essayer d'abord le chemin par défaut (Documents)
    try {
      const result = await Filesystem.readFile({
        path: `${this.KBV_FOLDER}/${filename}`,
        directory: this.DEFAULT_DIRECTORY,
        encoding: 'utf8' as any,
      });
      return result.data as string;
    } catch (error: any) {
      // Si fichier non trouvé, essayer le chemin Samsung (ExternalStorage/Documents/KBV)
      if (error?.message?.includes('does not exist') || error?.message?.includes('not found')) {
        try {
          const result = await Filesystem.readFile({
            path: `Documents/${this.KBV_FOLDER}/${filename}`,
            directory: Directory.ExternalStorage,
            encoding: 'utf8' as any,
          });
          return result.data as string;
        } catch (samsungError) {
          throw error; // Propager l'erreur originale
        }
      }
      throw error;
    }
  }

  /**
   * Lister les fichiers dans Documents/KBV/ (essaye aussi le chemin Samsung)
   */
  async listKBVFiles(): Promise<string[]> {
    const files: string[] = [];
    
    // Essayer le chemin par défaut (Documents)
    try {
      const result = await Filesystem.readdir({
        path: this.KBV_FOLDER,
        directory: this.DEFAULT_DIRECTORY,
      });
      files.push(...result.files.map((f: string | { name: string }) => typeof f === 'string' ? f : f.name));
    } catch (error: any) {
      // Si dossier n'existe pas, continuer
      if (!error?.message?.includes('does not exist')) {
        console.log('[DEBUG] Error reading default directory:', error);
      }
    }
    
    // Essayer le chemin Samsung (ExternalStorage/Documents/KBV)
    try {
      const result = await Filesystem.readdir({
        path: `Documents/${this.KBV_FOLDER}`,
        directory: Directory.ExternalStorage,
      });
      const samsungFiles = result.files.map((f: string | { name: string }) => typeof f === 'string' ? f : f.name);
      // Fusionner sans doublons
      samsungFiles.forEach((file: string) => {
        if (!files.includes(file)) {
          files.push(file);
        }
      });
    } catch (error: any) {
      // Si dossier n'existe pas, ignorer
      if (!error?.message?.includes('does not exist')) {
        console.log('[DEBUG] Error reading Samsung directory:', error);
      }
    }
    
    return files;
  }

  /**
   * Supprimer un fichier de Documents/KBV/ (essaye aussi le chemin Samsung)
   */
  async deleteFromDocuments(filename: string): Promise<void> {
    // Essayer d'abord le chemin par défaut
    try {
      await Filesystem.deleteFile({
        path: `${this.KBV_FOLDER}/${filename}`,
        directory: this.DEFAULT_DIRECTORY,
      });
      return;
    } catch (error: any) {
      // Si fichier non trouvé, essayer le chemin Samsung
      if (error?.message?.includes('does not exist') || error?.message?.includes('not found')) {
        try {
          await Filesystem.deleteFile({
            path: `Documents/${this.KBV_FOLDER}/${filename}`,
            directory: Directory.ExternalStorage,
          });
          return;
        } catch (samsungError) {
          throw error;
        }
      }
      throw error;
    }
  }

  /**
   * Obtenir le chemin complet du dossier KBV (essaye d'abord Samsung, puis défaut)
   */
  async getKBVFolderPath(): Promise<string> {
    // Essayer d'abord le chemin Samsung
    try {
      const result = await Filesystem.getUri({
        path: `Documents/${this.KBV_FOLDER}`,
        directory: Directory.ExternalStorage,
      });
      return result.uri;
    } catch (error) {
      // Fallback sur le chemin par défaut
      try {
        const result = await Filesystem.getUri({
          path: this.KBV_FOLDER,
          directory: this.DEFAULT_DIRECTORY,
        });
        return result.uri;
      } catch {
        return 'Documents/KBV';
      }
    }
  }

  /**
   * Partager un fichier (essaye d'abord Samsung, puis défaut)
   */
  async shareFile(filename: string, title: string = 'Partager la sauvegarde'): Promise<void> {
    try {
      const canShare = await Share.canShare();
      if (!canShare.value) {
        throw new Error('Le partage n\'est pas disponible');
      }

      // Essayer d'abord le chemin Samsung
      let fileUri;
      try {
        const result = await Filesystem.getUri({
          path: `Documents/${this.KBV_FOLDER}/${filename}`,
          directory: Directory.ExternalStorage,
        });
        fileUri = result.uri;
      } catch {
        // Fallback sur le chemin par défaut
        const result = await Filesystem.getUri({
          path: `${this.KBV_FOLDER}/${filename}`,
          directory: this.DEFAULT_DIRECTORY,
        });
        fileUri = result.uri;
      }

      await Share.share({
        title,
        text: `Sauvegarde KBV: ${filename}`,
        url: fileUri,
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
