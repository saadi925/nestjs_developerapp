import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { User } from "../user.schema";
enum $PurchaseItemType {
    COURSE = 'Course',
    MEMBERSHIP = 'Membership'
}
enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}
export type InvoiceDocument = Invoice & Document;



@Schema({ timestamps: true })
export class Invoice extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, refPath: 'itemType', required: true })
  item: Types.ObjectId;

  @Prop({  required: true, enum: $PurchaseItemType })
  itemType: $PurchaseItemType;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: Date, required: true })
  purchaseDate: Date;

  @Prop({ type: String, required: true, enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Prop({ type: String })
  paymentMethod: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
