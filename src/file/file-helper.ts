import { FileStorageService } from "src/file/file-storage-interface";

export interface HasImages {
  images?: {
    filename: string;
    url?: string | null;
    [key: string]: any;
  }[];
}

export class FileHelper {
  /**
   * Egy entitás képeit kiegészíti signed URL-ekkel
   */
  static async attachSignedImageUrls<T extends HasImages>(
    entity: T,
    fileService: FileStorageService,
  ): Promise<T> {
    if (!entity?.images || entity.images.length === 0) {
      return entity;
    }

    const keys = entity.images.map((img) => img.filename);
    const { urls } = await fileService.getSignedUrls({ keys });

    entity.images = entity.images.map((img, index) => ({
      ...img,
      url: urls[index],
    }));

    return entity;
  }

  /**
   * Több entitás képeit egészíti ki signed URL-ekkel
   */
  static async attachSignedImageUrlsToMany<T extends HasImages>(
    entities: T[],
    fileService: FileStorageService,
  ): Promise<T[]> {
    if (!entities || entities.length === 0) {
      return entities;
    }

    for (const entity of entities) {
      await this.attachSignedImageUrls(entity, fileService);
    }

    return entities;
  }
}
