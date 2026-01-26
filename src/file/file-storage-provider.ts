import { ConfigService } from "@nestjs/config";
import { FileStorageService } from "./file-storage-interface";
import { FileService } from "./file.service";
import { MockFileService } from "./mock-file-service";

export const fileStorageProvider = {
  provide: "FileStorageService",
  useFactory: (configService: ConfigService): FileStorageService => {
    const storageType = configService.get<string>("FILE_STORAGE") || "mock";

    if (storageType === "minio") {
      return new FileService(configService);
    } else {
      return new MockFileService(MockFileService.name);
    }
  },
  inject: [ConfigService],
};
