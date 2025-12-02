import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){
    //podemos extender pra tratamento de erros customizados
    //registar jwtstrategy no authmodule providers
}