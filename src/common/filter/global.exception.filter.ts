// src/common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  HttpStatus,
  BadRequestException,
  ArgumentsHost,
} from "@nestjs/common";
import { AppException } from "../exception/app.exception";
import { GraphQLError } from "graphql";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {

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
      { extensions: { code: "INTERNAL_ERROR" } , nodes: undefined,
        source: undefined,}
    );
  }
}
