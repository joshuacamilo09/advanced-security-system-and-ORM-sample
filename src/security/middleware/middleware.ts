import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key']; //verifica se o header foi enviado

    if (apiKey !== process.env.API_KEY) {
      //se nao tiver retorna 401 e finalizae a request
      return res.status(401).json({ message: 'Missing api key' });
    } else {
      console.log(
        'Making a request to',
        req.method,
        '',
        req.originalUrl,
        '...',
      );
      next(); //se tiver chama o next
    }
  }
}
//Depois de criar o moiddleware precios registar ele no module.
