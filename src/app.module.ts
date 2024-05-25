import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CourseCategoryModule } from './course-category/course-category.module';
@Module({
  imports: [CourseModule, 
MongooseModule.forRoot('mongodb://localhost:27017/developer_app'),
ConfigModule.forRoot({
  envFilePath : '.env'
}),
CourseCategoryModule
],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
