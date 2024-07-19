import { Injectable, Inject } from '@nestjs/common';
import { Stripe } from 'stripe';
import { STRIPE_CLIENT } from 'src/stripe/stripe.module';
import { Course } from 'mongo/schema/course/course.schema';
import { $MemberShipType } from 'mongo/schema/membership.schema';
export type StripeMetaDataType = {
  type: 'membership'| 'course';
  membershipType? : $MemberShipType.PRO | $MemberShipType.VIP 
  courseId?: string;
};
@Injectable()
export class StripeService {
  constructor(@Inject(STRIPE_CLIENT) private readonly stripeClient: Stripe) {}
  async createProduct(course: Course): Promise<Stripe.Product> {
    return await this.stripeClient.products.create({
      name: course.title,
      images: [course.thumbnail],

      default_price_data: {
        currency: 'usd',
        unit_amount: course.price * 100,

        recurring: {
          interval: 'month',
          interval_count: 1,
        },
      },

      metadata: {
        courseId: course.courseId,
        slug: course.slug,
      },
    });
  }
  async createCustomer(email: string, name: string): Promise<Stripe.Customer> {
    const customer = await this.stripeClient.customers.create({
      email,
      name,
    });
    return customer;
  }

  async createCheckoutSession(
    customerId: string,
    priceId: string,
    type: string,
    courseId? : string
  ): Promise<Stripe.Checkout.Session> {
    return this.stripeClient.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: 3,
      },

      success_url: 'https://your-success-url.com',
      cancel_url: 'https://your-cancel-url.com',
      metadata: { type, courseId },
    });
  }

  verifyWebhook(payload: any, signature: string): Stripe.Event {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    return this.stripeClient.webhooks.constructEvent(
      payload,
      signature,
      endpointSecret,
    );
  }
  async stripeTest() {
    return await this.stripeClient.products.list();
  }
}
