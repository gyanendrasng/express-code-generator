import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateProjectDto, UpdateProjectDto } from './dtos';
import { ProjectService } from './project.service';
import { GetUser } from 'apps/api-gateway/src/auth/decorator';
import { AccessTokenGuard } from 'apps/api-gateway/src/auth/guards';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  createProject(@Body() body: CreateProjectDto, @GetUser('id') userId: string) {
    return this.projectService.createProject(body, userId);
  }

  @Patch('updateSchema')
  @UseGuards(AccessTokenGuard)
  updateSchema(@Body() body: UpdateProjectDto) {
    return this.projectService.updateSchema(body);
  }
}
