// src/common/exceptions/app.exception.ts
import { HttpException } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    public readonly message: string | any, // lehet string vagy field-level error array
    status: number = 400,
    public readonly error: string = 'APP_ERROR',
  ) {
    super({ message, error }, status);
  }
}
