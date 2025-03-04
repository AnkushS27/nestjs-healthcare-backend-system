import { IsString, IsArray, IsEnum, IsObject, IsOptional } from 'class-validator';
import { PolicyEffect } from 'prisma/generated/main';

export class UpdateAccessPolicyRequest {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  attributes?: Record<string, any>;

  @IsEnum(PolicyEffect)
  @IsOptional()
  effect?: PolicyEffect;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  resources?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  actions?: string[];
}