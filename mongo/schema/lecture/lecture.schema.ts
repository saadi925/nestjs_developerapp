import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

export type VideoLectureDocument = VideoLecture & Document;
export enum $LessonAccess {
  FREE = 'FREE',
  PAID = 'PAID',
}
@Schema({ timestamps: true })
export class VideoLecture extends Document {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: Number, required: true })
  duration: number; 

  @Prop({ type: String })
  description?: string;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  viewedBy: Types.ObjectId[];

  @Prop({
    default: $LessonAccess.FREE,
    enum: $LessonAccess,
  })
  lessonAccess : $LessonAccess; 
  @Prop({ type: [String], default: [] })
  tags: string[];

}

export const VideoLectureSchema = SchemaFactory.createForClass(VideoLecture);
