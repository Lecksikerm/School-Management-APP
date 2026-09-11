import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Class } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { Subject } from '../subjects/entities/subject.entity';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classesRepository: Repository<Class>,
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,
  ) {}

  async create(createClassDto: CreateClassDto): Promise<Class> {
    const existing = await this.classesRepository.findOne({
      where: { name: createClassDto.name },
    });
    if (existing) {
      throw new ConflictException('Class name already in use');
    }

    const newClass = this.classesRepository.create(createClassDto);
    return this.classesRepository.save(newClass);
  }

  async findAll(): Promise<Class[]> {
    return this.classesRepository.find({ relations: { subjects: true } });
  }

  async findOne(id: string): Promise<Class> {
    const foundClass = await this.classesRepository.findOne({
      where: { id },
      relations: { subjects: true },
    });
    if (!foundClass) {
      throw new NotFoundException('Class not found');
    }
    return foundClass;
  }

  async assignSubjects(id: string, subjectIds: string[]): Promise<Class> {
    const foundClass = await this.findOne(id);
    const subjects = await this.subjectsRepository.find({
      where: { id: In(subjectIds) },
    });

    foundClass.subjects = subjects;
    return this.classesRepository.save(foundClass);
  }
}
