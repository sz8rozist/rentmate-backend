import { Module } from "@nestjs/common";
import { AuthService } from "./service/auth.service";
import { AuthResolver } from "./auth.resolver";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { UserService } from "../user/service/user.service";
import { UserResolver } from "../user/user/user.resolver";
import { AuthController } from "./controller/auth.controller";

@Module({
  providers: [AuthService, AuthResolver, UserService, UserResolver],
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: "supersecretkey",
      signOptions: { expiresIn: "1h" },
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
