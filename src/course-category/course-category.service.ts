import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseCategoryDto } from './dto/create-course-category.dto';
import { UpdateCourseCategoryDto } from './dto/update-course-category.dto';
import { CourseCategory, CourseCategoryDocument } from 'mongo/schema/course-categories/course-category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'crypto';

@Injectable()
export class CourseCategoryService {
  constructor(@InjectModel(CourseCategory.name) private categoryModel: Model<CourseCategoryDocument>) {}

  async create(createCourseCategoryDto: CreateCourseCategoryDto): Promise<CourseCategory> {
    const smallId = randomUUID().split('-')[0];
    createCourseCategoryDto.slug = `${createCourseCategoryDto.name.toLowerCase().replace(/ /g, '-')}-${smallId}`;
    const category = await this.categoryModel.create(createCourseCategoryDto);
    return category;
  }

  async findAll(): Promise<CourseCategory[]> {
    return this.categoryModel.find().exec();
  }

  async findOne(slug: string): Promise<CourseCategory> {
    const category = await this.categoryModel.findOne({ slug }).exec();
    if (!category) {
      throw new NotFoundException(`Category with slug '${slug}' not found`);
    }
    return category;
  }

  async update(slug: string, updateCourseCategoryDto: UpdateCourseCategoryDto): Promise<CourseCategory> {
    const updatedCategory = await this.categoryModel.findOneAndUpdate({slug}, updateCourseCategoryDto, { new: true }).exec();
    if (!updatedCategory) {
      throw new NotFoundException(`Category with Slug '${slug}' not found`);
    }
    return updatedCategory;
  }

  async remove(slug: string): Promise<CourseCategory> {
    const deletedCategory = await this.categoryModel.findOneAndDelete({slug}).exec();
    if (!deletedCategory) {
      throw new NotFoundException(`Category with Slug '${slug}' not found`);
    }
    return deletedCategory;
  }
}
