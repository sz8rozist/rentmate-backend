import { HttpStatus, Injectable} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileUpload } from "graphql-upload/GraphQLUpload.mjs";
import * as Minio from "minio";
import { FileUploadResponse } from "./dto/file-upload-dto";
import { AppException } from "src/common/exception/app.exception";
import { BaseService } from "src/common/base.service";

@Injectable()
export class FileService extends BaseService {
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
  async uploadFile(file: FileUpload): Promise<FileUploadResponse> {
    const { createReadStream, filename, mimetype } = file;
    this.logger.debug(`Uploading file: ${filename}, type: ${mimetype}`);
    const objectName = `${Date.now()}-${filename}`;
    const stream = createReadStream();

    try {
      const exists = await this.minioClient.bucketExists(this.bucket);
      if (!exists) {
        this.logger.log(`Bucket ${this.bucket} nem létezik, létrehozás...`);
        await this.minioClient.makeBucket(this.bucket, "us-east-1");
      }

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
      this.logger.log(`Fájl feltöltve a MinIO-ba: ${objectName}`);
      return { key: objectName, url };
    } catch (err) {
      this.logger.error(
        `A fájl feltöltés sikertelen: ${filename}: ${err.message}`,
        err.stack
      );
      throw new AppException(
        `A fájl feltöltés sikertelen.`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // --------------------
  // Fájl törlése MinIO-ból
  // --------------------
  async deleteFile(key: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucket, key);
      this.logger.log(`Fájl törölve a MinIO-ból: ${key}`);
    } catch (err) {
      this.logger.error(`Fájl törlése sikertelen: ${key}: ${err.message}`);
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
