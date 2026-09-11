import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { Subject } from './entities/subject.entity';
import { TeachersModule } from '../teachers/teachers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subject]), TeachersModule],
  providers: [SubjectsService],
  controllers: [SubjectsController],
  exports: [SubjectsService],
})
export class SubjectsModule {}
