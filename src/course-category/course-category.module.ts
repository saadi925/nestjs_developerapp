import { Module } from '@nestjs/common';
import { CourseCategoryService } from './course-category.service';
import { CourseCategoryController } from './course-category.controller';
import {
  CourseCategory,
  CourseCategorySchema,
} from 'mongo/schema/course-categories/course-category.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserSchema } from 'mongo/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseCategory.name, schema: CourseCategorySchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [CourseCategoryController],
  providers: [CourseCategoryService, JwtService],
})
export class CourseCategoryModule {}
