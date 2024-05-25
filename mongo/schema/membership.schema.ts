import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';


export type MembershipDocument = Membership & Document;
enum $MemberShipType {
    BASIC = 'Basic',
    PRO = 'Pro',
    VIP = 'VIP',
}
enum $MembershipStatus {
    ACTIVE = 'active',
    EXPIRED = 'expired', 
    CANCELED = 'canceled', 
    TRIAL = 'trial',
}
@Schema({ timestamps: true })
export class Membership extends Document {
  @Prop({default : $MemberShipType.BASIC, enum : $MemberShipType})
    type: $MemberShipType;
  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default : $MembershipStatus.ACTIVE, enum : $MembershipStatus })
  status: $MembershipStatus;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);
