import { Module } from '@nestjs/common';
import { EncryptionService } from './encryption';
import { EncrytpTextService } from './TextEncryptor.service';
import { EncryptTextController } from './TextEncryptor.controller';

@Module({
  controllers: [EncryptTextController],
  providers: [EncryptionService, EncrytpTextService],
})
export class EncryptionModule {}
