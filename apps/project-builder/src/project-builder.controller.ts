import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Project } from './interface';
import { BuildingService } from './project-builder.service';

@Controller()
export class KafkaController {
  constructor(private readonly buildingService: BuildingService) {}

  @EventPattern('project_created')
  handleProjectCreation(data: Project) {
    this.buildingService.createproject(data);
  }

  @EventPattern('project_built')
  handleProjectBuild(data: Project) {
    this.buildingService.buildproject(data);
  }
}
