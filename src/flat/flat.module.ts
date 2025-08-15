import { Module } from '@nestjs/common';
import { FlatResolver } from './flat.resolver';
import { FlatService } from './flat.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FileModule } from 'src/file/file.module';

@Module({
  providers: [FlatResolver, FlatService],
  imports: [PrismaModule, FileModule], // Add any necessary imports here, e.g., ConfigModule, PrismaModule
})
export class FlatModule {}
