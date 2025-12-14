import { FileStorageService } from "src/file/file-storage-interface";

type FileLike = {
  filename: string;
  url?: string | null;
  [key: string]: any;
};

export interface HasImages {
  images?: FileLike[];
}

export interface HasAttachment {
  messageAttachments?: FileLike[];
}

export class FileHelper {
  // =========================
  // INTERNAL GENERIC HELPER
  // =========================
  private static async attachSignedUrlsToField<
    T,
    K extends keyof T
  >(
    entity: T,
    field: K,
    fileService: FileStorageService,
  ): Promise<T> {
    const files = entity[field] as unknown as FileLike[] | undefined;

    if (!files || files.length === 0) {
      return entity;
    }

    const keys = files.map((f) => f.filename);
    const { urls } = await fileService.getSignedUrls({ keys });

    entity[field] = files.map((file, index) => ({
      ...file,
      url: urls[index],
    })) as any;

    return entity;
  }

  // =========================
  // IMAGES
  // =========================
  static async attachSignedImageUrls<T extends HasImages>(
    entity: T,
    fileService: FileStorageService,
  ): Promise<T> {
    return this.attachSignedUrlsToField(
      entity,
      "images",
      fileService,
    );
  }

  static async attachSignedImageUrlsToMany<T extends HasImages>(
    entities: T[],
    fileService: FileStorageService,
  ): Promise<T[]> {
    for (const entity of entities) {
      await this.attachSignedImageUrls(entity, fileService);
    }
    return entities;
  }

  // =========================
  // ATTACHMENTS
  // =========================
  static async attachSignedAttachmentUrls<T extends HasAttachment>(
    entity: T,
    fileService: FileStorageService,
  ): Promise<T> {
    return this.attachSignedUrlsToField(
      entity,
      "messageAttachments",
      fileService,
    );
  }

  static async attachSignedAttachmentUrlsToMany<T extends HasAttachment>(
    entities: T[],
    fileService: FileStorageService,
  ): Promise<T[]> {
    for (const entity of entities) {
      await this.attachSignedAttachmentUrls(entity, fileService);
    }
    return entities;
  }
}
