import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
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
    return this.studentsRepository.find({ relations: { user: true } });
  }

  async findOne(id: string): Promise<Student | null> {
    return this.studentsRepository.findOne({
      where: { id },
      relations: { user: true },
    });
  }
}
