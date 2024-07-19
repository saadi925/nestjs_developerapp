import { IsOptional, IsString } from "class-validator";
import { $MemberShipType } from "mongo/schema/membership.schema";

export class CreateCheckoutSessionDto {
  @IsString()
  priceId: string;

  type: 'membership'| 'course';

  membershipType : $MemberShipType.PRO | $MemberShipType.VIP
   @IsOptional()
   @IsString()
  courseId? : string
}
