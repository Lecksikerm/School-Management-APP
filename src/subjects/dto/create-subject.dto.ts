import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateSubjectDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  code?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsUUID()
  teacherId?: string;
}
