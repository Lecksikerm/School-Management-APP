import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { Term } from '../entities/grade.entity';

export class CreateGradeDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  subjectId: string;

  @IsEnum(Term)
  term: Term;

  @IsNotEmpty()
  academicYear: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @IsOptional()
  remarks?: string;
}
