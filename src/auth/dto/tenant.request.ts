// src/user/dto/get-tenants.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class TenantRequest {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;
}
