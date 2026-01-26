import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { UserService } from "../service/user.service";

@Controller("user")
export class UserControllerController {
  constructor(private userService: UserService) {}

  /**
   * Tenantek lekérése (név szerint szűrhető)
   * GET /users/tenants?name=John
   */
  @Get("tenants")
  async getTenants(@Query("name") name?: string) {
    return this.userService.getTenants(name);
  }

  /**
   * Flat hozzárendelése tenanthez
   * POST /users/:tenantId/assign-flat
   */
  @Post(":tenantId/assign-flat")
  async assignFlatToTenant(
    @Param("tenantId", ParseIntPipe) tenantId: number,
    @Body("flatId", ParseIntPipe) flatId: number,
  ) {
    return this.userService.assignFlatToTenant(tenantId, flatId);
  }

  /**
   * Flat eltávolítása tenanttől
   * DELETE /users/:tenantId/remove-flat
   */
  @Delete(":tenantId/remove-flat")
  async removeFlatFromTenant(
    @Param("tenantId", ParseIntPipe) tenantId: number,
  ) {
    return this.userService.removeFlatFromTenant(tenantId);
  }
}
