import { Module } from '@nestjs/common';
import { FlatResolver } from './flat.resolver';
import { FlatService } from './service/flat-service/flat.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FileModule } from 'src/file/file.module';
import { FlatControllerController } from './controller/flat-controller/flat-controller.controller';
@Module({
  providers: [FlatResolver, FlatService],
  imports: [PrismaModule, FileModule],
  controllers: [FlatControllerController],
})
export class FlatModule {}
