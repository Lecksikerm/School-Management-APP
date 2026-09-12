import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { BulkAttendanceDto } from './dto/bulk-attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async create(
    @Body() createAttendanceDto: CreateAttendanceDto,
    @CurrentUser() currentUser: { userId: string },
  ) {
    const user = await this.usersService.findById(currentUser.userId);
    return this.attendanceService.create(createAttendanceDto, user!);
  }

  @Post('bulk')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async markBulk(
    @Body() bulkDto: BulkAttendanceDto,
    @CurrentUser() currentUser: { userId: string },
  ) {
    const user = await this.usersService.findById(currentUser.userId);
    return this.attendanceService.markBulk(bulkDto, user!);
  }

  @Get('class/:classId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findByClassAndDate(
    @Param('classId') classId: string,
    @Query('date') date: string,
  ) {
    return this.attendanceService.findByClassAndDate(classId, date);
  }

  @Get('student/:studentId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findByStudent(@Param('studentId') studentId: string) {
    return this.attendanceService.findByStudent(studentId);
  }
}
