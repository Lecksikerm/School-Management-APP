/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    const { data, meta } = await this.usersService.findAll(paginationQuery);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    const safeData = data.map(({ password, ...safeUser }) => {
      void password;
      return safeUser;
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { data: safeData, meta };
  }
}
