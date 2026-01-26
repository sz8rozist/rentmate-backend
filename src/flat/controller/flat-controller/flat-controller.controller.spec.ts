import { Test, TestingModule } from '@nestjs/testing';
import { FlatControllerController } from './flat-controller.controller';

describe('FlatControllerController', () => {
  let controller: FlatControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlatControllerController],
    }).compile();

    controller = module.get<FlatControllerController>(FlatControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
