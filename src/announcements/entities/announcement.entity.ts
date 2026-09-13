import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum AnnouncementAudience {
  ALL = 'all',
  STUDENTS = 'students',
  TEACHERS = 'teachers',
  PARENTS = 'parents',
}

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: AnnouncementAudience,
    default: AnnouncementAudience.ALL,
  })
  audience: AnnouncementAudience;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  postedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
