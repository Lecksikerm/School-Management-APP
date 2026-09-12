import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Subject } from '../../subjects/entities/subject.entity';

export enum Term {
  FIRST = 'first',
  SECOND = 'second',
  THIRD = 'third',
}

@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  student: Student;

  @ManyToOne(() => Subject, { onDelete: 'CASCADE' })
  subject: Subject;

  @Column({ type: 'enum', enum: Term })
  term: Term;

  @Column()
  academicYear: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  score: number;

  @Column({ nullable: true })
  remarks: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
