import { BadRequestException } from "@nestjs/common";

interface ValidationErrors {
  [field: string]: string | string[];
}

export class BusinessValidationException extends BadRequestException {
  constructor(errors: ValidationErrors) {
    super({
      statusCode: 400,
      errors,
    });
  }
}
