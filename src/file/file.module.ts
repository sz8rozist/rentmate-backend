import { Module } from "@nestjs/common";
import { FileService } from "./file.service";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "src/prisma/prisma.module";
import { fileStorageProvider } from "./file-storage-provider";

@Module({
  providers: [FileService, fileStorageProvider],
  imports: [ConfigModule, PrismaModule],
  exports: [FileService, "FileStorageService"],
})
export class FileModule {}
