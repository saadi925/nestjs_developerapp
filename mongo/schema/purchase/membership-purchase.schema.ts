import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { User } from "../user.schema";
import { Membership } from "../membership.schema";

export type MembershipPurchaseDocument = MembershipPurchase & Document;

@Schema({ timestamps: true })
export class MembershipPurchase extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Membership', required: true })
  membership: Types.ObjectId;

  @Prop({ type: Date, required: true })
  purchaseDate: Date;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: String, required: true, enum: ['pending', 'completed', 'failed'] })
  paymentStatus: string;
}

export const MembershipPurchaseSchema = SchemaFactory.createForClass(MembershipPurchase);
