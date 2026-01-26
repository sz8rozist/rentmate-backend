import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { FileModule } from "./file/file.module";
import { FlatModule } from "./flat/flat.module";
import { ChatModule } from "./chat/chat.module";
import { PrismaModule } from "./prisma/prisma.module";
import { DocumentsModule } from "./documents/documents.module";
import { UserModule } from './user/user.module';
import { JwtAuthGuard } from "./auth/jwt/jwt-auth.guard";
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
})
export class AppModule {}
