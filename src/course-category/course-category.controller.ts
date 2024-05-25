import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CourseCategoryService } from './course-category.service';
import { CreateCourseCategoryDto } from './dto/create-course-category.dto';
import { UpdateCourseCategoryDto } from './dto/update-course-category.dto';

@Controller('course-category')
export class CourseCategoryController {
  constructor(private readonly courseCategoryService: CourseCategoryService) {}

  @Post()
  async create(@Body() createCourseCategoryDto: CreateCourseCategoryDto) {
    return await this.courseCategoryService.create(createCourseCategoryDto);
  }

  @Get()
  async findAll() {
    return await this.courseCategoryService.findAll();
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return await this.courseCategoryService.findOne(slug);
  }

  @Put(':slug')
  async update(@Param('slug') slug: string, @Body() updateCourseCategoryDto: UpdateCourseCategoryDto) {
    return await this.courseCategoryService.update(slug, updateCourseCategoryDto);
  }

  @Delete(':slug')
  async remove(@Param('slug') slug: string) {
    return await this.courseCategoryService.remove(slug);
  }
}
