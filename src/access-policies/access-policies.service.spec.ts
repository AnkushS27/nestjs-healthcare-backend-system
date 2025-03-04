import { Test, TestingModule } from '@nestjs/testing';
import { AccessPoliciesService } from './access-policies.service';

describe('AccessPoliciesService', () => {
  let service: AccessPoliciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccessPoliciesService],
    }).compile();

    service = module.get<AccessPoliciesService>(AccessPoliciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
