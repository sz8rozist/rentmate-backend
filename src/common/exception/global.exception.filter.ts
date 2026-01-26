// common/filters/global-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { BusinessValidationException } from './business.validation.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Üzleti hiba
    if (exception instanceof BusinessValidationException) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: exception.message,
        type: 'BUSINESS_ERROR',
      });
    }

    // JWT / authentikációs hiba
    if (exception instanceof UnauthorizedException) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: 401,
        message: exception.message || 'Unauthorized',
        type: 'AUTH_ERROR',
      });
    }

    // fallback – unexpected error
    console.error(exception);

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
