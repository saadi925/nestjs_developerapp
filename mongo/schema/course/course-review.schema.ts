import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { User } from '../user.schema';

export type CoursReviewseDocument = CourseReviews & Document;

@Schema({ timestamps: true })
export class CourseReviews extends Document {
  @Prop({type : SchemaTypes.ObjectId,ref : User.name, required : true})
  user : Types.ObjectId 
  @Prop({type : String , required : true, maxlength : 1000, minlength : 1})
  comment : string 
  @Prop({type : Number , required : true, maxlength : 5, minlength : 1})
  rating : number

}

export const CourseReviewsSchema = SchemaFactory.createForClass(CourseReviews);
