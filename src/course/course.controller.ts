import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Roles } from 'src/auth/role/role.decorator';
import { $UserRole } from 'mongo/schema/user.schema';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles($UserRole.ADMIN)
  async create(@Body() createCourseDto: CreateCourseDto) {
    return await this.courseService.create(createCourseDto);
  }

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('filter') filter?: string,
    @Query('order') order?: string,
  ) {
    let sort = 'desc' as 'desc' | 'asc';
    if (order === 'asc' || order === 'desc') {
      sort = order;
    }
    return await this.courseService.listAllCourses(page, limit, sort, filter);
  }

  @Get('watch/:slug')
  async findCourseForWatch(@Param('slug') slug: string) {
    return await this.courseService.findCourseForWatch(slug);
  }

  @Get('watch/:slug/lecture/:lectureId')
  async watchLecture(
    @Param('slug') slug: string,
    @Param('lectureId') lectureId: string,
  ) {
    return await this.courseService.watchLecture(slug, lectureId);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles($UserRole.ADMIN)
  @Get('edit/:slug')
  async findCourseForEdit(@Param('slug') slug: string) {
    return await this.courseService.findCourseForEdit(slug);
  }

  @Get(':slug')
  async findCourse(@Param('slug') slug: string) {
    return await this.courseService.findCourseBySlug(slug);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles($UserRole.ADMIN)
  @Delete(':slug')
  async remove(@Param('slug') slug: string) {
    return await this.courseService.delete(slug);
  }
}
