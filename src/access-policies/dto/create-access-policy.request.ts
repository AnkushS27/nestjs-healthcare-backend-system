import { IsString, IsArray, IsEnum, IsObject } from 'class-validator';
import { PolicyEffect } from 'prisma/generated/main';

export class CreateAccessPolicyRequest {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsObject()
  attributes: Record<string, any>; // Flexible JSON structure

  @IsEnum(PolicyEffect)
  effect: PolicyEffect;

  @IsArray()
  @IsString({ each: true })
  resources: string[];

  @IsArray()
  @IsString({ each: true })
  actions: string[];
}