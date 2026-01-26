import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "prisma/prisma.service";
import { BusinessValidationException } from "src/common/exception/business.validation.exception";
import { RegisterDto } from "../dto/register.dto";
import { LoginResponse } from "../dto/login.response";
import { RegisterResponse } from "../dto/register.response";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BusinessValidationException({
        email: "Hibás email vagy jelszó",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new BusinessValidationException({
        email: "Hibás email vagy jelszó",
      });
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwt.sign(payload),
    };
  }

  async register(dto: RegisterDto): Promise<RegisterResponse> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BusinessValidationException({
        email: "Ez az email már regisztrálva van.",
      });
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        role: dto.role || "tenant",
        password: hashedPassword,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
