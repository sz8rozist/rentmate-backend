// common/filters/global-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BusinessValidationException } from './business.validation.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof BusinessValidationException) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: exception.message,
        type: 'BUSINESS_ERROR',
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
