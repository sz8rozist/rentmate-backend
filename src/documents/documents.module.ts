import { Module } from "@nestjs/common";
import { DocumentsResolver } from "./documents.resolver";
import { DocumentsService } from "./documents.service";
import { FileModule } from "src/file/file.module";

@Module({
  providers: [DocumentsResolver, DocumentsService],
  imports: [FileModule],
})
export class DocumentsModule {}
