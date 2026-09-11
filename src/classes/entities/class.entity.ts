import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Subject } from '../../subjects/entities/subject.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Subject, (subject) => subject.classes)
  @JoinTable()
  subjects: Subject[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
