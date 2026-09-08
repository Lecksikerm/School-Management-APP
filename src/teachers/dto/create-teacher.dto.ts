import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateTeacherDto {
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
  staffNumber: string;

  @IsOptional()
  department?: string;

  @IsOptional()
  qualification?: string;

  @IsOptional()
  dateJoined?: Date;
}
