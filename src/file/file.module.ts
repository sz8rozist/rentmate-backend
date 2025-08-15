import { Module } from "@nestjs/common";
import { FileService } from "./file.service";
import { FileResolver } from "./file.resolver";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  providers: [FileService, FileResolver],
  imports: [ConfigModule, PrismaModule], // Ezt hozzá kell adni
  exports: [FileService], // Export FileService if needed in other modules
})
export class FileModule {}
