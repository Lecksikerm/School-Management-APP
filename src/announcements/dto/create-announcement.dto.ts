import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { AnnouncementAudience } from '../entities/announcement.entity';

export class CreateAnnouncementDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsEnum(AnnouncementAudience)
  audience?: AnnouncementAudience;
}
