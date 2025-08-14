import { Test, TestingModule } from '@nestjs/testing';
import { FlatResolver } from './flat.resolver';

describe('FlatResolver', () => {
  let resolver: FlatResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlatResolver],
    }).compile();

    resolver = module.get<FlatResolver>(FlatResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
