import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { PublicUser } from "../dto/user.response";
import { TenantRequest } from "../dto/tenant.request";
import { User } from "../user";

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [PublicUser])
  async tenants(@Args("input", { nullable: true }) input?: TenantRequest) {
    return this.userService.getTenants(input?.name);
  }

  @Mutation(() => User)
  async assignFlatToTenant(
    @Args("tenantId", { type: () => Int }) tenantId: number,
    @Args("flatId", { type: () => Int }) flatId: number
  ) {
    return this.userService.assignFlatToTenant(tenantId, flatId);
  }

  @Mutation(() => User)
  async removeFlatFromTenant(
    @Args("tenantId", { type: () => Int }) tenantId: number
  ) {
    return this.userService.removeFlatFromTenant(tenantId);
  }
}
