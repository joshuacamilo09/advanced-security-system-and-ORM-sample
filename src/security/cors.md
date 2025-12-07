## Usamos CORS sempre que: 

- frontend estiver em outro dominio (ex: frontend.com e api.com)
- voce usa cookies (tokens HttpOnly)
- voce usa fetch/axios no frontend

### Por que integramos cors com helmet ? 

- Helmet ajusta e adiciona security headers, mas o CORS também adiciona alguns headers. 

Juntos, protegem: 

- Quais dominios podem acessar a sua API (CORS) 
- Quais navegadoes ou recursos podem interagir (helmet)
- Evitem ataques de clickjakcing, sniffing, mime sniff, open redirects (helmet)
