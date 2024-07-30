import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from 'process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Use global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS
  app.enableCors({
    origin: '*', // Change to your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization, Custom-Header', // Ensure Authorization is included
    credentials: true, // Optional: Include if you're using cookies or credentials
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('NamMotors Restful API')
    .setDescription('The NamMotors API description')
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', name: 'Authorization', in: 'header' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger module
  SwaggerModule.setup('v1/docs', app, document, {
    swaggerOptions: {
      authAction: {
        token: {
          name: 'Authorization',
          schema: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
          },
          value: 'Bearer <your-token>',
        },
      },
    },
  });

  // Listen on specified port or default to 3000
  const port = env.PORT || 3000;
  await app.listen(port, () => {
    console.log(`Running on port ${port}`);
  });
}

bootstrap();
