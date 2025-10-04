// src/common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  BadRequestException,
  ArgumentsHost,
  Logger,
} from "@nestjs/common";
import { AppException } from "../exception/app.exception";
import { GraphQLError } from "graphql";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    // Log minden hibát a konzolra
    this.logger.error('Exception caught', exception instanceof Error ? exception.stack : JSON.stringify(exception));

    if (exception instanceof BadRequestException) {
      const response = exception.getResponse(); // ez már a formattedErrors tömb
      throw new GraphQLError("Validation failed", {
        extensions: {
          code: "BAD_REQUEST",
          validationErrors: response,
        },
      });
    }

    if (exception instanceof AppException) {
      throw new GraphQLError(exception.message, {
        extensions: {
          code: exception.error ?? "APP_ERROR",
          status: exception.getStatus(),
        },
      });
    } 

    // Más hibák
    throw new GraphQLError(
      exception.message || "Internal server error",
      {
        extensions: { code: "INTERNAL_ERROR" },
        nodes: undefined,
        source: undefined,
      }
    );
  }
}
