import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Announcement, AnnouncementAudience } from './entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementsRepository: Repository<Announcement>,
  ) {}

  async create(
    createAnnouncementDto: CreateAnnouncementDto,
    postedBy: User,
  ): Promise<Announcement> {
    const announcement = this.announcementsRepository.create({
      ...createAnnouncementDto,
      postedBy,
    });
    return this.announcementsRepository.save(announcement);
  }

  async findAll(): Promise<Announcement[]> {
    return this.announcementsRepository.find({
      relations: { postedBy: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findForAudience(audience: AnnouncementAudience): Promise<Announcement[]> {
    return this.announcementsRepository.find({
      where: { audience: In([AnnouncementAudience.ALL, audience]) },
      relations: { postedBy: true },
      order: { createdAt: 'DESC' },
    });
  }
}
