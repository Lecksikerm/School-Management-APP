import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { AttendanceStatus } from '../entities/attendance.entity';

class StudentAttendanceEntry {
  @IsUUID()
  studentId: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;
}

export class BulkAttendanceDto {
  @IsUUID()
  classId: string;

  @IsDateString()
  date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentAttendanceEntry)
  entries: StudentAttendanceEntry[];
}
