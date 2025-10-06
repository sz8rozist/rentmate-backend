import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { UserRole } from "../user-role";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getTenants(name?: string) {
    if (!name || name.trim() === "") {
      return this.prisma.user.findMany({
        where: { role: UserRole.tenant },
        orderBy: { name: "asc" },
      });
    }

    return this.prisma.user.findMany({
      where: {
        role: UserRole.tenant,
        name: {
          contains: name,
        },
      },
      orderBy: { name: "asc" },
    });
  }
}
