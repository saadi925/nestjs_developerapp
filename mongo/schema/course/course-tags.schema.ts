import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourseTagsDocument = CourseTags & Document;

@Schema({ timestamps: true })
export class CourseTags extends Document {
  @Prop({required : true})
  name : string
}

export const CourseTagsSchema = SchemaFactory.createForClass(CourseTags);
