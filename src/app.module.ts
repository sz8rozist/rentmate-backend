import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { FlatModule } from './flat/flat.module';
import { ChatModule } from './chat/chat.module';
import { PrismaModule } from './prisma/prisma.module';
import { PubSubModule } from './pubsub/pubsub.module';
@Module({
  imports: [
     GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true, // fejlesztéshez hasznos
      debug: false, // ez tiltja a stack trace-t
    }),
     AuthModule,
     FileModule,
     FlatModule,
     ChatModule,
     PrismaModule,
     PubSubModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
