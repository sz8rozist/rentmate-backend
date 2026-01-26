import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { BaseService } from "src/common/base.service";
import type { FileStorageService } from "src/file/file-storage-interface";
import { CreateFlatDto } from "src/flat/dto/create-flat.dto";
import { BusinessValidationException } from "src/common/exception/business.validation.exception";
import { UpdateFlatDto } from "src/flat/dto/update-flat.dto";
import { Flat } from "@prisma/client";

@Injectable()
export class FlatService extends BaseService {
  constructor(
    private prisma: PrismaService,
    @Inject("FileStorageService") private fileService: FileStorageService,
  ) {
    super(FlatService.name);
  }

  async addFlat(dto: CreateFlatDto): Promise<Flat> {
    return await this.prisma.flat.create({
      data: dto,
    });
  }

  async getFlatById(flatId: number) {
    const flat = await this.prisma.flat.findUnique({
      where: { id: flatId },
    });

    if (!flat) {
      throw new BusinessValidationException({ flatId: `Flat with id ${flatId} not found` });
    }

    return flat;
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

    return true;
  }

  async updateFlat(flatId: number, data: UpdateFlatDto) {
    return await this.prisma.flat.update({
      where: { id: flatId },
      data,
    });
  }

  async getFlatForTenant(tenantId: number) {
    return this.prisma.flat.findFirst({
      where: {
        tenants: {
          some: { id: tenantId },
        },
      },
    });
  }

  async getFlatsForLandlord(landlordId: number) {
    return this.prisma.flat.findMany({
      where: { landlordId },
      include: { images: true },
    });
  }

  async uploadFlatImage(flatId: number, image: Express.Multer.File) {
    const fileUploadResult = await this.fileService.uploadFile(image);
    return await this.prisma.flatImage.create({
      data: {
        filename: fileUploadResult.filename,
        flatId: flatId,
      },
    });
  }

  async deleteFlatImage(imageId: number) {
    const image = await this.prisma.flatImage.findUnique({
      where: { id: imageId },
    });
    if (!image) {
      throw new BusinessValidationException({
        imageId: `Image with id ${imageId} not found`,
      });
    }
    await this.fileService.deleteFile(`${image.filename}`);
    return this.prisma.flatImage.delete({
      where: { id: imageId },
    });
  }
}
