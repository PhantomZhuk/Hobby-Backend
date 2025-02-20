import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors(
    {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Accept, Authorization',
      credentials: true
    }
  ))
    .use(helmet({
      contentSecurityPolicy: false,
      frameguard: { action: 'deny' },
      referrerPolicy: { policy: 'no-referrer' },
    }))
    .useGlobalPipes(new ValidationPipe({ whitelist: true }))
    .use(cookieParser())
    .enableCors({
      origin: '*',
    });
  const config = new DocumentBuilder()
    .setTitle('🔥 Hobby API') 
    .setDescription('Documentation API for Hobby – flower shop')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'TimeFlow API Docs',
    customCss: `
      .topbar-wrapper img {content:url('https://your-logo-url.com/logo.png'); width:100px;}
      .swagger-ui .topbar { background-color: #1e293b; }
    `,
  });
  await app.listen(process.env.PORT ?? 5000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();