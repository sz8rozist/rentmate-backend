import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { debug } from "console";
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

  async uploadFile(file: FileUpload): Promise<string> {
    const { createReadStream, filename, mimetype } = file;
    this.logger.debug(`Uploading file: ${filename}, type: ${mimetype}`);
    const objectName = `${Date.now()}-${filename}`; // nincs folder

    // Hívjuk meg a createReadStream() függvényt
    const stream = createReadStream();

    // Ellenőrizzük, hogy a bucket létezik
    const exists = await this.minioClient.bucketExists(this.bucket);
    if (!exists) {
      console.log(`Bucket ${this.bucket} does not exist`);
      await this.minioClient.makeBucket(this.bucket, "us-east-1");
    }

    // Feltöltés
    await this.minioClient.putObject(
      this.bucket,
      objectName,
      stream,
      undefined,
      { "Content-Type": mimetype }
    );

    console.log(`File uploaded to MinIO: ${objectName}`);
    return `${this.publicUrl}/${objectName}`;
  }
}
