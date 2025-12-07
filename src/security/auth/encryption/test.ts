import { EncryptionService } from './encryption';

const password = 'oh yeha';

const encryptionService = new EncryptionService();

const encryptedPassword = encryptionService.encrypt(password);
console.log('Encrypted content:', encryptedPassword);

const decryptedPassword = encryptionService.decrypt(encryptedPassword);
console.log('Decrypted content:', decryptedPassword);

/*
    necessario exportar o env no terminal juntamente com o ts node pra conseguir testar a criptografia:

    export ENCRYPTION_KEY="chave_secreta"
    npx ts-node test.ts
*/