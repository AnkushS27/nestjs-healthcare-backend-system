import { Module } from '@nestjs/common';
import { AccessPoliciesService } from './access-policies.service';
import { AccessPoliciesController } from './access-policies.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AccessPoliciesService],
  controllers: [AccessPoliciesController],
  exports: [AccessPoliciesService],
})
export class AccessPoliciesModule {}
