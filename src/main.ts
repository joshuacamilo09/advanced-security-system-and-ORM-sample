import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { helmetConfig } from './security/auth/configCommon/helmet.config';
import cookieParser from 'cookie-parser';
import { doubleCsrf } from 'csrf-csrf';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';



async function bootstrap() {

  //LOGGER 
  //estamos usando Loggers winstons para captura de erros de forma profissional, criamos o logger global
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(
              ({ timestamp, level, message }) =>
                `${timestamp} [${level}]: ${message}`,
            ),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    }),
    //isso ja da:
    /* 
      - logs no console 
      - logs de erro em error.log
      - logs gerais em combined.log
    */
  });

  //VALIDATION (global: todos os DTOs são validados e campos desconhecidos são removidos)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  //HELMET 
  app.use(helmetConfig());

  //app.useGlobalInterceptors(new LoggingInterceptor()); //interceptor global (pega o projeto inteiro, esse é o mais usado em projetos reais)
  //app.useGlobalInterceptors(new ErrorCatcherInterceptor());
  //app.useGlobalInterceptors(new TimeoutInterceptor());
  //app.useGlobalInterceptors(new LoggingInterceptor()); //da pra usar o interceptor globalmente
  
  //CORS
  app.enableCors({ 
  origin: [
    //'https://meu-frontend.com',
    'http://localhost:3000',
  ],
    credentials: true, // necessário para cookies, sessões e CSRF
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  });


  //CSRF
  // O refresh token vive num cookie HttpOnly (path /auth/refresh), por isso é a única rota
  // autenticada por cookie e a única que precisa de proteção CSRF (double-submit cookie).
  // O cliente pede o token em GET /auth/refresh/csrf-token e envia-o no header X-CSRF-Token.
  app.use(cookieParser());
  const config = app.get(ConfigService);
  const csrfSecret = config.getOrThrow<string>('CSRF_SECRET');
  const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
    getSecret: () => csrfSecret,
    getSessionIdentifier: (req) => req.cookies?.['refresh_token'] ?? '',
    cookieName: 'csrf_token',
    cookieOptions: {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/auth/refresh',
    },
  });

  const http = app.getHttpAdapter();
  http.get('/auth/refresh/csrf-token', (req: Request, res: Response) => {
    res.json({ csrfToken: generateCsrfToken(req, res) });
  });
  app.use('/auth/refresh', doubleCsrfProtection);

  // listen só depois de registar todos os middlewares (CORS, cookies, CSRF)
  await app.listen(process.env.PORT ?? 3000);

  
  //Rate Limiting (registar no app.module.ts)
}
bootstrap();
