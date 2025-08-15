import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Global() // opcionális: ha globálisan akarod elérhetővé tenni
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}