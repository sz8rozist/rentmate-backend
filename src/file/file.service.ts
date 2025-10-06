import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileUpload } from "graphql-upload/GraphQLUpload.mjs";
import * as Minio from "minio";

@Injectable()
export class FileService {
  private minioClient: Minio.Client;
  private bucket: string;
  private publicUrl: string;
  private readonly logger = new Logger(FileService.name);
  constructor(private configService: ConfigService) {
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
  // --------------------
  // Fájl feltöltés MinIO-ba
  // --------------------
  async uploadFile(file: FileUpload): Promise<{ key: string; url: string }> {
    const { createReadStream, filename, mimetype } = file;
    this.logger.debug(`Uploading file: ${filename}, type: ${mimetype}`);
    const objectName = `${Date.now()}-${filename}`;
    const stream = createReadStream();

    // Bucket ellenőrzése
    const exists = await this.minioClient.bucketExists(this.bucket);
    if (!exists) {
      this.logger.log(`Bucket ${this.bucket} does not exist, creating...`);
      await this.minioClient.makeBucket(this.bucket, "us-east-1");
    }

    // Feltöltés
    await this.minioClient.putObject(
      this.bucket,
      objectName,
      stream,
      undefined,
      {
        "Content-Type": mimetype,
      }
    );

    const url = `${this.publicUrl}/${objectName}`;
    this.logger.log(`File uploaded to MinIO: ${objectName}`);
    return { key: objectName, url };
  }

  // --------------------
  // Fájl törlése MinIO-ból
  // --------------------
  async deleteFile(key: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucket, key);
      this.logger.log(`File deleted from MinIO: ${key}`);
    } catch (err) {
      this.logger.error(`Failed to delete file ${key}: ${err.message}`);
      throw err;
    }
  }

  // --------------------
  // Fájl létezésének ellenőrzése
  // --------------------
  async fileExists(key: string): Promise<boolean> {
    try {
      await this.minioClient.statObject(this.bucket, key);
      return true;
    } catch (err) {
      if (err.code === "NotFound") return false;
      throw err;
    }
  }

  // --------------------
  // Publikus URL lekérése
  // --------------------
  getPublicUrl(key: string): string {
    return `${this.publicUrl}/${key}`;
  }
}
