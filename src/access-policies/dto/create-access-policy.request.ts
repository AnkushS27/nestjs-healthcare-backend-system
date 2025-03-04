import { IsString, IsArray, IsEnum, IsObject } from 'class-validator';
import { PolicyEffect } from 'prisma/generated/main';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccessPolicyRequest {
  @ApiProperty({ example: 'office-hours-only', description: 'Unique policy name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Restrict access to office hours', description: 'Policy description' })
  @IsString()
  description: string;

  @ApiProperty({
    example: { time: { gte: '09:00', lte: '17:00' } },
    description: 'Attributes defining access conditions (e.g., time, location)',
  })
  @IsObject()
  attributes: Record<string, any>;

  @ApiProperty({ enum: PolicyEffect, example: 'ALLOW', description: 'Effect of the policy' })
  @IsEnum(PolicyEffect)
  effect: PolicyEffect;

  @ApiProperty({ example: ['/appointments'], description: 'Resources this policy applies to' })
  @IsArray()
  @IsString({ each: true })
  resources: string[];

  @ApiProperty({ example: ['GET', 'POST'], description: 'Actions (HTTP methods) this policy applies to' })
  @IsArray()
  @IsString({ each: true })
  actions: string[];
}