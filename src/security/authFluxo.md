Fluxo básico de autenticação:

1. Usuário envia email + senha no /auth/login
2. Backend valida se o usuário existe
3. Confere a senha (bcrypt)
4. Gera um JWT
5. Front salva o token (localStorage, cookies, etc.)
6. Para cada request protegida → envia o token
7. Backend valida o token com um Guard (AuthGuard)
8. Se o token é válido → deixa entrar


Tecnologias: 

* Passport + jwy strategy
- passport: framework de autenticacao usado pelo nestjs
- jwt strategy: valida tokens gerados por mim

* bcrypt
- Para hash de senhas no banco de dados

* Guards
- O authGuard bloqueia request sem token

OU SEJA: 

- login            -> service normal + bcrypt
- gerar token      -> authService + jwtService
- proteger rotas   -> Guards
- validar token    -> strategies (jwt Strategy)