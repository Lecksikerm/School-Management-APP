import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from './entities/grade.entity';
import { CreateGradeDto } from './dto/create-grade.dto';
import { Student } from '../students/entities/student.entity';
import { Subject } from '../subjects/entities/subject.entity';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Grade)
    private readonly gradesRepository: Repository<Grade>,
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,
  ) {}

  async create(createGradeDto: CreateGradeDto): Promise<Grade> {
    const { studentId, subjectId, term, academicYear, score, remarks } =
      createGradeDto;

    const existing = await this.gradesRepository.findOne({
      where: {
        student: { id: studentId },
        subject: { id: subjectId },
        term,
        academicYear,
      },
    });
    if (existing) {
      throw new ConflictException(
        'Grade already recorded for this student, subject, and term',
      );
    }

    const student = await this.studentsRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const subject = await this.subjectsRepository.findOne({
      where: { id: subjectId },
    });
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    const grade = this.gradesRepository.create({
      student,
      subject,
      term,
      academicYear,
      score,
      remarks,
    });

    return this.gradesRepository.save(grade);
  }

  async findByStudent(studentId: string): Promise<Grade[]> {
    return this.gradesRepository.find({
      where: { student: { id: studentId } },
      relations: { subject: true },
      order: { academicYear: 'DESC', term: 'ASC' },
    });
  }

  async findByStudentTerm(
    studentId: string,
    term: string,
    academicYear: string,
  ) {
    const grades = await this.gradesRepository.find({
      where: { student: { id: studentId }, term: term as any, academicYear },
      relations: { subject: true },
    });

    const average =
      grades.length > 0
        ? grades.reduce((sum, g) => sum + Number(g.score), 0) / grades.length
        : 0;

    return {
      grades,
      average: Math.round(average * 100) / 100,
      letterGrade: this.getLetterGrade(average),
    };
  }

  private getLetterGrade(score: number): string {
    if (score >= 70) return 'A';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    if (score >= 45) return 'D';
    if (score >= 40) return 'E';
    return 'F';
  }
}
