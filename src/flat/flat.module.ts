import { Module } from '@nestjs/common';
import { FlatService } from './service/flat-service/flat.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FileModule } from 'src/file/file.module';
import { FlatControllerController } from './controller/flat-controller/flat-controller.controller';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  providers: [FlatService],
  imports: [PrismaModule, FileModule, AuthModule],
  controllers: [FlatControllerController],
})
export class FlatModule {}
