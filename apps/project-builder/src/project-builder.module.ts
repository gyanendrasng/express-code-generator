import { Module } from '@nestjs/common';
import { ProjectBuilderController } from './project-builder.controller';
import { ProjectBuilderService } from './project-builder.service';

@Module({
  imports: [],
  controllers: [ProjectBuilderController],
  providers: [ProjectBuilderService],
})
export class ProjectBuilderModule {}
