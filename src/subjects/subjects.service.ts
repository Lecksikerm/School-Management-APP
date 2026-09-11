import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { TeachersService } from '../teachers/teachers.service';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,
    private readonly teachersService: TeachersService,
  ) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const existing = await this.subjectsRepository.findOne({
      where: { name: createSubjectDto.name },
    });
    if (existing) {
      throw new ConflictException('Subject name already in use');
    }

    const { teacherId, ...subjectFields } = createSubjectDto;
    const subject = this.subjectsRepository.create(subjectFields);

    if (teacherId) {
      const teacher = await this.teachersService.findOne(teacherId);
      if (!teacher) {
        throw new NotFoundException('Teacher not found');
      }
      subject.teacher = teacher;
    }

    return this.subjectsRepository.save(subject);
  }

  async findAll(): Promise<Subject[]> {
    return this.subjectsRepository.find({
      relations: { teacher: true, classes: true },
    });
  }

  async findOne(id: string): Promise<Subject> {
    const subject = await this.subjectsRepository.findOne({
      where: { id },
      relations: { teacher: true, classes: true },
    });
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }
    return subject;
  }
}
