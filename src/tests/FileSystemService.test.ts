import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fileSystemService } from '@/utils/FileSystemService';

// Mock Capacitor
const mockFilesystem = {
  writeFile: vi.fn(),
  readFile: vi.fn(),
  readdir: vi.fn(),
  deleteFile: vi.fn(),
  mkdir: vi.fn(),
  getUri: vi.fn(),
};

const mockShare = {
  canShare: vi.fn(),
  share: vi.fn(),
};

vi.mock('@capacitor/filesystem', () => ({
  Filesystem: mockFilesystem,
  Directory: {
    Documents: 'DOCUMENTS',
  },
}));

vi.mock('@capacitor/share', () => ({
  Share: mockShare,
}));

describe('FileSystemService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.Capacitor
    (window as any).Capacitor = {
      isNativePlatform: () => true,
    };
  });

  describe('saveToDocuments', () => {
    it('devrait sauvegarder un fichier sur plateforme native', async () => {
      mockFilesystem.mkdir.mockResolvedValue(undefined);
      mockFilesystem.writeFile.mockResolvedValue({ uri: 'file:///storage/Documents/KBV/test.json' });

      const result = await fileSystemService.saveToDocuments({
        filename: 'test.json',
        data: '{"test": true}',
        mimeType: 'application/json',
      });

      expect(result.success).toBe(true);
      expect(result.path).toBe('file:///storage/Documents/KBV/test.json');
      expect(mockFilesystem.mkdir).toHaveBeenCalledWith({
        path: 'KBV',
        directory: 'DOCUMENTS',
        recursive: true,
      });
      expect(mockFilesystem.writeFile).toHaveBeenCalledWith({
        path: 'KBV/test.json',
        data: '{"test": true}',
        directory: 'DOCUMENTS',
        encoding: 'utf8',
      });
    });

    it('devrait gérer les erreurs de sauvegarde', async () => {
      mockFilesystem.mkdir.mockResolvedValue(undefined);
      mockFilesystem.writeFile.mockRejectedValue(new Error('Erreur de sauvegarde'));

      const result = await fileSystemService.saveToDocuments({
        filename: 'test.json',
        data: '{"test": true}',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Erreur de sauvegarde');
    });

    it('devrait utiliser le fallback web sur navigateur', async () => {
      (window as any).Capacitor = {
        isNativePlatform: () => false,
      };

      // Mock DOM APIs
      const mockCreateElement = vi.spyOn(document, 'createElement');
      const mockAppendChild = vi.spyOn(document.body, 'appendChild');
      const mockRemoveChild = vi.spyOn(document.body, 'removeChild');
      const mockClick = vi.fn();
      
      mockCreateElement.mockReturnValue({
        click: mockClick,
        href: '',
        download: '',
      } as any);

      const result = await fileSystemService.saveToDocuments({
        filename: 'test.json',
        data: '{"test": true}',
      });

      expect(result.success).toBe(true);
      expect(result.path).toContain('test.json');
      expect(mockClick).toHaveBeenCalled();

      mockCreateElement.mockRestore();
      mockAppendChild.mockRestore();
      mockRemoveChild.mockRestore();
    });
  });

  describe('listKBVFiles', () => {
    it('devrait lister les fichiers du dossier KBV', async () => {
      mockFilesystem.readdir.mockResolvedValue({
        files: ['backup-2025-01-01.json', 'backup-2025-01-02.json'],
      });

      const files = await fileSystemService.listKBVFiles();

      expect(files).toEqual(['backup-2025-01-01.json', 'backup-2025-01-02.json']);
      expect(mockFilesystem.readdir).toHaveBeenCalledWith({
        path: 'KBV',
        directory: 'DOCUMENTS',
      });
    });

    it('devrait retourner un tableau vide si le dossier n\'existe pas', async () => {
      mockFilesystem.readdir.mockRejectedValue(new Error('does not exist'));

      const files = await fileSystemService.listKBVFiles();

      expect(files).toEqual([]);
    });
  });

  describe('readFromDocuments', () => {
    it('devrait lire un fichier depuis Documents/KBV', async () => {
      mockFilesystem.readFile.mockResolvedValue({
        data: '{"test": true}',
      });

      const content = await fileSystemService.readFromDocuments('test.json');

      expect(content).toBe('{"test": true}');
      expect(mockFilesystem.readFile).toHaveBeenCalledWith({
        path: 'KBV/test.json',
        directory: 'DOCUMENTS',
        encoding: 'utf8',
      });
    });
  });

  describe('deleteFromDocuments', () => {
    it('devrait supprimer un fichier', async () => {
      mockFilesystem.deleteFile.mockResolvedValue(undefined);

      await fileSystemService.deleteFromDocuments('test.json');

      expect(mockFilesystem.deleteFile).toHaveBeenCalledWith({
        path: 'KBV/test.json',
        directory: 'DOCUMENTS',
      });
    });
  });

  describe('shareFile', () => {
    it('devrait partager un fichier', async () => {
      mockShare.canShare.mockResolvedValue({ value: true });
      mockFilesystem.getUri.mockResolvedValue({
        uri: 'file:///storage/Documents/KBV/test.json',
      });
      mockShare.share.mockResolvedValue(undefined);

      await fileSystemService.shareFile('test.json', 'Partager');

      expect(mockShare.canShare).toHaveBeenCalled();
      expect(mockFilesystem.getUri).toHaveBeenCalledWith({
        path: 'KBV/test.json',
        directory: 'DOCUMENTS',
      });
      expect(mockShare.share).toHaveBeenCalledWith({
        title: 'Partager',
        text: 'Sauvegarde KBV: test.json',
        url: 'file:///storage/Documents/KBV/test.json',
        dialogTitle: 'Partager',
      });
    });

    it('devrait gérer l\'erreur si le partage n\'est pas disponible', async () => {
      mockShare.canShare.mockResolvedValue({ value: false });

      await expect(
        fileSystemService.shareFile('test.json')
      ).rejects.toThrow('Le partage n\'est pas disponible');
    });
  });

  describe('getKBVFolderPath', () => {
    it('devrait retourner le chemin du dossier KBV', async () => {
      mockFilesystem.getUri.mockResolvedValue({
        uri: 'file:///storage/emulated/0/Documents/KBV',
      });

      const path = await fileSystemService.getKBVFolderPath();

      expect(path).toBe('file:///storage/emulated/0/Documents/KBV');
    });

    it('devrait retourner un chemin par défaut en cas d\'erreur', async () => {
      mockFilesystem.getUri.mockRejectedValue(new Error('Erreur'));

      const path = await fileSystemService.getKBVFolderPath();

      expect(path).toBe('Documents/KBV');
    });
  });
});
