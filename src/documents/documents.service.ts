import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { FileService } from 'src/file/file.service';
import { DocumentModel } from './document.model';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
  ) {}

  // --------------------
  // Dokumentum feltöltése + metaadat mentés
  // --------------------
  async uploadDocument(file: any, category: string, flatId: number): Promise<DocumentModel> {
    // 1️⃣ Fájl feltöltése MinIO-ba
    const { key, url } = await this.fileService.uploadFile(file);

    // 2️⃣ Kiterjesztés meghatározása
    const ext = file.filename.split('.').pop() || 'unknown';

    // 3️⃣ Metaadat mentése Prisma-ba
    const doc = await this.prisma.document.create({
      data: {
        name: file.filename,
        url,
        type: ext,
        category,
        filePath: key,   // fontos: MinIO key tárolása
        flatId,
        uploadedAt: new Date(),
      },
    });

    return doc;
  }

  // --------------------
  // Dokumentumok lekérése flatId alapján
  // --------------------
  async getDocuments(flatId: number): Promise<DocumentModel[]> {
    return this.prisma.document.findMany({
      where: { flatId },
      orderBy: { uploadedAt: "desc" },
    });
  }

  // --------------------
  // Dokumentum törlése
  // --------------------
  async deleteDocument(id: number): Promise<boolean> {
    // 1️⃣ Lekérjük a dokumentumot
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) return false;

    // 2️⃣ Törlés MinIO-ból
    await this.fileService.deleteFile(doc.filePath);

    // 3️⃣ Törlés Prisma-ból
    await this.prisma.document.delete({ where: { id } });

    return true;
  }
}


