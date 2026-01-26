import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from "../service/user.service";
import { TenantDto } from "../dto/tenant-dto";
import { JwtAuthGuard } from "src/auth/jwt/jwt-auth.guard";

@ApiTags('User')
@Controller("user")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class UserControllerController {
  constructor(private userService: UserService) {}

  @Get("tenants")
  @ApiOperation({ summary: 'Tenantek lekérése név szerinti szűréssel' })
  @ApiQuery({ name: 'name', required: false, description: 'Név szűréshez' })
  @ApiResponse({ status: 200, description: 'Tenant lista', type: [TenantDto] })
  async getTenants(@Query("name") name?: string) {
    return this.userService.getTenants(name);
  }

  @Post(":tenantId/assign-flat")
  @ApiOperation({ summary: 'Lakás hozzárendelése tenanthez' })
  @ApiParam({ name: 'tenantId', type: Number, description: 'Tenant azonosító' })
  @ApiBody({
    description: 'Hozzárendelendő lakás azonosító',
    schema: {
      type: 'object',
      properties: {
        flatId: { type: 'number' },
      },
      required: ['flatId'],
    },
  })
  @ApiResponse({ status: 201, description: 'Lakás sikeresen hozzárendelve' })
  async assignFlatToTenant(
    @Param("tenantId", ParseIntPipe) tenantId: number,
    @Body("flatId", ParseIntPipe) flatId: number,
  ) {
    return this.userService.assignFlatToTenant(tenantId, flatId);
  }

  @Delete(":tenantId/remove-flat")
  @ApiOperation({ summary: 'Lakás eltávolítása tenanttől' })
  @ApiParam({ name: 'tenantId', type: Number, description: 'Tenant azonosító' })
  @ApiResponse({ status: 200, description: 'Lakás sikeresen eltávolítva a tenanttől' })
  async removeFlatFromTenant(
    @Param("tenantId", ParseIntPipe) tenantId: number,
  ) {
    return this.userService.removeFlatFromTenant(tenantId);
  }
}
