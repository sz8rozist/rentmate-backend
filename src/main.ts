import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filter/global.exception.filter";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import  graphqlUploadExpress  from 'graphql-upload/graphqlUploadExpress.mjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log("Starting RentMate Backend...");
  // Globális validation + whitelist: csak deklarált mezőket engedünk
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((err) => ({
          field: err.property,
          messages: Object.values(err.constraints!),
        }));
        return new BadRequestException(formattedErrors);
      },
    })
  );

  //app.enableCors({ origin: '*' })
  app.enableCors({
  origin: ['http://localhost:3000'],
  credentials: false,
});
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 5 }));

  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
