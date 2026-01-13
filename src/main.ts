import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import { GlobalExceptionFilter } from "./common/exception/global.exception.filter";
import { JwtAuthGuard } from "./auth/jwt/jwt-auth.guard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log("Starting RentMate Backend...");
  // Globális validation + whitelist: csak deklarált mezőket engedünk
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  //app.enableCors({ origin: '*' })
  app.enableCors({
    origin: ["http://localhost:3000"],
    credentials: false,
    maxHttpBufferSize: 1e8, // 100 MB, vagy ami kell
  });
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 5 }));

  app.useGlobalFilters(new GlobalExceptionFilter());
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
