import { Args, Query, Resolver } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { PublicUser } from "../dto/user.response";
import { TenantRequest } from "../dto/tenant.request";

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [PublicUser])
  async tenants(@Args("input", { nullable: true }) input?: TenantRequest) {
    return this.userService.getTenants(input?.name);
  }
}
