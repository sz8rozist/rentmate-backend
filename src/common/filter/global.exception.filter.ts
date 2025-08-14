// src/common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { AppException } from '../exception/app.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = gqlHost.getContext();
    const response = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR',
    };

    if (exception instanceof AppException) {
      response.statusCode = exception.getStatus();
      response.message = exception.message;
      response.error = exception.error;
    } else if (exception instanceof HttpException) {
      const res = exception.getResponse() as any;
      response.statusCode = exception.getStatus();
      response.message = res.message || res;
      response.error = res.error || 'HTTP_ERROR';
    } else if (Array.isArray(exception) && exception[0]?.constraints) {
      // class-validator hibák
      response.statusCode = HttpStatus.BAD_REQUEST;
      response.message = exception
        .map(e =>
          Object.values(e.constraints).map(msg => `${e.property}: ${msg}`)
        )
        .flat()
        .join(', ');
      response.error = 'VALIDATION_ERROR';
    }

    return response;
  }
}
