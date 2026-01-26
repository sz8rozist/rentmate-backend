import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  Patch,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateFlatDto } from "src/flat/dto/create-flat.dto";
import { UpdateFlatDto } from "src/flat/dto/update-flat.dto";
import { FlatService } from "src/flat/service/flat-service/flat.service";

@Controller("flat-controller")
export class FlatControllerController {
  constructor(private readonly flatService: FlatService) {}

  @Post()
  async addFlat(@Body(new ValidationPipe()) dto: CreateFlatDto) {
    return this.flatService.addFlat(dto);
  }

  @Post(":flatId/images")
  @UseInterceptors(FileInterceptor("image"))
  async uploadFlatImage(
    @Param("flatId", ParseIntPipe) flatId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.flatService.uploadFlatImage(flatId, file);
  }

  @Delete("images/:imageId")
  async deleteFlatImage(@Param("imageId", ParseIntPipe) imageId: number) {
    return await this.flatService.deleteFlatImage(imageId);
  }

  @Patch(":flatId")
  async updateFlat(
    @Param("flatId", ParseIntPipe) flatId: number,
    @Body(new ValidationPipe()) dto: UpdateFlatDto,
  ) {
    return this.flatService.updateFlat(flatId, dto);
  }

  @Delete(":flatId")
  async deleteFlat(@Param("flatId", ParseIntPipe) flatId: number) {
    return this.flatService.deleteFlat(flatId);
  }

  @Get(":id")
  async getFlatById(@Param("id", ParseIntPipe) id: number) {
    return this.flatService.getFlatById(id);
  }

  @Get("tenant/:tenantId")
  async getFlatForTenant(@Param("tenantId", ParseIntPipe) tenantId: number) {
    return this.flatService.getFlatForTenant(tenantId);
  }

  @Get("landlord/:landlordId")
  async getFlatsForLandlord(
    @Param("landlordId", ParseIntPipe) landlordId: number,
  ) {
    return this.flatService.getFlatsForLandlord(landlordId);
  }
}
