Boas práticas de segurança aplicadas aqui:

- Passwords hashed com bcrypt (salt rounds 12).
- Refresh token hashed no banco, não armazenar em plain-text.
- Refresh token HttpOnly cookie, reduz chance de XSS roubar.
- Rotation: quando usar refresh, geramos novo refresh token e invalidamos o antigo (hash substituído).
- Access token curto (ex.: 15min). Refresh tokens mais longos (ex.: 7d).

* Em produção, defina secure: true no cookie (https obrigatório).

- Rate limiting nas rotas de login & refresh (não implementado aqui mas recomendado).
- CSRF: ao usar cookie para refresh, considere proteção CSRF (por exemplo enviar um header custom X-CSRF-Token no pedido de refresh — mais seguro).

14) Outras opções (resumo e quando usar)

A) JWT simples (sem refresh tokens)

Simples: só gera access token com expiracao curta.
Contras: quando expira o token, o usuário deve logar de novo; para UX pior.
Use se quiser simplicidade ou se sessions curtas forem aceitáveis.


B) Cookies (HttpOnly) com sessão no servidor

Salva sessionId no cookie, session store no servidor (Redis).
Bom para segurança e revogação imediata.
Use se precisa de controle de sessão centralizado (ex.: logout forçado, invalidar todas sessões).


C) OAuth (Google/Github)

Use Passport strategies passport-google-oauth20, etc.
Boa para login social (delegar senha).
Combine com refresh tokens / criação de usuário local.