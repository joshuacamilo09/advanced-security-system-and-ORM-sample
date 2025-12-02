import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: string) => ({
        success: 'Returned with success!',
        Date: new Date().toISOString(),
        data,
      })),
    );
  }
}
/*
    se a rota retorna { "name": "Tom" }

    O client recebe: 

    {
        "success": true,
        "timestamp": "2025-11-25T12:45:00.00",
        "data": {"name": "Tom"}
    }
*/
