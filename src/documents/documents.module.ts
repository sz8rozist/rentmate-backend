import { Module } from "@nestjs/common";
import { DocumentsResolver } from "./documents.resolver";
import { DocumentsService } from "./documents.service";
import { FileModule } from "src/file/file.module";
import { DocumentServiceService } from './service/document-service/document-service.service';
import { DocumentControllerController } from './controller/document-controller/document-controller.controller';

@Module({
  providers: [DocumentsResolver, DocumentsService, DocumentServiceService],
  imports: [FileModule],
  controllers: [DocumentControllerController],
})
export class DocumentsModule {}
