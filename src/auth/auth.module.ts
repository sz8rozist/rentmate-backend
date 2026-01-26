import { Module } from "@nestjs/common";
import { AuthService } from "./service/auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { UserService } from "../user/service/user.service";
import { AuthController } from "./controller/auth.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { config } from "process";

@Module({
  providers: [AuthService, UserService, JwtStrategy],
  imports: [
    PassportModule,
    PrismaModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
