import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailService } from './email-send.service';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'mongo/schema/user.schema';
import { EmailVerification, EmailVerificationSchema } from 'mongo/schema/email-verification/email-verify.schema';
import { EmailVerificationService } from './email-verification.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: EmailVerification.name, schema: EmailVerificationSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    JwtService,
    EmailVerificationService,
  ],
  exports: [
    AuthService,
    EmailVerificationService,
  ],
})
export class AuthModule {}
