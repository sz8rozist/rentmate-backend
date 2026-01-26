import { Test, TestingModule } from '@nestjs/testing';
import { DocumentServiceService } from './document-service.service';

describe('DocumentServiceService', () => {
  let service: DocumentServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentServiceService],
    }).compile();

    service = module.get<DocumentServiceService>(DocumentServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
