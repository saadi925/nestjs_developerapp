import { Module } from '@nestjs/common';
import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';
import { StripeModule } from 'src/stripe/stripe.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'mongo/schema/user.schema';
import { Membership, MembershipSchema } from 'mongo/schema/membership.schema';
import { StripeService } from 'src/stripe/stripe.service';
import {
  CoursePurchase,
  CoursePurchaseSchema,
  Invoice,
  InvoiceSchema,
} from 'mongo/schema/purchase';

@Module({
  imports: [
    StripeModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Membership.name,
        schema: MembershipSchema,
      },
      {
        name: CoursePurchase.name,
        schema: CoursePurchaseSchema,
      },
      {
        name: Invoice.name,
        schema: InvoiceSchema,
      },
    ]),
  ],
  controllers: [MembershipController],
  providers: [MembershipService, StripeService],
  exports: [MembershipService, StripeService],
})
export class MembershipModule {}
