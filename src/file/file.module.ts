import { Module } from "@nestjs/common";
import { FileService } from "./file.service";
import { FileResolver } from "./file.resolver";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "src/prisma/prisma.module";
import { FileController } from "./file-controller";
import { fileStorageProvider } from "./file-storage-provider";

@Module({
  providers: [FileService, FileResolver, fileStorageProvider],
  imports: [ConfigModule, PrismaModule],
  exports: [FileService,"FileStorageService"],
  controllers: [FileController]
})
export class FileModule {}
