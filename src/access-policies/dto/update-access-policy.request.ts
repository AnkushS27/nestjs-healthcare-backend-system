import { IsString, IsArray, IsEnum, IsObject, IsOptional } from 'class-validator';
import { PolicyEffect } from 'prisma/generated/main';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccessPolicyRequest {
  @ApiProperty({ example: 'updated-office-hours', description: 'Updated policy name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Updated restriction to office hours', description: 'Updated policy description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: { time: { gte: '08:00', lte: '18:00' } },
    description: 'Updated attributes defining access conditions',
    required: false,
  })
  @IsObject()
  @IsOptional()
  attributes?: Record<string, any>;

  @ApiProperty({ enum: PolicyEffect, example: 'DENY', description: 'Updated effect of the policy', required: false })
  @IsEnum(PolicyEffect)
  @IsOptional()
  effect?: PolicyEffect;

  @ApiProperty({ example: ['/appointments', '/medical-records'], description: 'Updated resources', required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  resources?: string[];

  @ApiProperty({ example: ['GET'], description: 'Updated actions (HTTP methods)', required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  actions?: string[];
}