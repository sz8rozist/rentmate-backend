import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { AuthModule } from "./auth/auth.module";
import { FileModule } from "./file/file.module";
import { FlatModule } from "./flat/flat.module";
import { ChatModule } from "./chat/chat.module";
import { PrismaModule } from "./prisma/prisma.module";
import { PubSubModule } from "./pubsub/pubsub.module";
import { DocumentsModule } from './documents/documents.module';
@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      playground: true,
      debug: true,
      csrfPrevention: false,
    }),
    AuthModule,
    FileModule,
    FlatModule,
    ChatModule,
    PrismaModule,
    PubSubModule,
    DocumentsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
