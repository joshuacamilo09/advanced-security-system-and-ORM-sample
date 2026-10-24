# NestJS Security & Prisma Reference API

A NestJS + Prisma API that puts the main web security mechanisms for a backend in one place, each one implemented, wired into the request pipeline and documented.

It is a reference project: small domain (users and tasks), with the focus on **how authentication and hardening are done**, not on business features. The notes behind each decision are in [`docs/notes`](docs/notes).

## What it implements

| Area | Implementation |
|---|---|
| **Authentication** | Sign-up / login with **JWT access tokens** (short-lived) and **refresh tokens** (long-lived, separate secret) |
| **Refresh token rotation** | Refresh token sent in an **HttpOnly cookie** scoped to `/auth/refresh`; only its **bcrypt hash** is stored, and it is replaced on every refresh. Logout deletes it |
| **Password hashing** | bcrypt, cost 12 |
| **Authorization** | `JwtAuthGuard` with a Passport JWT strategy; role stored on the user and carried in the token |
| **CSRF** | Double-submit cookie (`csrf-csrf`) on the one cookie-authenticated route (`POST /auth/refresh`); token issued by `GET /auth/refresh/csrf-token` |
| **Rate limiting** | `@nestjs/throttler` as a global guard: 100 requests / minute per IP |
| **Security headers** | Helmet, with a strict Content-Security-Policy in production |
| **CORS** | Explicit origin allow-list, credentials enabled |
| **API key middleware** | `x-api-key` check on the `/users` routes |
| **Encryption at rest** | `EncryptionService`: AES-256 with a random IV per message, key derived with scrypt from `ENCRYPTION_KEY` |
| **Input validation** | Global `ValidationPipe` (`whitelist` + `transform`) over `class-validator` DTOs |
| **Logging** | Winston: console + `logs/error.log` + `logs/combined.log` (JSON), plus a request-logging middleware |
| **Response shape** | `TransformInterceptor` that wraps responses in a `{ success, date, data }` envelope (opt-in per controller) |
| **Data access** | Prisma ORM, PostgreSQL, versioned migrations and a seed script |

## Request pipeline

```
request
  → Helmet → CORS → cookie-parser → CSRF (only /auth/refresh)
  → LoggerMiddleware → ThrottlerGuard → JwtAuthGuard / AuthGuard
  → ValidationPipe (DTOs) → Controller → Service → Prisma → PostgreSQL
  → response
```

## Auth flow

```
POST /auth/signup | /auth/login
   ← { access_token }                        (15 min, in the response body)
   ← Set-Cookie: refresh_token (HttpOnly)    (7 days, path=/auth/refresh)

GET  /auth/refresh/csrf-token                → { csrfToken } + CSRF cookie
POST /auth/refresh   X-CSRF-Token: <token>   → new access token + rotated refresh token
POST /auth/logout    Authorization: Bearer   → refresh token hash removed from the DB
GET  /auth/me        Authorization: Bearer   → current user
```

## Running locally

Requirements: Node.js 20+, PostgreSQL.

```bash
npm install
cp .env.example .env          # fill in the secrets
npx prisma migrate deploy     # create the schema
npx prisma db seed            # optional: creates the admin from ADMIN_EMAIL / ADMIN_PASSWORD
npm run start:dev             # http://localhost:3000
```

Generate secrets with `openssl rand -base64 48`. No secret has a hard-coded fallback: the app refuses to start without them.

## Project structure

```
src/
├── security/
│   ├── auth/            controller, service, JWT strategy, guards, DTOs, decorators
│   │   ├── encryption/  AES encryption service + demo endpoints
│   │   └── configCommon/helmet.config.ts
│   ├── middleware/      request logger, API-key middleware
│   └── interceptor/     response envelope (opt-in)
├── user/                users CRUD (protected)
└── main.ts              security pipeline (Helmet, CORS, CSRF, listen)
prisma/                  schema, migrations, seed
docs/notes/              design notes: auth flow, CSRF, CORS, Helmet, hashing vs encryption, logging
```

## Tech stack

TypeScript · NestJS 11 · Prisma · PostgreSQL · Passport JWT · bcrypt · csrf-csrf · Helmet · @nestjs/throttler · class-validator · Winston · Jest
