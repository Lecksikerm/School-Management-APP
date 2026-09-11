import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';
import { Class } from '../classes/entities/class.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(Class)
    private readonly classesRepository: Repository<Class>,
    private readonly usersService: UsersService,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const existing = await this.studentsRepository.findOne({
      where: { admissionNumber: createStudentDto.admissionNumber },
    });
    if (existing) {
      throw new ConflictException('Admission number already in use');
    }

    const { email, password, firstName, lastName, ...studentFields } =
      createStudentDto;

    const user = await this.usersService.create({
      email,
      password,
      firstName,
      lastName,
      role: UserRole.STUDENT,
    });

    const student = this.studentsRepository.create({
      ...studentFields,
      user,
    });

    const savedStudent = await this.studentsRepository.save(student);
    const { password: _password, ...safeUser } = savedStudent.user;
    void _password;

    return {
      message: 'Student registered successfully',
      student: { ...savedStudent, user: safeUser },
    };
  }

  async findAll(): Promise<Student[]> {
    const students = await this.studentsRepository.find({
      relations: { user: true, class: true },
    });
    return students.map((s) => this.stripPassword(s));
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentsRepository.findOne({
      where: { id },
      relations: { user: true, class: true },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return this.stripPassword(student);
  }

  async enrollInClass(studentId: string, classId: string) {
    const student = await this.studentsRepository.findOne({
      where: { id: studentId },
      relations: { user: true, class: true },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const targetClass = await this.classesRepository.findOne({
      where: { id: classId },
    });
    if (!targetClass) {
      throw new NotFoundException('Class not found');
    }

    student.class = targetClass;
    const savedStudent = await this.studentsRepository.save(student);

    return {
      message: 'Student enrolled successfully',
      student: this.stripPassword(savedStudent),
    };
  }

  private stripPassword(student: Student): Student {
    if (student.user) {
      const { password: _password, ...safeUser } = student.user;
      void _password;
      student.user = safeUser as typeof student.user;
    }
    return student;
  }
}
