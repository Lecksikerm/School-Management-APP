import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { BulkAttendanceDto } from './dto/bulk-attendance.dto';
import { Student } from '../students/entities/student.entity';
import { Class } from '../classes/entities/class.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(Class)
    private readonly classesRepository: Repository<Class>,
  ) {}

  async create(
    createAttendanceDto: CreateAttendanceDto,
    recordedBy: User,
  ): Promise<Attendance> {
    const { studentId, classId, date, status, remarks } = createAttendanceDto;

    const existing = await this.attendanceRepository.findOne({
      where: {
        student: { id: studentId },
        date,
      },
    });
    if (existing) {
      throw new ConflictException(
        'Attendance already recorded for this student on this date',
      );
    }

    const student = await this.studentsRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const foundClass = await this.classesRepository.findOne({
      where: { id: classId },
    });
    if (!foundClass) {
      throw new NotFoundException('Class not found');
    }

    const attendance = this.attendanceRepository.create({
      student,
      class: foundClass,
      date,
      status,
      remarks,
      recordedBy,
    });

    return this.attendanceRepository.save(attendance);
  }

  async markBulk(bulkDto: BulkAttendanceDto, recordedBy: User) {
    const { classId, date, entries } = bulkDto;

    const foundClass = await this.classesRepository.findOne({
      where: { id: classId },
    });
    if (!foundClass) {
      throw new NotFoundException('Class not found');
    }

    const results: Attendance[] = [];
    for (const entry of entries) {
      const student = await this.studentsRepository.findOne({
        where: { id: entry.studentId },
      });
      if (!student) continue;

      const existing = await this.attendanceRepository.findOne({
        where: { student: { id: entry.studentId }, date },
      });
      if (existing) {
        existing.status = entry.status;
        results.push(await this.attendanceRepository.save(existing));
        continue;
      }

      const attendance = this.attendanceRepository.create({
        student,
        class: foundClass,
        date,
        status: entry.status,
        recordedBy,
      });
      results.push(await this.attendanceRepository.save(attendance));
    }

    return {
      message: `Attendance recorded for ${results.length} students`,
      records: results,
    };
  }

  async findByClassAndDate(
    classId: string,
    date: string,
  ): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { class: { id: classId }, date },
      relations: { student: { user: true } },
    });
  }

  async findByStudent(studentId: string): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { student: { id: studentId } },
      relations: { class: true },
      order: { date: 'DESC' },
    });
  }
}
