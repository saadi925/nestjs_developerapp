import { DynamicModule, Module, Provider } from '@nestjs/common';
import { Stripe } from 'stripe';

export const STRIPE_CLIENT = 'STRIPE_CLIENT';

@Module({})
export class StripeModule {
  static forRoot(
    apiKey: string,
    config: Stripe.StripeConfig,
    global: boolean = true,
  ): DynamicModule {
    const stripe = new Stripe(apiKey, config);
    const stripeProvider: Provider = {
      provide: STRIPE_CLIENT,
      useValue: stripe,
    };

    return {
      module: StripeModule,
      providers: [stripeProvider],
      exports: [stripeProvider],
      global,
    };
  }
}
