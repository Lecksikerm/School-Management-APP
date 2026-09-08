import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
    private readonly usersService: UsersService,
  ) {}

  async create(createTeacherDto: CreateTeacherDto) {
    const existing = await this.teachersRepository.findOne({
      where: { staffNumber: createTeacherDto.staffNumber },
    });
    if (existing) {
      throw new ConflictException('Staff number already in use');
    }

    const { email, password, firstName, lastName, ...teacherFields } =
      createTeacherDto;

    const user = await this.usersService.create({
      email,
      password,
      firstName,
      lastName,
      role: UserRole.TEACHER,
    });

    const teacher = this.teachersRepository.create({
      ...teacherFields,
      user,
    });

    const savedTeacher = await this.teachersRepository.save(teacher);
    const { password: _password, ...safeUser } = savedTeacher.user;
    void _password;

    return {
      message: 'Teacher registered successfully',
      teacher: { ...savedTeacher, user: safeUser },
    };
  }

  async findAll(): Promise<Teacher[]> {
    return this.teachersRepository.find({ relations: { user: true } });
  }

  async findOne(id: string): Promise<Teacher | null> {
    return this.teachersRepository.findOne({
      where: { id },
      relations: { user: true },
    });
  }
}
