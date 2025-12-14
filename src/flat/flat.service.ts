import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { FileUpload } from "graphql-upload/GraphQLUpload.mjs";
import { AppException } from "src/common/exception/app.exception";
import { FlatStatus } from "./flat-status";
import { FlatRequestInput } from "./dto/flat-request.input";
import { BaseService } from "src/common/base.service";
import type { FileStorageService } from "src/file/file-storage-interface";
import { FileHelper } from "src/file/file-helper";

@Injectable()
export class FlatService extends BaseService {
  constructor(
    private prisma: PrismaService,
    @Inject("FileStorageService") private fileService: FileStorageService
  ) {
    super(FlatService.name);
  }

  async addFlat(data: FlatRequestInput) {
    const flat = await this.prisma.flat.create({
      data: {
        status: FlatStatus.available,
        address: data.address,
        price: data.price,
        landlordId: data.landlordId,
      },
      include: { images: true },
    });
    return FileHelper.attachSignedImageUrls(flat, this.fileService);
  }

  async getFlatById(flatId: number) {
    const flat = await this.prisma.flat.findUnique({
      where: { id: flatId },
      include: {
        images: true,
        tenants: true,
        landlord: true,
        messages: true,
      },
    });

    if (!flat) {
      throw new AppException(
        `Flat with id ${flatId} not found`,
        HttpStatus.NOT_FOUND
      );
    }

    return FileHelper.attachSignedImageUrls(flat, this.fileService);
  }

  async deleteFlat(flatId: number) {
    // Törlés előtt minden kapcsolódó rekordot törlünk
    await this.prisma.flatImage.deleteMany({ where: { flatId } });
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

  async updateFlat(
    flatId: number,
    data: { address?: string; price?: number; status?: FlatStatus }
  ) {
    return this.prisma.flat.update({
      where: { id: flatId },
      data,
      include: {
        images: true,
        tenants: true,
        landlord: true,
        messages: true,
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
            messages: true,
          },
        },
      },
    });
    return tenant?.flat;
  }

  async getFlatsForLandlord(landlordId: number) {
    const flats = await this.prisma.flat.findMany({
      where: { landlordId },
      include: {
        landlord: true,
        images: true,
        tenants: true,
        messages: true,
      },
    });

    return FileHelper.attachSignedImageUrlsToMany(flats, this.fileService);
  }

  async uploadFlatImage(flatId: number, image: FileUpload) {
    // Kép feltöltése MinIO-ba
    const { key, url } = await this.fileService.uploadFile(image);

    // Mentés adatbázisba
    await this.prisma.flatImage.create({
      data: {
        filename: key,
        flatId: flatId,
      },
    });

    return true;
  }

  async deleteFlatImage(imageId: number) {
    // Kép törlése az adatbázisból
    await this.prisma.flatImage.delete({
      where: { id: imageId },
    });
    return true;
  }
}
