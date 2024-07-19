import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Membership, MembershipDocument } from 'mongo/schema/membership.schema';
import { User, UserDocument } from 'mongo/schema/user.schema';
import {  StripeService } from 'src/stripe/stripe.service';
import { CreateCheckoutSessionDto } from '../dto/create-membership.dto';
import { CoursePurchase, Invoice } from 'mongo/schema/purchase';
import { CoursePurchaseDocument } from 'mongo/schema/purchase/course-purchase.schema';
import { InvoiceDocument } from 'mongo/schema/purchase/invoice.schema';
import Stripe from 'stripe';

@Injectable()
export class MembershipService {
  private readonly logger = new Logger(MembershipService.name);

  constructor(
    @InjectModel(Membership.name)
    private membershipModel: Model<MembershipDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(CoursePurchase.name)
    private coursePurchase: Model<CoursePurchaseDocument>,
    @InjectModel(Invoice.name) private invoice: Model<InvoiceDocument>,
    private stripeService: StripeService,
  ) {}

  async createCheckoutSession(
    createCheckoutSessionDto: CreateCheckoutSessionDto,
    userId: string,
  ) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('User not found');
    }

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await this.stripeService.createCustomer(
        user.email,
        user.name,
      );
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    return await this.stripeService.createCheckoutSession(
      customerId,
      createCheckoutSessionDto.priceId,
      createCheckoutSessionDto.type,
      createCheckoutSessionDto.courseId
    );
  }

  async handleStripeWebhook(payload: any, sig: string) {
    const event = this.stripeService.verifyWebhook(payload, sig);
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await this.handleCheckoutSessionCompleted(session);
        break;
      default:
        this.logger.warn(`Unhandled event type ${event.type}`);
    }
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const customerId = session.customer;
    const user = await this.userModel
      .findOne({ stripeCustomerId: customerId })
      .exec();

    if (user) {
      if (session.metadata.type === 'course' && session.metadata.courseId) {
        return await this.handleCoursePurchase(user, session.metadata.courseId);
     } else if (session.metadata.type === 'membership' && typeof session.metadata.membershipType === 'string') {
      const timeOfSubscription = new Date().setFullYear(
        new Date().getFullYear() + 1,
      );
      const membership = new this.membershipModel({
        user: user._id,
        type: session.metadata.type,
        startDate: new Date(),
        endDate: new Date(timeOfSubscription),
        status: 'active',
      });
      await membership.save();

      user.membership = membership;
      await user.save();
     }
    }
  }
  async testStripe() {
    return await this.stripeService.stripeTest();
  }

  async handleCoursePurchase(user: any, courseId: string) {
    const createdCoursePurchase = await this.coursePurchase.create({
      user: user.id,
      course: courseId,
      
    });
    return createdCoursePurchase
  }
}
