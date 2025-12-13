import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingService } from './logging/logging.service';
import { LoggingInterceptor } from './logging/logging.interceptor';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get LoggingService instance from DI container
  const loggingService = app.get(LoggingService);

  // Apply global interceptor for request/response logging
  app.useGlobalInterceptors(new LoggingInterceptor(loggingService));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Load OpenAPI specification from YAML file
  const apiYamlPath = path.join(process.cwd(), 'doc', 'api.yaml');
  const apiYamlContent = fs.readFileSync(apiYamlPath, 'utf8');
  const document = yaml.parse(apiYamlContent);

  // Setup Swagger UI
  SwaggerModule.setup('doc', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  loggingService.log(`Application is running on port ${port}`, 'Bootstrap');
}
bootstrap();
