import { Controller, Post, Body } from '@nestjs/common';
import { EncryptionService } from './encryption';


@Controller('encrypt')
export class EncryptTextController {
  constructor(private readonly encryptTextService: EncryptionService) {}

  @Post('save')
  saveText(@Body('text') text: string) {
    return this.encryptTextService.encrypt(text);
  }

  @Post('read')
  getOriginalText(
    @Body()
    encryptedText: { initializationVector: string; content: string },
  ) {
    return this.encryptTextService.decrypt(encryptedText);
  }
}
