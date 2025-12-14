import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import type { Response } from "express";
import { join } from "path";
import { existsSync } from "fs";
import * as jwt from "jsonwebtoken";

@Controller("files")
export class FileController {
  private readonly uploadDir = join(process.cwd(), "upload");
  private readonly jwtSecret = "mock-file-secret";

  @Get(":key")
  async getFile(
    @Param("key") key: string,
    @Query("token") token: string,
    @Res() res: Response
  ) {
    if (!token) throw new HttpException("Token missing", HttpStatus.FORBIDDEN);

    try {
      const payload: any = jwt.verify(token, this.jwtSecret);
      if (payload.key !== key)
        throw new HttpException("Invalid token", HttpStatus.FORBIDDEN);
    } catch (err) {
      throw new HttpException("Invalid or expired token", HttpStatus.FORBIDDEN);
    }

    const filePath = join(this.uploadDir, key);
    if (!existsSync(filePath))
      throw new HttpException("File not found", HttpStatus.NOT_FOUND);

    return res.sendFile(filePath);
  }
}
