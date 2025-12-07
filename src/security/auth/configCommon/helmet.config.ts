import helmet from 'helmet';

export function helmetConfig() {
  const isProd = process.env.NODE_ENV === 'production';

  return helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,

    // Em DEV, deixa CSP off para Swagger e ferramentas funcionarem
    contentSecurityPolicy: isProd
      ? {
          directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", 'data:'],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
          },
        }
      : false,
  });
}

//DEV: CSP desligado
//PROD: CSP ativado (filtro estrito contra XSS e eexecuções perigosas)