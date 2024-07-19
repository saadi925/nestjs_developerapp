import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CourseReviews, CourseReviewsSchema } from './course-review.schema';
import {
  CourseCategory,
} from '../course-categories/course-category.schema';
import { Document, SchemaTypes, Types } from 'mongoose';
import { VideoLecture } from '../lecture/lecture.schema';
import { CourseTags } from './course-tags.schema';

export type CourseDocument = Course & Document;
export enum $CourseDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  VERY_HARD = 'VERY_HARD',
}
export enum $CourseAccess {
  FREE = 'FREE',
  PAID = 'PAID',
}
@Schema({ timestamps: true })
export class Course extends Document {
  @Prop({ type: String, required: true, unique: true })
  title: string;
  @Prop({ type: Number, default : 0})
  price: number;
  @Prop({ type: String, required: true, unique: true })
  courseId: string;
  @Prop({ type: SchemaTypes.ObjectId, ref : CourseCategory.name})
  category: Types.ObjectId;
  @Prop({ type: String, required: true, unique: true, index: true })
  slug: string;
  @Prop({ type: String, required: false })
  description?: string;
  @Prop({ type: String })
  content: string;
  @Prop({ type: String })
  rawData: string;
  @Prop({ type: String })
  thumbnail: string;
  @Prop({ type: [CourseTags], default: [] })
  tags: CourseTags[];
  @Prop({ type: Number, default: 0 })
  views: number;
  @Prop({ default: $CourseDifficulty.MEDIUM, enum: $CourseDifficulty })
  difficulty: $CourseDifficulty;
  @Prop({ type: [{ type: Types.ObjectId, ref: VideoLecture.name }] })
  videoLectures: Types.ObjectId[];
  
  @Prop({ default: $CourseAccess.FREE, enum: $CourseAccess })
  access: $CourseAccess;
  @Prop({ type: [CourseReviewsSchema], default : [] })
  reviews?: CourseReviews[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
