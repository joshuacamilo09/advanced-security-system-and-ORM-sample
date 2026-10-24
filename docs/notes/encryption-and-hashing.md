# ENCRYPTION


* Processo reversivel: texto -> chiphertest -> texto de novo
* Protege dados sensiveis em repouso ou transito (ex: cartoes, tokens, dados confidenciais). 
* Precisa de key (chave secreta)
* Quem tiver a key pode descriptografar. 

Apenas usa-se a key para recuperar o valor original.


# HASHING 

* Processo irreversível: texto -> hash
* Não existe decrypt. 
* Usado para verificar identidade, não para recuperar valor. 
* Depende de algoritmos fortes como bcrypt ou argon2. 

Usamos quando NUNCA precisamos recuperar o valor


## QUANDO APLICAR ENCRYPTION OU HASHING EM PROJETOS REAIS ? (casos mais comuns)

1. Password do usuário: hashing
2. cartão bancário: encryption
3. Documento: encryption
4. jwt refresh token: hashing
5. access token: hashing
6. Secret keys: encryption



## EXPLICACAO DO INITIALIZATION VECTOR NO ENCRYPTION SERVICE


Em criptografia simétrica moderna (como AES), o **Initialization Vector (IV)** é um valor aleatório usado para iniciar o processo de encriptação.  

- Não precisa ser secreto, mas deve ser único para cada mensagem.  
- Sua função é **evitar padrões repetitivos** no texto criptografado.  

Por exemplo, se encriptarmos `"palavra_qualquer"` duas vezes com a mesma chave, mas com initialization vector diferente, o resultado será diferente a cada vez, o que aumenta a segurança.  


Já o Content, é basicamente o texto criptografado do algoritmo de criptografia. Não é legível, é so uma representacao do algoritmo de criptografia.

* exemplo: 

    - content: '24eriuueieqofbw'

Para descriptografar, o EncryptionService precisa de:
* A mesma chave secreta (ENCRYPTION_KEY)
* O mesmo IV que foi usado na encriptação

Com ambos, é possível converter o conteúdo criptografado de volta para a palavra original