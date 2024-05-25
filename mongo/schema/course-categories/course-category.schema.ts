import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourseCategoryDocument = CourseCategory & Document;

@Schema({ timestamps: true })
export class CourseCategory extends Document {
  @Prop({ type: String, required: true, unique: true })
  name: string;
  @Prop({ type: String, required: true, unique: true })
  slug: string;
  @Prop({ type: String, required : false })
  description?: string;
}

export const CourseCategorySchema = SchemaFactory.createForClass(CourseCategory);
