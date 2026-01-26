import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { BaseService } from "src/common/base.service";

@Injectable()
export class UserService extends BaseService {
  constructor(private prisma: PrismaService) {
    super(UserService.name);
  }

  async getTenants(name?: string) {
    if (!name || name.trim() === "") {
      return this.prisma.user.findMany({
        where: { role: "tenant" },
        orderBy: { name: "asc" },
      });
    }

    return this.prisma.user.findMany({
      where: {
        role: "tenant",
        name: {
          contains: name,
        },
      },
      orderBy: { name: "asc" },
    });
  }

  async assignFlatToTenant(tenantId: number, flatId: number) {
    return this.prisma.user.update({
      where: { id: tenantId },
      data: { flatId },
    });
  }

  async removeFlatFromTenant(tenantId: number) {
    return this.prisma.user.update({
      where: { id: tenantId },
      data: { flatId: null },
    });
  }
}
