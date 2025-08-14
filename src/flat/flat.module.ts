import { Module } from '@nestjs/common';
import { FlatResolver } from './flat.resolver';
import { FlatService } from './flat.service';

@Module({
  providers: [FlatResolver, FlatService]
})
export class FlatModule {}
