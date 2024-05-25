import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from 'mongo/schema/course/course.schema';
import { CoursePurchase, CoursePurchaseSchema, Invoice, InvoiceSchema } from 'mongo/schema/purchase';
import { User, UserSchema } from 'mongo/schema/user.schema';

@Module({
  imports :[
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      {name : CoursePurchase.name, schema : CoursePurchaseSchema},
      {name : User.name, schema : UserSchema},
      {name : Invoice.name, schema : InvoiceSchema}
    ])
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
