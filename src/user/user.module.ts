import { Module } from "@nestjs/common";
import { UserControllerController } from "./controller/user-controller.controller";
import { UserService } from "./service/user.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  providers: [UserService],
  imports: [PrismaModule, AuthModule],
  controllers: [UserControllerController],
})
export class UserModule {}
