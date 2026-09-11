import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Class } from '../../classes/entities/class.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Teacher, { nullable: true, onDelete: 'SET NULL' })
  teacher: Teacher;

  @ManyToMany(() => Class, (cls: Class) => cls.subjects)
  classes: Class[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
