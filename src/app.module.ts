import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { FileModule } from "./file/file.module";
import { FlatModule } from "./flat/flat.module";
import { ChatModule } from "./chat/chat.module";
import { PrismaModule } from "./prisma/prisma.module";
import { DocumentsModule } from "./documents/documents.module";
import { UserModule } from './user/user.module';
@Module({
  imports: [
    AuthModule,
    FileModule,
    FlatModule,
    ChatModule,
    PrismaModule,
    DocumentsModule,
    UserModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
