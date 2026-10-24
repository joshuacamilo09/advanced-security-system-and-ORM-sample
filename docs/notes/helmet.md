Helmet é um conjunto de middlewares de segurança que configuram HTTP Security Headers automaticamente no seu servidor. 

Ajuda a proteger contra vulnerabilidades web comuns como:

- clickjacking 
- XSS (cross-site scripting)
- MME-sniffing
- injection em headers
- informacoes sensiveis expostas no header
- Entre outras ameaças conhecidas

Ele funciona configurando headers HTTP seguros, por exemplo: 

X-Frame-Options -> preve clickjacking
X-XSS-Protection -> Proteção contra XSS
Strict-Transport-Security -> Força HTTPS
Referrer-Pollicy -> Reduz exposição de origem
Content-Security-Policy -> Bloqueia scripts não confiáveis


Como funciona na prática ? 

Helmet é apenas um conjunto de middlewares.

Exemplo: helmet() = junta vários pequenos middlewares, cada um controlando um header de segurança.

Ele roda antes das rotas para garantir que cada request receba cabeçalhos seguros.


# Alerta da documentação do nestJS

Helmet deve ser registrado antes de qualquer outro app.use() e antes de qualquer rota. 

Porque no express/Fastify:

A ordem dos middlewares importa.
Se voce registrar Helmet depois, ele não será aplicado a rotas anteriores. 

Solution: Colocar helmet no início do main.ts 


# 5. Problemas a usar helmet (CSP + GraphQL)

Quando usamos: 

- Apollo Server (GraphQL)
- CSP (content - security - policy)

pode dar erro de: Some scripts or image are blocked by CSP

a doc recomenda configurar helmet assim:

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
        frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
      },
    },
  }),
);


Podemos usar isso quando:

- Projeto faz o uso de GraphQL playground ou Apollo Sandbox
- Se voce usa CSP (politica de segurança de conteúdo)

Ajustes por ambiente (DEV vs PROD)

Em produção: 

- ativar CSP
- desabilitar inline-scripts
- controlar fontes externas

exemplo: 

const isProd = process.env.NODE_ENV === 'production';

app.use(
  helmet({
    contentSecurityPolicy: isProd
      ? {
          directives: {
            defaultSrc: [`'self'`],
            scriptSrc: [`'self'`],
            imgSrc: [`'self'`, 'data:'],
          },
        }
      : false,
  }),
);