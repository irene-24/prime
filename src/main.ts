import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/exceptions/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const globalPrefix = 'api';
  const swaggerPath = `${globalPrefix}/docs`;
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Mentoring Platform API')
    .setDescription('API documentation for the mentoring/booking platform')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-user-id', in: 'header' }, 'x-user-id')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(swaggerPath, app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 8272);
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(
    `📖 Swagger documentation: http://localhost:${port}/${swaggerPath}\n`,
  );
}

bootstrap();
