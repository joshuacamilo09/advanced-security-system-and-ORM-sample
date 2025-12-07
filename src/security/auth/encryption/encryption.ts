import { Injectable } from "@nestjs/common";
import { createCipheriv, createDecipheriv, privateDecrypt, randomBytes, scrypt } from "crypto";

@Injectable()
export class EncryptionService {
    private readonly algorithm = 'aes-256-ctr';
    private readonly key: Buffer; 

    constructor() {
        const password = process.env.ENCRYPTION_KEY;
        if (!password) {
            throw new Error('Encryption key not found or its wrong');
        }
        this.key= Buffer.alloc(32);

        scrypt(password, 'salt', 32, (err, derivedKey) => {
            if (err){
                throw err;
            }
            derivedKey.copy(this.key)
        })
    }

    encrypt(text: string){
        const initializationVector = randomBytes(16); 
        const cipher = createCipheriv(this.algorithm, this.key, initializationVector);

        const encrypted = Buffer.concat([
            cipher.update(text), cipher.final()
        ])

        return {
            initializationVector: initializationVector.toString('hex'),
            content: encrypted.toString('hex')
        }
    }

    decrypt(hash: { initializationVector: string, content: string }){
        
        const decipher = createDecipheriv(
            this.algorithm,
            this.key,
            Buffer.from(hash.initializationVector, 'hex')
        );
        
        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(hash.content, 'hex')),
            decipher.final()
        ]);
        
        return decrypted.toString();
    }
}

/*
    Se formos usar em algum outro modulo:

    constructor(private encryptionService: EncryptionService) {}

    const encrypted = this.encryptionService.encrypt('secret data');
    const decrypted = this.encryptionService.decrypt(encrypted);

*/