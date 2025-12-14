import { Injectable, HttpStatus } from "@nestjs/common";
import { FileUpload } from "graphql-upload/processRequest.mjs";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { pipeline } from "stream/promises";
import { randomUUID } from "crypto";
import * as jwt from "jsonwebtoken";

import { BaseService } from "src/common/base.service";
import { FileUploadResponse } from "./dto/file-upload-dto";
import { SignedUrlsRequest } from "./dto/signed-url-request";
import { SignedUrlResponse } from "./dto/signed-url-response";
import { FileStorageService } from "./file-storage-interface";
import { AppException } from "src/common/exception/app.exception";

@Injectable()
export class MockFileService
  extends BaseService
  implements FileStorageService
{
  private readonly uploadDir = join(process.cwd(), "upload");
  private readonly jwtSecret = "mock-file-secret";

  constructor() {
    super(MockFileService.name);
    this.ensureUploadDir();
  }

  // --------------------
  // Upload
  // --------------------
  async uploadFile(file: FileUpload): Promise<FileUploadResponse> {
    if (!file || !file.createReadStream) {
      throw new AppException("File missing", HttpStatus.BAD_REQUEST);
    }

    const { createReadStream, filename, mimetype } = file;
    const key = `${randomUUID()}-${filename}`;

    this.logger.debug(`Mock fájl feltöltés: ${filename} (${mimetype})`);

    try {
      const filePath = join(this.uploadDir, key);
      const stream = createReadStream();

      // Pipeline automatikusan kezeli a hibákat
      await pipeline(stream, createWriteStream(filePath));

      const token = jwt.sign({ key }, this.jwtSecret, { expiresIn: 3600 });

      return {
        key,
        url: `http://localhost:3000/files/${key}?token=${token}`,
      };
    } catch (err) {
      this.logger.error("Mock fájl feltöltése sikertelen", err);
      throw new AppException(
        "Fájl feltöltés az upload mappába sikertelen",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // --------------------
  // Delete
  // --------------------
  async deleteFile(key: string): Promise<void> {
    const filePath = join(this.uploadDir, key);

    if (!existsSync(filePath)) return;

    try {
      const fs = await import("fs/promises");
      await fs.unlink(filePath);
    } catch (err) {
      this.logger.error(`Mock fájl törlése sikertelen: ${key}`, err);
      throw err;
    }
  }

  // --------------------
  // Exists
  // --------------------
  async fileExists(key: string): Promise<boolean> {
    return existsSync(join(this.uploadDir, key));
  }

  // --------------------
  // Signed URLs
  // --------------------
  async getSignedUrls(
    request: SignedUrlsRequest,
    expiresIn: number = 3600
  ): Promise<SignedUrlResponse> {
    const urls = request.keys.map((key) => {
      const token = jwt.sign({ key }, this.jwtSecret, { expiresIn });
      return `http://localhost:3000/files/${key}?token=${token}`;
    });

    return new SignedUrlResponse(urls);
  }

  // --------------------
  // Helpers
  // --------------------
  private ensureUploadDir() {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
      this.logger.log(`Upload mappa létrehozása: ${this.uploadDir}`);
    }
  }

  
}
