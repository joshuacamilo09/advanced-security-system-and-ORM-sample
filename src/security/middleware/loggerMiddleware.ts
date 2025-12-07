import { NextFunction } from "express";
import { Request, Response } from 'express';
import { Injectable, Logger } from "@nestjs/common";

//Middleware para logar todas as requisições HTTP: 
/*
    Loga cada requisição automaticamente, incluindo: 
        - Método HTTP
        - URL
        - Status da resposta
        - Tempo de execução
*/
@Injectable()
export class LoggerMiddleware {
    private log = new Logger('HTTP')

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl } = req; 
        const start = Date.now();

        res.on('finish', () => {
            const { statusCode } = res; 
            const contentLength = res.get('content-length') || 0;
            const duration = Date.now() - start;

            this.log.log(`${method} ${originalUrl} ${statusCode} ${contentLength} - ${duration}ms`);
        })
        next(); 
    }
}
//DEVEMOS REGISTRAR NO APP MODULE