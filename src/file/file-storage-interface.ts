import { Readable } from "stream";

export interface FileUploadResult {
  filename: string;
  path: string;
}

export interface FileStorageService {
  /**
   * Fájl feltöltése
   */
  uploadFile(file: Express.Multer.File): Promise<FileUploadResult>;

  /**
   * Fájl törlése
   */
  deleteFile(key: string): Promise<void>;

  getStream(path: string): Promise<Readable>;

  getPublicUrl(path: string): string;
}
