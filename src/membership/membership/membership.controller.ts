// membership/membership.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateCheckoutSessionDto } from '../dto/create-membership.dto';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { User } from 'mongo/schema/user.schema';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post('create-checkout-session')
  @UseGuards(JwtAuthGuard)
  async createCheckoutSession(
    @Body() createCheckoutSessionDto: CreateCheckoutSessionDto,
    @Req() req: any,
  ) {
    const user = req.user as User;

    return await this.membershipService.createCheckoutSession(
      createCheckoutSessionDto,
      user.id,
    );
  }

  @Post('webhook')
  async handleStripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') sig: string,
  ) {
    if (!sig) {
      throw new BadRequestException('Missing Stripe signature');
    }
    const payload = req.body;
    return this.membershipService.handleStripeWebhook(payload, sig);
  }
  @Get('test')
  async checkStripeWorking() {
    return this.membershipService.testStripe();
  }
}
