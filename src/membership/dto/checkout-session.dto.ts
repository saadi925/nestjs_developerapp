// membership/dto/create-checkout-session.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCheckoutSessionDto {
  @IsString()
  @IsNotEmpty()
  priceId: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}
