import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('grades')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradesService.create(createGradeDto);
  }

  @Get('student/:studentId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  findByStudent(@Param('studentId') studentId: string) {
    return this.gradesService.findByStudent(studentId);
  }

  @Get('student/:studentId/summary')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  findByStudentTerm(
    @Param('studentId') studentId: string,
    @Query('term') term: string,
    @Query('academicYear') academicYear: string,
  ) {
    return this.gradesService.findByStudentTerm(studentId, term, academicYear);
  }
}
