import { Test, TestingModule } from '@nestjs/testing';
import { DocumentControllerController } from './document-controller.controller';

describe('DocumentControllerController', () => {
  let controller: DocumentControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentControllerController],
    }).compile();

    controller = module.get<DocumentControllerController>(DocumentControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
