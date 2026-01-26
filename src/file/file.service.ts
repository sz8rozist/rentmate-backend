import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Minio from "minio";
import { BaseService } from "src/common/base.service";
import { FileStorageService, FileUploadResult } from "./file-storage-interface";
import { BusinessValidationException } from "src/common/exception/business.validation.exception";
import { Readable } from "stream";

@Injectable()
export class FileService extends BaseService implements FileStorageService {
  private minioClient: Minio.Client;
  private bucket: string;
  private publicUrl: string;
  constructor(private configService: ConfigService) {
    super(FileService.name);
    this.bucket = this.configService.get<string>("MINIO_BUCKET") ?? "";
    this.publicUrl = this.configService.get<string>("MINIO_PUBLIC_URL") ?? "";
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>("MINIO_ENDPOINT") ?? "",
      port: +(this.configService.get<string>("MINIO_PORT") ?? "9000"),
      useSSL: false,
      accessKey: this.configService.get<string>("MINIO_ACCESS_KEY") ?? "",
      secretKey: this.configService.get<string>("MINIO_SECRET_KEY") ?? "",
    });
  }
  async uploadFile(file: Express.Multer.File): Promise<FileUploadResult> {
    this.logger.debug(
      `Uploading file: ${file.originalname}, type: ${file.mimetype}`,
    );
    const objectName = `${Date.now()}-${file.originalname}`;

    try {
      const exists = await this.minioClient.bucketExists(this.bucket);
      if (!exists) {
        this.logger.log(`Bucket ${this.bucket} nem létezik, létrehozás...`);
        await this.minioClient.makeBucket(this.bucket, "us-east-1");
      }

      await this.minioClient.putObject(
        this.bucket,
        objectName,
        file.buffer,
        file.size,
        {
          "Content-Type": file.mimetype,
        },
      );

      this.logger.log(`Fájl feltöltve a MinIO-ba: ${objectName}`);
      return {
        filename: objectName,
        path: objectName,
      };
    } catch (err) {
      this.logger.error(
        `A fájl feltöltés sikertelen: ${objectName}: ${err.message}`,
        err.stack,
      );
      throw new BusinessValidationException(`A fájl feltöltés sikertelen.`);
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucket, key);
      this.logger.log(`Fájl törölve a MinIO-ból: ${key}`);
    } catch (err) {
      this.logger.error(`Fájl törlése sikertelen: ${key}: ${err.message}`);
      throw err;
    }
  }

  async getStream(path: string): Promise<Readable> {
    return this.minioClient.getObject(this.bucket, path);
  }

  getPublicUrl(path: string): string {
    // 👉 opció A: backend streameli
    return `${this.publicUrl}/files/${path}`;

    // 👉 opció B (később): presigned URL
    // return await this.minioClient.presignedGetObject(this.bucket, path, 60 * 5);
  }
}
