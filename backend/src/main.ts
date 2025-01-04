import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors();

  // Use Helmet for security
  app.use(helmet());

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('CRM Campaign Management API')
    .setDescription(
      'API documentation for Email/SMS Campaign Management System',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the server
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port, () => {
    console.log(
      `Application is running on port: ${port}, Swagger documentation is available at: http://localhost:${port}/api`,
    );
  });

  // RabbitMQ microservice
  const emailMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.RMQ,
      options: {
        urls: [configService.get<string>('rabbitmq.url')],
        queue: configService.get<string>('rabbitmq.email_queue'),
      },
    });

  await emailMicroservice.listen();
  console.log('Email Microservice is listening...');
}

bootstrap();
