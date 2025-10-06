// src/user/dto/get-tenants.input.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class TenantRequest {
  @Field({ nullable: true })
  name?: string;
}
