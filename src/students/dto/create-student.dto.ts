import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateStudentDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  admissionNumber: string;

  @IsOptional()
  dateOfBirth?: Date;

  @IsOptional()
  gradeLevel?: string;

  @IsOptional()
  guardianName?: string;

  @IsOptional()
  guardianPhone?: string;
}
