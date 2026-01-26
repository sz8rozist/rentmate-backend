import { Module } from "@nestjs/common";
import { FileModule } from "src/file/file.module";
import { DocumentServiceService } from './service/document-service/document-service.service';
import { DocumentControllerController } from './controller/document-controller/document-controller.controller';

@Module({
  providers: [DocumentServiceService],
  imports: [FileModule],
  controllers: [DocumentControllerController],
})
export class DocumentsModule {}
