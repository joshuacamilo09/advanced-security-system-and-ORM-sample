* CSFR só é necessário se voce usa cookies (HttpOnly) para autenticação. 

Se voce usa JWT no header Authorization, não precisa de CSFR. 
Porque o attacker não consegue colocar um header Authorization arbitrário. 

Use CSFR se:

- voce usa cookies com tokens HttpOnly
-  Sessões
- Qualquer autenticação baseada em estado (session-based)