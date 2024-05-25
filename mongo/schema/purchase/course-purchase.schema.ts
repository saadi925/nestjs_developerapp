import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { Invoice } from './invoice.schema';

export type CoursePurchaseDocument = CoursePurchase & Document;

@Schema({ timestamps: true })
export class CoursePurchase extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  course: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Invoice', required: true })
  invoice: Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const CoursePurchaseSchema = SchemaFactory.createForClass(CoursePurchase);
