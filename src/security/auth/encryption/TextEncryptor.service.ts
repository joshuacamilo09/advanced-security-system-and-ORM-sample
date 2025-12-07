import { EncryptionService } from "./encryption";

export class EncrytpTextService {
    constructor(private encryptService: EncryptionService) {}
    
    saveText(text: string) {
        const encryptedText = this.encryptService.encrypt(text);
        return encryptedText
    }

    getOriginalText(encryptedText: { initializationVector: string, content: string}) {
        const originalText = this.encryptService.decrypt(encryptedText);
        return originalText
    }
}