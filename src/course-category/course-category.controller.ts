import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { CourseCategoryService } from './course-category.service';
import { CreateCourseCategoryDto } from './dto/create-course-category.dto';
import { UpdateCourseCategoryDto } from './dto/update-course-category.dto';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { Roles } from 'src/auth/role/role.decorator';
import { $UserRole } from 'mongo/schema/user.schema';
import { RolesGuard } from 'src/auth/guard/role.guard';

@Controller('course-category')
export class CourseCategoryController {
  constructor(private readonly courseCategoryService: CourseCategoryService) {}
  @Post()
  // @Roles($UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles($UserRole.ADMIN)
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
  @UseGuards(JwtAuthGuard)
  @Roles($UserRole.ADMIN)
  async update(@Param('slug') slug: string, @Body() updateCourseCategoryDto: UpdateCourseCategoryDto) {
    return await this.courseCategoryService.update(slug, updateCourseCategoryDto);
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard)
  @Roles($UserRole.ADMIN)
  async remove(@Param('slug') slug: string) {
    return await this.courseCategoryService.remove(slug);
  }
}
