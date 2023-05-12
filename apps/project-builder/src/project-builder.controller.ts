import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Project } from './interface';
import { ProjectBuilderService } from './project-builder.service';

@Controller()
export class ProjectBuilderController {
  constructor(private readonly projectBuilderService: ProjectBuilderService) {}

  @EventPattern('project_created')
  handleProjectCreation(data: Project) {
    this.projectBuilderService.createproject(data);
  }

  @EventPattern('project_built')
  handleProjectBuild(data: Project) {
    this.projectBuilderService.buildproject(data);
  }
}
