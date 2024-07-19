import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from 'mongo/schema/course/course.schema';
import { Model } from 'mongoose';
import * as zlib from 'zlib';
import { CreateCourseDto } from './dto/create-course.dto';
import { randomUUID } from 'crypto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { StripeService } from 'src/stripe/stripe.service';
type ListCoursesResponse = {
  data: Course[];
  total: number;
  page: number;
  pages: number;
};
@Injectable()
export class CourseService {
  constructor(
    private readonly stripeService: StripeService,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  async create(course: CreateCourseDto): Promise<Course> {
    if (course._id) {
      await this.updateCourse(course._id, course);
    } else {
      const newCourse = new this.courseModel(course);
      const externalId = randomUUID();
      newCourse.slug = this.generateSlug(course.title, externalId.slice(0, 16));
      newCourse.courseId = externalId;
      //   add course to stripe
      const stripeProduct = await this.stripeService.createProduct(newCourse);
      console.log(stripeProduct);

      return newCourse.save();
    }
  }
  private generateSlug(title: string, externalId: string) {
    const slug = `${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')}-${externalId}`;
    return slug;
  }

  async listAllCourses(
    page: number,
    limit: number,
    sort: 'desc' | 'asc',
    filterString?: string,
  ): Promise<ListCoursesResponse> {
    const exclude = '-rawData -content -videoLectures -reviews';
    const filters = filterString ? this.parseFilterString(filterString) : {};

    const count = await this.courseModel.countDocuments(filters).exec();
    const courses = await this.courseModel
      .find(filters)
      .select(exclude)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      data: courses,
      total: count,
      page,
      pages: Math.ceil(count / limit),
    };
  }

  async findCourseBySlug(slug: string) {
    let course = await this.courseModel
      .findOne({ slug })
      .select('-videoLectures -reviews -rawData')
      .exec();
    return course;
  }
  async findCourseForEdit(slug: string) {
    const course = await this.courseModel
      .findOne({ slug })
      .select('-videoLectures -reviews')
      .exec();
    course.rawData = this.decodeEditorRawData(course.rawData);
    return course;
  }
  private decodeEditorRawData(rawData: string) {
    const decodedData = Buffer.from(rawData, 'base64');
    const result = zlib.gunzipSync(decodedData).toString();
    return result;
  }
  async updateCourse(id: string, course: UpdateCourseDto): Promise<Course> {
    return this.courseModel.findByIdAndUpdate(id, course, { new: true }).exec();
  }

  async delete(slug: string): Promise<Course> {
    return this.courseModel.findOneAndDelete({ slug }).exec();
  }

  async findCourseForWatch(slug: string) {
    const course = await this.courseModel
      .findOne({ slug })
      .select('-rawData -content -reviews -thubnail')
      .populate('videoLectures')
      .exec();

    return course;
  }
  async watchLecture(courseSlug: string, lectureId: string) {
    const course = await this.courseModel
      .findOne({ slug: courseSlug })
      .populate({
        path: 'videoLectures',
        match: { _id: lectureId },
      })
      .exec();

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const lecture = course.videoLectures.find(
      (lecture) => lecture._id.toString() === lectureId,
    );
    if (!lecture) {
      throw new NotFoundException('Lecture not found');
    }

    // if (!lecture.viewedBy.includes(userId)) {
    //   lecture.viewedBy.push(userId);
    //   await lecture.save();
    // }
    return lecture;
  }
  private parseFilterString(filterString: string): Record<string, any> {
    const filters: Record<string, any> = {};
    const filterPairs = filterString.split('_and_');

    filterPairs.forEach((pair) => {
      const [field, operator, value] = pair.split('_eq_');
      if (operator === 'eq') {
        filters[field] = value;
      }
    });

    return filters;
  }
}
