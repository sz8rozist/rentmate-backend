import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { GlobalExceptionFilter } from "./common/exception/global.exception.filter";
import { JwtAuthGuard } from "./auth/jwt/jwt-auth.guard";
import { BusinessValidationException } from "./common/exception/business.validation.exception";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log("Starting RentMate Backend...");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // csak a DTO-ban deklarált mezőket engedi
      forbidNonWhitelisted: true, // dob ha extra mező van
      transform: true, // automatikus típus konverzió
      exceptionFactory: (errors) => {
        const formattedErrors: Record<string, string> = {};

        errors.forEach((err) => {
          if (err.constraints) {
            formattedErrors[err.property] = Object.values(err.constraints).join(
              ", ",
            );
          } else {
            // ha nincs constraint, adjunk egy fallback üzenetet
            formattedErrors[err.property] = "Invalid value";
          }
        });

        return new BusinessValidationException(formattedErrors);
      },
    }),
  );

  //app.enableCors({ origin: '*' })
  app.enableCors({
    origin: ["http://localhost:3000"],
    credentials: false,
    maxHttpBufferSize: 1e8, // 100 MB, vagy ami kell
  });

  app.useGlobalFilters(new GlobalExceptionFilter());
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
