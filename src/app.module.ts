import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CourseCategoryModule } from './course-category/course-category.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from 'mongo/schema/user.schema';
import { AuthService, EmailService, JwtStrategy } from './auth';
import { StripeModule } from './stripe/stripe.module';
import { MembershipModule } from './membership/membership/membership.module';

@Module({
  imports: [
    CourseModule,
    MongooseModule.forRoot('mongodb://localhost:27017/developer_app'),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    CourseCategoryModule,
    AuthModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
    }),
    MembershipModule,
    StripeModule.forRoot(process.env.STRIPE_API_KEY, {
      apiVersion: '2024-04-10',
    }),
  ],

  controllers: [AppController],
  providers: [AppService, JwtStrategy, AuthService, EmailService, JwtStrategy],
  exports: [JwtStrategy, JwtModule],
})
export class AppModule {}
