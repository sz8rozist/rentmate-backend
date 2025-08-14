import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileUpload } from "graphql-upload/GraphQLUpload.mjs";
import * as Minio from "minio";

@Injectable()
export class FileService {
  private minioClient: Minio.Client;
  private bucket: string;
  private publicUrl: string;

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

  async uploadFile(file: FileUpload, folder: string): Promise<string> {
    const { createReadStream, filename, mimetype } = file;
    const objectName = `${folder}/${Date.now()}-${filename}`;

    await this.minioClient.putObject(
      this.bucket,
      objectName,
      createReadStream(),
      undefined,
      { "Content-Type": mimetype }
    );

    // Publikus bucket esetén az URL egyszerűen összeállítható
    return `${this.publicUrl}/${objectName}`;
  }
}
