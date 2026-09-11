import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findAll() {
    return this.classesService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Patch(':id/subjects')
  @Roles(UserRole.ADMIN)
  assignSubjects(
    @Param('id') id: string,
    @Body('subjectIds') subjectIds: string[],
  ) {
    return this.classesService.assignSubjects(id, subjectIds);
  }
}
