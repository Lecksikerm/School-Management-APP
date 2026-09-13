import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AnnouncementAudience } from './entities/announcement.entity';

@Controller('announcements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnnouncementsController {
  constructor(
    private readonly announcementsService: AnnouncementsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async create(
    @Body() createAnnouncementDto: CreateAnnouncementDto,
    @CurrentUser() currentUser: { userId: string },
  ) {
    const user = await this.usersService.findById(currentUser.userId);
    return this.announcementsService.create(createAnnouncementDto, user!);
  }

  @Get()
  async findAll(@CurrentUser() currentUser: { role: string }) {
    if (currentUser.role === UserRole.ADMIN) {
      return this.announcementsService.findAll();
    }

    const audienceMap: Record<string, AnnouncementAudience> = {
      student: AnnouncementAudience.STUDENTS,
      teacher: AnnouncementAudience.TEACHERS,
      parent: AnnouncementAudience.PARENTS,
    };

    const audience = audienceMap[currentUser.role] ?? AnnouncementAudience.ALL;
    return this.announcementsService.findForAudience(audience);
  }
}
