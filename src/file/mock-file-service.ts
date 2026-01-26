import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { FileStorageService, FileUploadResult } from './file-storage-interface';
import { BaseService } from 'src/common/base.service';
import { Readable } from 'stream';

@Injectable()
export class MockFileService extends BaseService implements FileStorageService {
  private uploadDir = process.env.UPLOAD_DIR || 'uploads';
  private baseUrl = process.env.API_URL!;
  async uploadFile(file: Express.Multer.File): Promise<FileUploadResult> {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }

    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(this.uploadDir, filename);

    fs.writeFileSync(filePath, file.buffer);

    return {
      filename,
      path: filePath,
    };
  }

  async deleteFile(filePath: string): Promise<void> {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  async getStream(filePath: string): Promise<Readable> {
    const fullPath = path.join(this.uploadDir, filePath);
    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException();
    }
    return fs.createReadStream(fullPath);
  }

  getPublicUrl(path: string): string {
    return `${this.baseUrl}/files/${path}`;
  }
}
