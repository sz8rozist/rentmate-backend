import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  providers: [AuthService, AuthResolver],
  imports: [
    PrismaModule,
    JwtModule.register({
  secret: "supersecretkey",
  signOptions: { expiresIn: '1h' },
})
  ],
})
export class AuthModule {}
