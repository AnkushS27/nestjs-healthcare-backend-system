import { Test, TestingModule } from '@nestjs/testing';
import { AccessPoliciesController } from './access-policies.controller';

describe('AccessPoliciesController', () => {
  let controller: AccessPoliciesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessPoliciesController],
    }).compile();

    controller = module.get<AccessPoliciesController>(AccessPoliciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
