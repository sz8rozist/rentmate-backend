import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { FileService } from "../file/file.service";
import { FileUpload } from "graphql-upload/GraphQLUpload.mjs";
import { FlatStatus } from "src/@generated/prisma/flat-status.enum";

@Injectable()
export class FlatService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService
  ) {}

  async addFlat(
    data: { address: string; price: number; landlordId: number },
    image: FileUpload
  ) {
    // Kép feltöltése MinIO-ba
    const imageUrl = await this.fileService.uploadFile(image, "flats");

    // Lakás létrehozása az adatbázisban
    const flat = await this.prisma.flat.create({
      data: {
        address: data.address,
        price: data.price,
        landlordId: data.landlordId,
        images: {
          create: [{ url: imageUrl }],
        },
      },
      include: { images: true },
    });
    return flat;
  }

  async deleteFlat(flatId: number) {
    // Törlés előtt minden kapcsolódó rekordot törlünk
    await this.prisma.flatImage.deleteMany({ where: { flatId } });
    await this.prisma.flatDocument.deleteMany({ where: { flatId } });
    await this.prisma.message.deleteMany({ where: { flatId } });
    // Ha van tenant kapcsolat, azt is törölheted, pl. flatId nullázása
    await this.prisma.user.updateMany({
      where: { flatId },
      data: { flatId: null },
    });

    // Végül magát a lakást töröljük
    await this.prisma.flat.delete({ where: { id: flatId } });

    return { success: true };
  }

  async updateFlat(flatId: number, data: { address?: string; price?: number, status?: FlatStatus }) {
    return this.prisma.flat.update({
      where: { id: flatId },
      data,
      include: {
        images: true,
        tenants: true,
        landlord: true,
        flatDocument: true,
        message: true,
      },
    });
  }

  async addTenantToFlat(flatId: number, tenantId: number) {
    // Tenant flatId mezőjét beállítjuk
    return this.prisma.user.update({
      where: { id: tenantId },
      data: { flatId },
    });
  }

  async removeTenantFromFlat(tenantId: number) {
    // Tenant flatId mezőjét nullázzuk
    return this.prisma.user.update({
      where: { id: tenantId },
      data: { flatId: null },
    });
  }

  async getFlatForTenant(tenantId: number) {
    // Tenant flatId alapján lekérjük a lakást minden adattal
    const tenant = await this.prisma.user.findUnique({
      where: { id: tenantId },
      include: {
        flat: {
          include: {
            images: true,
            landlord: true,
            tenants: true,
            flatDocument: true,
            message: true,
          },
        },
      },
    });
    return tenant?.flat;
  }

  async getFlatsForLandlord(landlordId: number) {
    // Landlord összes lakását lekérjük minden adattal
    return this.prisma.flat.findMany({
      where: { landlordId },
      include: {
        images: true,
        tenants: true,
        landlord: true,
        flatDocument: true,
        message: true,
      },
    });
  }
}
