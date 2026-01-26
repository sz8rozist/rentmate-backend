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
  UseGuards,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt/jwt-auth.guard";
import { CreateFlatDto } from "src/flat/dto/create-flat.dto";
import { FlatDto } from "src/flat/dto/flat-dto";
import { FlatImageDto } from "src/flat/dto/flat-image.dto";
import { UpdateFlatDto } from "src/flat/dto/update-flat.dto";
import { FlatService } from "src/flat/service/flat-service/flat.service";

@ApiTags('Flat')
@Controller("flat")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class FlatControllerController {
  constructor(private readonly flatService: FlatService) {}

  @Post()
  @ApiOperation({ summary: 'Új lakás hozzáadása' })
  @ApiBody({ type: CreateFlatDto })
  @ApiResponse({ status: 201, description: 'A létrehozott lakás', type: FlatDto })
  async addFlat(@Body(new ValidationPipe()) dto: CreateFlatDto) {
    return this.flatService.addFlat(dto);
  }

  @Post(":flatId/images")
  @UseInterceptors(FileInterceptor("image"))
  @ApiOperation({ summary: 'Lakáshoz kép feltöltése' })
  @ApiParam({ name: 'flatId', type: Number })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Feltöltendő kép',
    required: true,
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Feltöltött kép', type: FlatImageDto })
  async uploadFlatImage(
    @Param("flatId", ParseIntPipe) flatId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.flatService.uploadFlatImage(flatId, file);
  }

  @Delete("images/:imageId")
  @ApiOperation({ summary: 'Lakás kép törlése' })
  @ApiParam({ name: 'imageId', type: Number })
  @ApiResponse({ status: 200, description: 'A kép törlésre került', type: FlatImageDto })
  async deleteFlatImage(@Param("imageId", ParseIntPipe) imageId: number) {
    return await this.flatService.deleteFlatImage(imageId);
  }

  @Patch(":flatId")
  @ApiOperation({ summary: 'Lakás adatainak frissítése' })
  @ApiParam({ name: 'flatId', type: Number })
  @ApiResponse({ status: 200, description: 'Frissített lakás', type: FlatDto })
  async updateFlat(
    @Param("flatId", ParseIntPipe) flatId: number,
    @Body(new ValidationPipe()) dto: UpdateFlatDto,
  ) {
    return this.flatService.updateFlat(flatId, dto);
  }

  @Delete(":flatId")
  @ApiOperation({ summary: 'Lakás törlése' })
  @ApiParam({ name: 'flatId', type: Number })
  @ApiResponse({ status: 200, description: 'A lakás törölve lett', type: Boolean })
  async deleteFlat(@Param("flatId", ParseIntPipe) flatId: number) {
    return this.flatService.deleteFlat(flatId);
  }

  @Get(":id")
  @ApiOperation({ summary: 'Lakás lekérése ID alapján' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'A lekért lakás', type: FlatDto })
  async getFlatById(@Param("id", ParseIntPipe) id: number) {
    return this.flatService.getFlatById(id);
  }

  @Get("tenant/:tenantId")
  @ApiOperation({ summary: 'Lakás lekérése bérlő alapján' })
  @ApiParam({ name: 'tenantId', type: Number })
  @ApiResponse({ status: 200, description: 'A bérlőhöz tartozó lakás', type: FlatDto })
  async getFlatForTenant(@Param("tenantId", ParseIntPipe) tenantId: number) {
    return this.flatService.getFlatForTenant(tenantId);
  }

  @Get("landlord/:landlordId")
  @ApiOperation({ summary: 'Lakások lekérése tulajdonos alapján' })
  @ApiParam({ name: 'landlordId', type: Number })
  @ApiResponse({ status: 200, description: 'A tulajdonoshoz tartozó lakások', type: [FlatDto] })
  async getFlatsForLandlord(
    @Param("landlordId", ParseIntPipe) landlordId: number,
  ) {
    return this.flatService.getFlatsForLandlord(landlordId);
  }
}

