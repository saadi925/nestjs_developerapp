import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { CourseCategory } from 'mongo/schema/course-categories/course-category.schema';
import { $CourseDifficulty } from 'mongo/schema/course/course.schema';
import { Types } from 'mongoose';

export class CreateCourseDto {
  readonly _id: string = undefined;
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  readonly courseId: string;

  @IsNotEmpty()
  readonly category: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  readonly slug: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  readonly content: string;

  @IsString()
  readonly rawData: string;

  @IsString()
  readonly thumbnail: string;

  @IsArray()
  @IsOptional()
  readonly tags?: string[];

  @IsOptional()
  readonly views?: number;

  @IsEnum($CourseDifficulty)
  @IsOptional()
  readonly difficulty?: $CourseDifficulty;

  @IsOptional()
  @IsNumber()
  readonly price: number;
}
